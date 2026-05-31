"use client";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Each LP customizes only this block
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  name: "DocExtract",
  waPhone: "261386626100",
  palette: {
    mode: "light" as "dark" | "light",
    bg: "#FAFAF9",
    bg2: "#F1F1EE",
    surface: "rgba(0,0,0,0.035)",
    border: "rgba(0,0,0,0.08)",
    txt1: "#1A1816",
    txt2: "#52504B",
    txt3: "#8E8C85",
    accent: "#57534E",
    accentSoft: "rgba(87,83,78,0.10)",
    accentBorder: "rgba(87,83,78,0.35)",
    accentGlow: "rgba(87,83,78,0.18)",
    navBg: "rgba(250,250,249,0.85)",
  },
  content: {
    fr: {
      langLabel: "FR",
      tagLabel: "OCR intelligent · Extraction IA · JSON structure",
      taglines: ["Vos documents entrent.", "Des donnees propres sortent.", "En 5 secondes."],
      taglineAccentIdx: 1,
      desc: "DocExtract analyse vos factures, contrats et formulaires avec un LLM qui comprend le contexte — et livre chaque champ en JSON structure, pret a brancher sur votre ERP ou CRM.",
      navLinks: [
        { label: "Fonctionnalites", href: "#features" },
        { label: "Comment ca marche", href: "#process" },
        { label: "Pourquoi maintenant", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "5s", label: "par document" },
        { value: "99%", label: "precision extraction" },
        { value: "0", label: "template a configurer" },
        { value: "100%", label: "valide avant livraison" },
      ],
      features: [
        { icon: "📄", title: "OCR multiformat", desc: "PDF, PNG, JPEG, TIFF, scan papier — DocExtract lit tout, meme les documents abimes, inclines ou en basse resolution." },
        { icon: "🧠", title: "Extraction par LLM", desc: "Un modele de langage comprend le contexte du document et extrait les bons champs sans template a configurer — factures, contrats, bons de commande." },
        { icon: "✅", title: "Validation automatique", desc: "Regles metier integrees : montants, SIRET, IBAN, TVA, dates — chaque champ extrait est verifie avant livraison. Zero erreur silencieuse." },
      ],
      steps: [
        { num: "01", title: "Envoyez le document", desc: "Glissez votre fichier dans l'interface ou appelez l'API REST. DocExtract accepte les envois unitaires et les lots de milliers de documents." },
        { num: "02", title: "L'IA analyse et extrait", desc: "Le moteur OCR lit le document, le LLM identifie et extrait chaque champ avec son niveau de confiance. Traitement en moins de 5 secondes." },
        { num: "03", title: "Recevez le JSON valide", desc: "Les donnees structurees arrivent dans votre webhook ou S3. Chaque champ est accompagne d'un score de confiance et d'un flag de validation." },
      ],
      persuasion: {
        sectionTag: "Pourquoi maintenant",
        title: "Vos factures arrivent. Quelqu'un les ressaisit a la main. Encore.",
        paragraphs: [
          { type: "pathos", text: "Le 15 du mois, vendredi 17h, le service compta de votre PME industrielle. Une stagiaire ressaisit dans l'ERP la 412eme facture du mois — montant HT, TVA, numero fournisseur, date d'echeance — en regardant alternativement le PDF et l'ecran. Elle se trompe sur le numero de SIRET d'un fournisseur etranger : 0.7% d'erreur de saisie en moyenne sur l'annee. Dans trois mois, l'audit fiscal va detecter cette ligne et votre DAF va passer une semaine entiere a reconstituer l'historique. Ce n'est pas le travail de la stagiaire qui est en cause — c'est le fait que vous payez quelqu'un en 2026 pour faire ce qu'un LLM fait en 5 secondes avec 99% de precision." },
          { type: "logos", text: "L'IDC mesure que le traitement manuel d'une facture coute en moyenne 17 euros (saisie, validation, archivage, recherche d'erreurs) — contre 0.40 euros pour une facture traitee par OCR intelligent. Goldman Sachs estime que l'automatisation documentaire IA va liberer 2.3 millions d'ETP en finance et back-office d'ici 2028. Forrester predit que 90% des entreprises B2B auront abandonne l'OCR a template d'ici 2027 au profit de l'extraction par LLM, parce que les templates ne tiennent pas a l'echelle des 1000+ fournisseurs d'une scale-up moderne." },
          { type: "ethos", text: "Wikolabs construit des agents IA en production depuis 2023 pour des scale-ups B2B, family offices et fintechs reglementees. Nous avons brule nos doigts sur les memes problemes que vous : pipelines qui hallucinent, briefs ignores, dashboards desertes. DocExtract est ce que nous avons construit pour nos propres clients exigeants avant de le proposer au marche." },
          { type: "solution", text: "Concretement : vous deposez le document via interface ou API REST. DocExtract OCRise — meme si le scan est incline ou abime — puis un LLM comprend le contexte et extrait chaque champ sans template. Regles metier integrees pour SIRET, IBAN, TVA, montants et dates : chaque champ est valide avant livraison vers votre ERP ou CRM via webhook. 5 secondes par document, 99% de precision, zero template a maintenir. Votre stagiaire peut enfin faire un vrai metier." },
        ],
      },
      ctaTitle: "Automatisez votre traitement documentaire",
      ctaDesc: "Premiers documents traites en moins d'une heure. Integration API ou webhook en une journee. Aucune carte bancaire.",
      ctaPrimary: "Reserver un appel",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Demander une demo",
      ctaSoonBadge: "Bientot",
      footerTagline: "Extraction documentaire IA et OCR intelligent pour entreprises",
    },
    en: {
      langLabel: "EN",
      tagLabel: "Smart OCR · AI extraction · Structured JSON",
      taglines: ["Documents in.", "Clean data out.", "In 5 seconds."],
      taglineAccentIdx: 1,
      desc: "DocExtract analyzes your invoices, contracts and forms with an LLM that understands context — and delivers each field as structured JSON, ready to plug into your ERP or CRM.",
      navLinks: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#process" },
        { label: "Why now", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "5s", label: "per document" },
        { value: "99%", label: "extraction accuracy" },
        { value: "0", label: "templates to configure" },
        { value: "100%", label: "validated before delivery" },
      ],
      features: [
        { icon: "📄", title: "Multi-format OCR", desc: "PDF, PNG, JPEG, TIFF, paper scans — DocExtract reads everything, even damaged, skewed or low-resolution documents." },
        { icon: "🧠", title: "LLM-based extraction", desc: "A language model understands document context and extracts the right fields with no template to configure — invoices, contracts, purchase orders." },
        { icon: "✅", title: "Automatic validation", desc: "Built-in business rules: amounts, tax IDs, IBAN, VAT, dates — every extracted field is checked before delivery. Zero silent errors." },
      ],
      steps: [
        { num: "01", title: "Send the document", desc: "Drop your file in the interface or call the REST API. DocExtract accepts single uploads and batches of thousands of documents." },
        { num: "02", title: "AI analyzes and extracts", desc: "The OCR engine reads the document, the LLM identifies and extracts each field with its confidence score. Processed in under 5 seconds." },
        { num: "03", title: "Receive validated JSON", desc: "Structured data lands in your webhook or S3 bucket. Every field comes with a confidence score and a validation flag." },
      ],
      persuasion: {
        sectionTag: "Why now",
        title: "Your invoices arrive. Someone retypes them by hand. Still.",
        paragraphs: [
          { type: "pathos", text: "The 15th of the month, Friday 5pm, the accounting team of your industrial SMB. An intern is retyping the 412th invoice of the month into the ERP — net amount, VAT, supplier ID, due date — looking back and forth between the PDF and the screen. She mistypes the tax ID of a foreign supplier: 0.7% data-entry error rate on average for the year. Three months from now, the tax audit will catch that line and your CFO will spend a full week reconstructing the trail. It's not the intern's work that's the problem — it's that you're paying someone in 2026 to do what an LLM does in 5 seconds with 99% accuracy." },
          { type: "logos", text: "IDC measured that processing one invoice manually costs an average of 17 dollars (entry, validation, archiving, error hunting) — versus 0.40 dollars for an invoice handled by smart OCR. Goldman Sachs estimates AI document automation will free up 2.3 million FTEs in finance and back-office by 2028. Forrester predicts 90% of B2B companies will abandon template-based OCR by 2027 in favor of LLM extraction, because templates don't scale to the 1,000+ suppliers of a modern scale-up." },
          { type: "ethos", text: "Wikolabs has been building production AI agents since 2023 for B2B scale-ups, family offices and regulated fintechs. We burned our fingers on the same problems you face: hallucinating pipelines, ignored briefs, abandoned dashboards. DocExtract is what we built for our own demanding customers before bringing it to market." },
          { type: "solution", text: "Concretely: you drop the document via UI or REST API. DocExtract OCRs it — even skewed or damaged scans — then an LLM understands the context and extracts each field with no template. Built-in business rules for tax IDs, IBAN, VAT, amounts and dates: every field is validated before delivery to your ERP or CRM via webhook. 5 seconds per document, 99% accuracy, zero templates to maintain. Your intern can finally do real work." },
        ],
      },
      ctaTitle: "Automate your document processing",
      ctaDesc: "First documents processed in under an hour. API or webhook integration in one day. No credit card.",
      ctaPrimary: "Book a call",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Request a demo",
      ctaSoonBadge: "Soon",
      footerTagline: "AI document extraction and smart OCR for enterprise",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — identical for all LPs
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = P.content[lang];
  const pal = P.palette;
  const isDark = pal.mode === "dark";
  const cardOverlayHover = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";

  const waLink = `https://wa.me/${P.waPhone}?text=${encodeURIComponent(
    lang === "fr"
      ? `Bonjour, je souhaite discuter de ${P.name} avec Wikolabs.`
      : `Hello, I'd like to discuss ${P.name} with Wikolabs.`
  )}`;

  return (
    <div style={{ minHeight: "100vh", background: pal.bg, color: pal.txt1 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.4; transform:scale(1.6); } }
        .wk-card { transition: background .3s, border-color .3s, transform .35s cubic-bezier(.34,1.2,.64,1); }
        .wk-card:hover { background: ${cardOverlayHover} !important; border-color: ${pal.accentBorder} !important; transform: translateY(-6px); }
        .wk-btn { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .wk-btn:hover { opacity:.92; transform:translateY(-2px); box-shadow:0 12px 32px ${pal.accentGlow}; }
        .wk-btn-wa { transition: opacity .2s, transform .2s; }
        .wk-btn-wa:hover { opacity:.92; transform:translateY(-2px); }
        .wk-btn-demo { opacity:.78; transition: opacity .2s, transform .2s, background .2s; }
        .wk-btn-demo:hover { opacity:1; transform:translateY(-2px); background:${pal.accentSoft}!important; }
        .wk-nav-link { color:${pal.txt2}; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; }
        .wk-nav-link:hover { color:${pal.txt1}; }
        .wk-lang { display:inline-flex; border:1px solid ${pal.border}; border-radius:100px; padding:2px; background:${pal.surface}; }
        .wk-lang button { background:transparent; border:none; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:.5px; cursor:pointer; border-radius:100px; color:${pal.txt2}; transition: background .2s, color .2s; font-family:inherit; }
        .wk-lang button.active { background:${pal.accent}; color:${isDark ? "#04080F" : "#FFFFFF"}; }
        @media(max-width:768px){
          .wk-hide-sm{ display:none!important; }
          .wk-hero-title{ font-size:2.4rem!important; }
          .wk-section{ padding-left:20px!important; padding-right:20px!important; }
          .wk-cards-grid{ grid-template-columns: 1fr !important; max-width:380px; margin-left:auto; margin-right:auto; }
          .wk-metrics-row{ justify-content:center; }
          .wk-cta-row{ flex-direction:column; align-items:stretch; max-width:340px; margin-left:auto; margin-right:auto; }
          .wk-cta-row > *{ width:100%; justify-content:center; }
          .wk-persuasion{ padding:60px 20px!important; }
          .wk-foot{ flex-direction:column; gap:12px; text-align:center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="wk-section" style={{ position:"sticky", top:0, zIndex:100, background:pal.navBg, backdropFilter:"blur(20px)", borderBottom:`1px solid ${pal.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", color:pal.txt1 }}>
          {P.name}<span style={{ color:pal.accent }}>.</span>
        </span>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <div className="wk-hide-sm" style={{ display:"flex", gap:22 }}>
            {t.navLinks.map(l => <a key={l.label} href={l.href} className="wk-nav-link">{l.label}</a>)}
          </div>
          <div className="wk-lang" role="group" aria-label="language">
            <button type="button" className={lang==="fr"?"active":""} onClick={()=>setLang("fr")}>FR</button>
            <button type="button" className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
            style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
            {t.ctaPrimary} →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="wk-section" style={{ padding:"100px 40px 80px", maxWidth:1040, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:720, height:600, background:`radial-gradient(ellipse at 50% 30%, ${pal.accentGlow} 0%, transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:100, padding:"6px 18px", animation:"fadeUp .5s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:pal.accent, display:"inline-block", animation:"pulseDot 2s ease-in-out infinite" }} />
          <span style={{ color:pal.accent, fontSize:11.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>{t.tagLabel}</span>
        </div>
        <h1 className="wk-hero-title" style={{ fontSize:"clamp(2.6rem,6vw,5rem)", fontWeight:700, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:28, fontFamily:"'Instrument Serif',Georgia,serif", animation:"fadeUp .5s .08s ease both" }}>
          {t.taglines.map((line, i) => (
            <span key={i} style={{ display:"block", color:i===t.taglineAccentIdx?pal.accent:pal.txt1, fontStyle:i===t.taglineAccentIdx?"italic":"normal" }}>{line}</span>
          ))}
        </h1>
        <p style={{ fontSize:"1.1rem", color:pal.txt2, lineHeight:1.72, maxWidth:600, margin:"0 auto 44px", animation:"fadeUp .5s .16s ease both" }}>{t.desc}</p>
        <div className="wk-metrics-row" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:14, marginBottom:44, animation:"fadeUp .5s .24s ease both" }}>
          {t.metrics.map(m => (
            <div key={m.label} style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"14px 22px", textAlign:"center", minWidth:118 }}>
              <div style={{ fontSize:"1.7rem", fontWeight:800, color:pal.txt1, letterSpacing:"-1.5px", lineHeight:1 }}>{m.value}</div>
              <div style={{ fontSize:"0.62rem", color:pal.txt3, textTransform:"uppercase", letterSpacing:"1.5px", marginTop:5 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
      </section>

      {/* FEATURES */}
      <section id="features" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"Fonctionnalites":"Features"} title={lang==="fr"?"Tout automatise, <em>rien a gerer</em>":"Fully automated, <em>nothing to manage</em>"} />
        <div className="wk-cards-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {t.features.map((f, i) => (
            <div key={f.title} className="wk-card" style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:20, padding:"28px 28px 26px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, opacity:.55 }} />
              <div style={{ fontSize:"2rem", marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:pal.txt1, marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:"0.88rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="wk-section" style={{ padding:"80px 40px", background:pal.bg2 }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionHead pal={pal} tag={lang==="fr"?"Comment ca marche":"How it works"} title={lang==="fr"?"En place en <em>10 minutes</em>":"Live in <em>10 minutes</em>"} />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {t.steps.map((s, i) => (
              <div key={s.num} style={{ display:"flex", alignItems:"flex-start", gap:22, background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"22px 26px" }}>
                <div style={{ flexShrink:0, width:46, height:46, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:pal.accent, fontWeight:800, fontSize:15 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize:"1rem", fontWeight:700, color:pal.txt1, marginBottom:6, lineHeight:1.3 }}>{s.title}</h3>
                  <p style={{ fontSize:"0.87rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSUASION — pathos / logos / ethos / solution */}
      <section id="why" className="wk-persuasion wk-section" style={{ padding:"100px 40px", maxWidth:860, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={t.persuasion.sectionTag} title={t.persuasion.title} />
        <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
          {t.persuasion.paragraphs.map((p, i) => {
            const labelMap: Record<string, { fr: string; en: string }> = {
              pathos:   { fr: "L'enjeu humain",  en: "What's at stake" },
              logos:    { fr: "Les faits",       en: "The facts" },
              ethos:    { fr: "Notre legitimite", en: "Our credibility" },
              solution: { fr: "Notre reponse",   en: "Our answer" },
            };
            const label = labelMap[p.type]?.[lang] ?? "";
            return (
              <div key={i} style={{ borderLeft:`2px solid ${pal.accentBorder}`, paddingLeft:22 }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:pal.accent, marginBottom:10 }}>{label}</div>
                <p style={{ fontSize:"1.02rem", color:pal.txt2, lineHeight:1.85, margin:0 }}>{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="wk-section" style={{ padding:"0 40px 100px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ background:pal.surface, border:`1px solid ${pal.accentBorder}`, borderRadius:24, padding:"64px 48px", textAlign:"center", backgroundImage:`radial-gradient(ellipse at 50% 0%, ${pal.accentSoft} 0%, transparent 65%)` }}>
          <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>{lang==="fr"?"Demarrer":"Get started"}</p>
          <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, marginBottom:14, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif" }}>{t.ctaTitle}</h2>
          <p style={{ color:pal.txt2, fontSize:"1rem", marginBottom:36, lineHeight:1.7, maxWidth:540, margin:"0 auto 36px" }}>{t.ctaDesc}</p>
          <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wk-section" style={{ borderTop:`1px solid ${pal.border}`, padding:"32px 40px" }}>
        <div className="wk-foot" style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:16, color:pal.txt1 }}>{P.name}</span><span style={{ color:pal.accent }}>.</span>
            <span style={{ display:"block", fontSize:12, color:pal.txt3, marginTop:3 }}>{t.footerTagline}</span>
          </div>
          <p style={{ fontSize:13, color:pal.txt3, margin:0 }}>© 2026 {P.name} — {lang==="fr"?"Un produit":"A product by"} <a href="https://wikolabs.com" style={{ color:pal.txt2, textDecoration:"none" }}>Wikolabs</a></p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:13, alignItems:"center" }}>
            <a href="mailto:team@wikolabs.com" style={{ color:pal.txt3, textDecoration:"none" }}>team@wikolabs.com</a>
            <span style={{ color:pal.txt3 }}>·</span>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' style={{ background:"none", border:"none", color:pal.txt3, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:0 }}>{t.ctaPrimary}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SectionHead({ pal, tag, title }: { pal: typeof P.palette; tag: string; title: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>{tag}</p>
      <h2
        style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif", lineHeight:1.15, margin:0 }}
        dangerouslySetInnerHTML={{ __html: title.replace(/<em>/g, `<em style="font-style:italic;color:${pal.accent}">`) }}
      />
    </div>
  );
}

function CtaRow({ t, pal, isDark, waLink }: { t: typeof P.content.fr; pal: typeof P.palette; isDark: boolean; waLink: string }) {
  return (
    <div className="wk-cta-row" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", animation:"fadeUp .5s .32s ease both" }}>
      <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
        style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontFamily:"inherit" }}>
        📅 {t.ctaPrimary}
      </button>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="wk-btn-wa"
        style={{ background:"#25d366", color:"#FFFFFF", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
        💬 {t.ctaWhatsApp}
      </a>
      <a href="/demo" className="wk-btn-demo" data-orig-btn="1"
        style={{ background:"transparent", color:pal.txt2, border:`1px solid ${pal.border}`, borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, display:"inline-flex", alignItems:"center", gap:10, fontFamily:"inherit", position:"relative" }}>
        ✨ {t.ctaDemo}
        <span style={{ fontSize:9, fontWeight:800, letterSpacing:1, padding:"2px 7px", borderRadius:100, border:`1px solid ${pal.accentBorder}`, color:pal.accent, background:pal.accentSoft, textTransform:"uppercase" }}>{t.ctaSoonBadge}</span>
      </a>
    </div>
  );
}
