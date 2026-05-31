import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es DocExtract, un agent IA d'extraction documentaire (OCR intelligent + LLM) qui transforme une facture, un bon de commande ou un contrat en JSON structure et valide. A partir d'un extrait de document texte brut, tu identifies les champs cles et tu produis le JSON pret a etre branche sur un ERP ou un CRM.

Format de sortie exact en MARKDOWN :
**📄 Type de document detecte**
- [type (facture / contrat / bon de commande / autre) + confiance globale en %]

**🔍 Champs extraits**
- [JSON valide entoure de \`\`\`json ... \`\`\` avec : fournisseur, numero_document, date_emission, date_echeance, montant_ht, tva, montant_ttc, devise, iban, siret_fournisseur, lignes (tableau d'objets {description, qte, prix_unitaire})]

**✅ Validation metier**
- [3 a 5 puces : verification SIRET (format 14 chiffres), IBAN (checksum mod-97), TVA (logique HT*taux=montant), coherence dates, ratio TVA/HT]

**⚠️ Anomalies detectees**
- [0 a 3 puces : champs manquants, valeurs aberrantes, doublons potentiels]

Tu DOIS inventer des valeurs realistes si l'extrait est incomplet (jamais "je n'ai pas pu lire le document"). Tu joues le moteur d'extraction qui a deja OCRise et analyse. Style finance/compta technique. Maximum 320 mots.`;

const SYSTEM_PROMPT_EN = `You are DocExtract, an AI document extraction agent (smart OCR + LLM) that turns an invoice, purchase order or contract into structured, validated JSON. From a raw text extract, you identify key fields and produce JSON ready to plug into an ERP or CRM.

Exact MARKDOWN output format:
**📄 Detected document type**
- [type (invoice / contract / PO / other) + overall confidence %]

**🔍 Extracted fields**
- [Valid JSON wrapped in \`\`\`json ... \`\`\` with: supplier, document_number, issue_date, due_date, amount_excl_tax, tax, amount_incl_tax, currency, iban, supplier_tax_id, line_items (array of {description, qty, unit_price})]

**✅ Business validation**
- [3 to 5 bullets: tax-ID format check, IBAN (mod-97 checksum), VAT logic (HT*rate=amount), date coherence, tax-to-net ratio]

**⚠️ Detected anomalies**
- [0 to 3 bullets: missing fields, outliers, potential duplicates]

You MUST invent realistic values if the extract is incomplete (never "I couldn't read the document"). You play the extraction engine that has already OCR'd and analyzed. Finance/accounting technical tone. Maximum 320 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const docText: string = typeof body.docText === "string" ? body.docText.trim().slice(0, 2500) : "";
    const docType: string = typeof body.docType === "string" ? body.docType.trim().slice(0, 30) : "auto";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!docText) {
      return NextResponse.json(
        { error: lang === "fr" ? "Collez le texte du document a extraire." : "Paste the document text to extract." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMockBrief(docText, docType, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Type indique : ${docType}\nTexte du document a extraire :\n---\n${docText}\n---\nGenere le JSON structure et les validations.`
      : `Indicated type: ${docType}\nDocument text to extract:\n---\n${docText}\n---\nGenerate the structured JSON and validations.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      1100
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMockBrief(docText: string, docType: string, lang: "fr" | "en"): string {
  const sample = docText.slice(0, 30).replace(/\n/g, " ");
  if (lang === "en") {
    return `**📄 Detected document type**\n- Invoice — overall confidence 96% (header pattern match + tax-ID detected near top).\n\n**🔍 Extracted fields**\n\`\`\`json\n{\n  "supplier": "ACME Industries SAS",\n  "document_number": "FA-2026-04812",\n  "issue_date": "2026-05-14",\n  "due_date": "2026-06-13",\n  "amount_excl_tax": 4820.00,\n  "tax": 964.00,\n  "amount_incl_tax": 5784.00,\n  "currency": "EUR",\n  "iban": "FR7630006000011234567890189",\n  "supplier_tax_id": "FR12345678901",\n  "line_items": [\n    {"description": "Consulting services May 2026", "qty": 10, "unit_price": 482.00}\n  ]\n}\n\`\`\`\n\n**✅ Business validation**\n- Tax-ID format valid (FR + 11 digits).\n- IBAN mod-97 checksum: passes.\n- VAT logic: 4820.00 × 0.20 = 964.00 (matches declared tax).\n- Issue date < due date by 30 days (standard net 30 term).\n- Tax ratio 20% — matches standard rate for the supplier country.\n\n**⚠️ Detected anomalies**\n- No anomaly detected on this document. Sample echo: "${sample}..."`;
  }
  return `**📄 Type de document detecte**\n- Facture — confiance globale 96% (pattern d'en-tete reconnu + SIRET detecte en haut).\n\n**🔍 Champs extraits**\n\`\`\`json\n{\n  "fournisseur": "ACME Industries SAS",\n  "numero_document": "FA-2026-04812",\n  "date_emission": "2026-05-14",\n  "date_echeance": "2026-06-13",\n  "montant_ht": 4820.00,\n  "tva": 964.00,\n  "montant_ttc": 5784.00,\n  "devise": "EUR",\n  "iban": "FR7630006000011234567890189",\n  "siret_fournisseur": "12345678900012",\n  "lignes": [\n    {"description": "Prestations conseil mai 2026", "qte": 10, "prix_unitaire": 482.00}\n  ]\n}\n\`\`\`\n\n**✅ Validation metier**\n- Format SIRET valide (14 chiffres, checksum Luhn OK).\n- IBAN checksum mod-97 : passe.\n- Logique TVA : 4820.00 × 0.20 = 964.00 (correspond a la TVA declaree).\n- Date emission < date echeance de 30 jours (terme net 30 standard).\n- Taux TVA 20% — correspond au taux standard du pays fournisseur.\n\n**⚠️ Anomalies detectees**\n- Aucune anomalie detectee sur ce document. Echo d'extrait : "${sample}..."`;
}
