export default function DocExtractPage() {
  return (
    <main style={{ fontFamily: "var(--font-body)", color: "#1c1917" }}>
      {/* Nav */}
      <nav style={{ background: "#92400e", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <span style={{ fontFamily: "var(--font-display)", color: "#fef3c7", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.02em" }}>
            DocExtract
          </span>
          <a
            href="mailto:hello@wikolabs.com?subject=DocExtract — Demande de démo"
            style={{ background: "#fef3c7", color: "#92400e", padding: "0.45rem 1.2rem", borderRadius: 6, fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
          >
            Demander une démo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem 3rem" }}>
        <div style={{ display: "inline-block", background: "#fde68a", color: "#92400e", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", padding: "0.25rem 0.75rem", borderRadius: 20, marginBottom: "1rem", textTransform: "uppercase" }}>
          OCR + Extraction structurée
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.2, maxWidth: 700, marginBottom: "1.25rem", color: "#78350f" }}>
          Vos documents lisibles par vos systèmes en 5 secondes
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#57534e", maxWidth: 560, marginBottom: "2rem", lineHeight: 1.65 }}>
          Factures, contrats, formulaires — DocExtract les analyse, les comprend et les livre en JSON propre, prêt à brancher sur votre ERP ou CRM.
        </p>
        <a
          href="mailto:hello@wikolabs.com?subject=DocExtract — Demande de démo"
          style={{ display: "inline-block", background: "#92400e", color: "#fef3c7", padding: "0.8rem 2rem", borderRadius: 8, fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}
        >
          Tester gratuitement →
        </a>
      </section>

      {/* Document → JSON Demo */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1.5rem", alignItems: "center" }}>
          {/* Invoice mockup */}
          <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 12, padding: "1.5rem", boxShadow: "0 4px 20px rgba(146,64,14,0.08)" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a8a29e", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>Document source</div>
            <div style={{ borderBottom: "2px solid #92400e", paddingBottom: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#78350f" }}>FACTURE N° 2024-0847</div>
              <div style={{ fontSize: "0.75rem", color: "#78716c" }}>Eurotrans SARL — SIRET 812 345 678 00014</div>
            </div>
            {[["Client", "SAS Movitex"], ["Date", "14/03/2024"], ["Échéance", "13/04/2024"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.2rem 0", borderBottom: "1px dashed #e7e5e4", color: "#57534e" }}>
                <span>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#a8a29e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#78350f", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                <span>TOTAL TTC</span><span>4 872,00 €</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "#92400e", color: "#fef3c7", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", margin: "0 auto 0.5rem" }}>→</div>
            <div style={{ fontSize: "0.7rem", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>5 sec</div>
          </div>

          {/* JSON output */}
          <div style={{ background: "#1c1917", borderRadius: 12, padding: "1.5rem", fontFamily: "monospace", fontSize: "0.78rem", lineHeight: 1.7, boxShadow: "0 4px 20px rgba(146,64,14,0.12)" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#78716c", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.1em", fontFamily: "var(--font-body)" }}>JSON extrait</div>
            <span style={{ color: "#fde68a" }}>{"{"}</span><br />
            <span style={{ color: "#a8a29e" }}>&nbsp;&nbsp;"vendor"</span><span style={{ color: "#e7e5e4" }}>: </span><span style={{ color: "#86efac" }}>"Eurotrans SARL"</span><span style={{ color: "#e7e5e4" }}>,</span><br />
            <span style={{ color: "#a8a29e" }}>&nbsp;&nbsp;"invoice_no"</span><span style={{ color: "#e7e5e4" }}>: </span><span style={{ color: "#86efac" }}>"2024-0847"</span><span style={{ color: "#e7e5e4" }}>,</span><br />
            <span style={{ color: "#a8a29e" }}>&nbsp;&nbsp;"date"</span><span style={{ color: "#e7e5e4" }}>: </span><span style={{ color: "#86efac" }}>"2024-03-14"</span><span style={{ color: "#e7e5e4" }}>,</span><br />
            <span style={{ color: "#a8a29e" }}>&nbsp;&nbsp;"amount_ttc"</span><span style={{ color: "#e7e5e4" }}>: </span><span style={{ color: "#fdba74" }}>4872.00</span><span style={{ color: "#e7e5e4" }}>,</span><br />
            <span style={{ color: "#a8a29e" }}>&nbsp;&nbsp;"currency"</span><span style={{ color: "#e7e5e4" }}>: </span><span style={{ color: "#86efac" }}>"EUR"</span><span style={{ color: "#e7e5e4" }}>,</span><br />
            <span style={{ color: "#a8a29e" }}>&nbsp;&nbsp;"confidence"</span><span style={{ color: "#e7e5e4" }}>: </span><span style={{ color: "#fdba74" }}>0.99</span><br />
            <span style={{ color: "#fde68a" }}>{"}"}</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#fff8e1", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "#78350f", marginBottom: "2.5rem", textAlign: "center" }}>
            Tout ce dont vous avez besoin
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "📄", title: "OCR Multiformat", desc: "PDF, PNG, JPEG, TIFF, scan papier — DocExtract lit tout, même les documents abîmés ou en biais." },
              { icon: "🧠", title: "Extraction LLM", desc: "Un modèle de langage comprend le contexte et extrait les bons champs, sans template à configurer." },
              { icon: "✅", title: "Validation automatique", desc: "Règles métier intégrées : montants, SIRET, dates, TVA — chaque champ est vérifié avant livraison." },
            ].map((f) => (
              <div key={f.title} style={{ background: "#fff", border: "1px solid #fde68a", borderRadius: 10, padding: "1.5rem" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#92400e", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#57534e", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#92400e", padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#fef3c7", marginBottom: "1rem" }}>
          Prêt à automatiser votre traitement documentaire ?
        </h2>
        <p style={{ color: "#fde68a", marginBottom: "2rem", fontSize: "1rem" }}>Branchez DocExtract en moins d'une journée. Résultats visibles dès le premier document.</p>
        <a
          href="mailto:hello@wikolabs.com?subject=DocExtract — Demande de démo"
          style={{ display: "inline-block", background: "#fef3c7", color: "#92400e", padding: "0.9rem 2.5rem", borderRadius: 8, fontWeight: 700, fontSize: "1.05rem", textDecoration: "none" }}
        >
          Demander une démo gratuite
        </a>
      </section>

      {/* Footer */}
      <footer style={{ background: "#78350f", padding: "1.25rem 2rem", textAlign: "center" }}>
        <p style={{ color: "#fde68a", fontSize: "0.8rem", margin: 0 }}>© 2025 DocExtract — Un produit Wikolabs</p>
      </footer>
    </main>
  );
}
