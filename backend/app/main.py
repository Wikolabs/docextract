"""DocExtract demo backend — production-ready POC.

In production: this service would run a real OCR pipeline (Tesseract / Azure
Document Intelligence), validate extracted fields against business rules,
and push to downstream ERP/CRM via webhooks. For the demo: it only invokes
the LLM and returns simulated extraction + validation.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="DocExtract Demo Backend",
    description="POC backend — Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es DocExtract, un agent IA d'extraction documentaire (OCR intelligent + LLM) qui transforme une facture, un bon de commande ou un contrat en JSON structure et valide. A partir d'un extrait de document texte brut, tu identifies les champs cles et tu produis le JSON pret a etre branche sur un ERP ou un CRM.

Format de sortie exact en MARKDOWN :
**📄 Type de document detecte**
- [type (facture / contrat / bon de commande / autre) + confiance globale en %]

**🔍 Champs extraits**
- [JSON valide entoure de ```json ... ``` avec : fournisseur, numero_document, date_emission, date_echeance, montant_ht, tva, montant_ttc, devise, iban, siret_fournisseur, lignes (tableau d'objets {description, qte, prix_unitaire})]

**✅ Validation metier**
- [3 a 5 puces : verification SIRET (format 14 chiffres), IBAN (checksum mod-97), TVA (logique HT*taux=montant), coherence dates, ratio TVA/HT]

**⚠️ Anomalies detectees**
- [0 a 3 puces : champs manquants, valeurs aberrantes, doublons potentiels]

Tu DOIS inventer des valeurs realistes si l'extrait est incomplet (jamais "je n'ai pas pu lire le document"). Tu joues le moteur d'extraction qui a deja OCRise et analyse. Style finance/compta technique. Maximum 320 mots."""

SYSTEM_PROMPT_EN = """You are DocExtract, an AI document extraction agent (smart OCR + LLM) that turns an invoice, purchase order or contract into structured, validated JSON. From a raw text extract, you identify key fields and produce JSON ready to plug into an ERP or CRM.

Exact MARKDOWN output format:
**📄 Detected document type**
- [type (invoice / contract / PO / other) + overall confidence %]

**🔍 Extracted fields**
- [Valid JSON wrapped in ```json ... ``` with: supplier, document_number, issue_date, due_date, amount_excl_tax, tax, amount_incl_tax, currency, iban, supplier_tax_id, line_items (array of {description, qty, unit_price})]

**✅ Business validation**
- [3 to 5 bullets: tax-ID format check, IBAN (mod-97 checksum), VAT logic (HT*rate=amount), date coherence, tax-to-net ratio]

**⚠️ Detected anomalies**
- [0 to 3 bullets: missing fields, outliers, potential duplicates]

You MUST invent realistic values if the extract is incomplete (never "I couldn't read the document"). You play the extraction engine that has already OCR'd and analyzed. Finance/accounting technical tone. Maximum 320 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    invoice_text: str = Field(..., min_length=1, max_length=2500)
    doc_type: str = Field("auto", max_length=30)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "docextract-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    doc_text = req.invoice_text.strip()
    doc_type = (req.doc_type or "auto").strip() or "auto"
    if not doc_text:
        raise HTTPException(status_code=400, detail="invoice_text_required")

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = (
        f"Type indique : {doc_type}\nTexte du document a extraire :\n---\n{doc_text}\n---\nGenere le JSON structure et les validations."
        if req.lang == "fr"
        else f"Indicated type: {doc_type}\nDocument text to extract:\n---\n{doc_text}\n---\nGenerate the structured JSON and validations."
    )

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(doc_text, doc_type, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=1100,
        )
    except Exception:
        return GenerateResponse(
            brief=_build_mock_brief(doc_text, doc_type, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief (used when no LLM key configured)
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(doc_text: str, doc_type: str, lang: str) -> str:
    sample = doc_text[:30].replace("\n", " ")
    if lang == "en":
        return (
            "**📄 Detected document type**\n"
            "- Invoice — overall confidence 96% (header pattern match + tax-ID detected near top).\n\n"
            "**🔍 Extracted fields**\n"
            "```json\n"
            "{\n"
            "  \"supplier\": \"ACME Industries SAS\",\n"
            "  \"document_number\": \"FA-2026-04812\",\n"
            "  \"issue_date\": \"2026-05-14\",\n"
            "  \"due_date\": \"2026-06-13\",\n"
            "  \"amount_excl_tax\": 4820.00,\n"
            "  \"tax\": 964.00,\n"
            "  \"amount_incl_tax\": 5784.00,\n"
            "  \"currency\": \"EUR\",\n"
            "  \"iban\": \"FR7630006000011234567890189\",\n"
            "  \"supplier_tax_id\": \"FR12345678901\",\n"
            "  \"line_items\": [\n"
            "    {\"description\": \"Consulting services May 2026\", \"qty\": 10, \"unit_price\": 482.00}\n"
            "  ]\n"
            "}\n"
            "```\n\n"
            "**✅ Business validation**\n"
            "- Tax-ID format valid (FR + 11 digits).\n"
            "- IBAN mod-97 checksum: passes.\n"
            "- VAT logic: 4820.00 x 0.20 = 964.00 (matches declared tax).\n"
            "- Issue date < due date by 30 days (standard net 30 term).\n"
            "- Tax ratio 20% — matches standard rate for the supplier country.\n\n"
            "**⚠️ Detected anomalies**\n"
            f"- No anomaly detected on this document. Sample echo: \"{sample}...\""
        )
    return (
        "**📄 Type de document detecte**\n"
        "- Facture — confiance globale 96% (pattern d'en-tete reconnu + SIRET detecte en haut).\n\n"
        "**🔍 Champs extraits**\n"
        "```json\n"
        "{\n"
        "  \"fournisseur\": \"ACME Industries SAS\",\n"
        "  \"numero_document\": \"FA-2026-04812\",\n"
        "  \"date_emission\": \"2026-05-14\",\n"
        "  \"date_echeance\": \"2026-06-13\",\n"
        "  \"montant_ht\": 4820.00,\n"
        "  \"tva\": 964.00,\n"
        "  \"montant_ttc\": 5784.00,\n"
        "  \"devise\": \"EUR\",\n"
        "  \"iban\": \"FR7630006000011234567890189\",\n"
        "  \"siret_fournisseur\": \"12345678900012\",\n"
        "  \"lignes\": [\n"
        "    {\"description\": \"Prestations conseil mai 2026\", \"qte\": 10, \"prix_unitaire\": 482.00}\n"
        "  ]\n"
        "}\n"
        "```\n\n"
        "**✅ Validation metier**\n"
        "- Format SIRET valide (14 chiffres, checksum Luhn OK).\n"
        "- IBAN checksum mod-97 : passe.\n"
        "- Logique TVA : 4820.00 x 0.20 = 964.00 (correspond a la TVA declaree).\n"
        "- Date emission < date echeance de 30 jours (terme net 30 standard).\n"
        "- Taux TVA 20% — correspond au taux standard du pays fournisseur.\n\n"
        "**⚠️ Anomalies detectees**\n"
        f"- Aucune anomalie detectee sur ce document. Echo d'extrait : \"{sample}...\""
    )
