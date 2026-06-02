"use client";
import { useState } from "react";

const PRODUCT = "DocExtract";

const PAL = {
  bg: "#FAFAF9",
  bg2: "#F1F1EE",
  surface: "rgba(0,0,0,0.035)",
  surfaceHover: "rgba(0,0,0,0.06)",
  border: "rgba(0,0,0,0.08)",
  txt1: "#1A1816",
  txt2: "#52504B",
  txt3: "#8E8C85",
  accent: "#57534E",
  accentSoft: "rgba(87,83,78,0.10)",
  accentBorder: "rgba(87,83,78,0.35)",
  accentGlow: "rgba(87,83,78,0.18)",
  navBg: "rgba(250,250,249,0.85)",
};

const SAMPLE_INVOICE_FR = `FACTURE
ACME Industries SAS
SIRET : 12345678900012  TVA : FR12345678901
12 rue des Lilas, 75011 Paris

Facture n° FA-2026-04812
Date d'emission : 14/05/2026
Date d'echeance : 13/06/2026

Client : Wikolabs SAS

Prestations conseil mai 2026 — 10 j × 482,00 EUR = 4 820,00 EUR HT
TVA 20% : 964,00 EUR
Total TTC : 5 784,00 EUR

IBAN : FR76 3000 6000 0112 3456 7890 189
Conditions : reglement a 30 jours net.`;

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [docText, setDocText] = useState(SAMPLE_INVOICE_FR);
  const [docType, setDocType] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " — extraction structuree de documents par LLM",
    desc: "Collez le texte brut d'une facture, d'un contrat ou d'un bon de commande. Le moteur extrait les champs cles en JSON valide avec verifications metier (SIRET, IBAN, TVA). Aucune integration ERP reelle — c'est un POC qui montre la logique de production.",
    docLabel: "Texte du document a extraire", docPlaceholder: "Collez ici le texte brut d'une facture, contrat ou bon de commande...",
    typeLabel: "Type de document",
    typeAuto: "Auto-detection", typeInvoice: "Facture", typeContract: "Contrat", typePO: "Bon de commande",
    generate: "Extraire les champs", generating: "Extraction en cours...",
    briefTitle: "Donnees extraites", emptyHint: "Le JSON structure et les validations apparaitront ici.",
    sendErp: "Envoyer dans Sage / SAP", sendCrm: "Sync dans Salesforce", saveS3: "Archiver dans S3",
    erpMock: "Facture poussee dans Sage 100 module compta fournisseur (mode demo, pas de connexion ERP)",
    crmMock: "Document attache au compte CRM correspondant (mode demo, pas de connexion Salesforce)",
    s3Mock: "Document archive dans s3://docextract-prod/2026/05/ (mode demo, pas d'upload reel)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC — aucune connexion reelle a un ERP (Sage, SAP), CRM (Salesforce) ou S3. L'IA extrait pour la demonstration.",
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " — LLM-powered structured document extraction",
    desc: "Paste the raw text of an invoice, contract or purchase order. The engine extracts key fields into validated JSON with business checks (tax ID, IBAN, VAT). No real ERP integration — this is a POC showing production logic.",
    docLabel: "Document text to extract", docPlaceholder: "Paste raw text of an invoice, contract or PO here...",
    typeLabel: "Document type",
    typeAuto: "Auto-detect", typeInvoice: "Invoice", typeContract: "Contract", typePO: "Purchase Order",
    generate: "Extract fields", generating: "Extracting...",
    briefTitle: "Extracted data", emptyHint: "Structured JSON and validations will appear here.",
    sendErp: "Push to Sage / SAP", sendCrm: "Sync to Salesforce", saveS3: "Archive to S3",
    erpMock: "Invoice pushed to Sage 100 supplier accounting module (demo mode, no real ERP connection)",
    crmMock: "Document attached to matching CRM account (demo mode, no real Salesforce connection)",
    s3Mock: "Document archived to s3://docextract-prod/2026/05/ (demo mode, no real upload)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC — no real connection to ERP (Sage, SAP), CRM (Salesforce) or S3. The AI extracts for demonstration.",
  };

  async function generate() {
    setError(""); setBrief(""); setModel(""); setStaticMode(false);
    if (!docText.trim()) {
      setError(lang === "fr" ? "Collez le texte d'un document." : "Paste a document text.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docText: docText.trim(), docType, lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setBrief(j.mockBrief || "");
        setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setBrief(j.brief || "");
        setModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #FFFFFF; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: ${PAL.surface}; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        .wk-md pre { background: rgba(0,0,0,0.05); border: 1px solid ${PAL.border}; border-radius: 8px; padding: 12px; overflow-x: auto; font-size: 12px; font-family: 'Menlo','Monaco',monospace; }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← {t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: PAL.surface }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} · <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>
          <section style={{ background: PAL.surface, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 14px" }}>{t.docLabel}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <textarea className="wk-input" value={docText} onChange={(e) => setDocText(e.target.value)} placeholder={t.docPlaceholder} rows={12} style={{ resize: "vertical", fontFamily: "'Menlo','Monaco',monospace", fontSize: 12 }} />
              <label style={{ fontSize: 11, color: PAL.txt3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginTop: 6 }}>{t.typeLabel}</label>
              <select className="wk-input" value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="auto">{t.typeAuto}</option>
                <option value="invoice">{t.typeInvoice}</option>
                <option value="contract">{t.typeContract}</option>
                <option value="po">{t.typePO}</option>
              </select>
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? `⏳ ${t.generating}` : `📄 ${t.generate}`}
            </button>
            {error && <div style={{ marginTop: 12, color: "#B91C1C", fontSize: 13, padding: "8px 12px", background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.3)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: brief ? "#16A34A" : PAL.txt3 }} />
                {t.briefTitle}
              </h2>
              {model && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {model}</span>}
            </div>

            {!brief ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>
                {t.emptyHint}
              </div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} />
            )}

            {brief && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.erpMock)}>📊 {t.sendErp}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.crmMock)}>☁️ {t.sendCrm}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.s3Mock)}>🗄️ {t.saveS3}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, backdropFilter: "blur(20px)", boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  let codeBuf: string[] = [];
  let inCode = false;
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  const flushCode = () => {
    if (codeBuf.length) {
      blocks.push("<pre>" + esc(codeBuf.join("\n")) + "</pre>");
      codeBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    if (raw.trim().startsWith("```")) {
      if (inCode) { flushCode(); inCode = false; } else { flushList(); inCode = true; }
      continue;
    }
    if (inCode) { codeBuf.push(raw); continue; }
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  flushCode();
  return blocks.join("");
}
