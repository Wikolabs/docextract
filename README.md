# DocExtract — Extraction intelligente de données depuis des documents

> PDF, factures, formulaires, scans — transformez n'importe quel document en données structurées.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![Tesseract](https://img.shields.io/badge/Tesseract_OCR-5.3-green?style=flat)](https://github.com/tesseract-ocr/tesseract)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.1_70B-FF6B35?style=flat)](https://groq.com)

---

## Vue d'ensemble

DocExtract extrait automatiquement des données structurées depuis des documents non structurés (PDF, images scannées, factures, formulaires). Il combine OCR (Tesseract/EasyOCR), layout analysis (LayoutLM), et LLM pour l'extraction et la validation des champs. Les workflows de traitement documentaire manuels deviennent automatiques.

**Domaine :** Document Intelligence / Process Automation  
**Port VM :** 3020 | **Sous-domaine :** docextract.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Upload docs, review extractions, templates |
| Backend | FastAPI (Python 3.11), Uvicorn | API extraction, validation, export |
| OCR | Tesseract 5.3 + EasyOCR | Text recognition (scans + images) |
| Layout Analysis | PyMuPDF + pdf2image | Structure PDF, tables, zones |
| LLM Extraction | Groq (llama-3.1-70b-versatile) | Extraction structurée + validation |
| NLP | spaCy | NER montants, dates, entités |
| Base de données | PostgreSQL 16 | Documents, extractions, templates |
| Storage | Minio (S3-compatible) | Fichiers documents |
| Queue | Celery + Redis | Traitement asynchrone |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3020) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
pytesseract==0.3.10
easyocr==1.7.1
pymupdf==1.24.0
pdf2image==1.17.0
groq==0.9.0
spacy==3.7.4
celery==5.4.0
redis==5.0.4
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
pydantic==2.7.1
boto3==1.34.0
```

---

## Architecture mono-repo

```
docextract/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx              # Dashboard traitements
│   │   ├── extract/              # Upload + résultats extraction
│   │   ├── templates/            # Templates d'extraction par type doc
│   │   └── review/[id]/          # Review & correction extraction
│   └── src/components/
│       ├── DocumentUploader.tsx  # Drop zone multi-format
│       ├── ExtractionResult.tsx  # Champs extraits avec confidence
│       ├── DocumentViewer.tsx    # PDF viewer avec highlights zones
│       ├── ValidationForm.tsx    # Review humain avec corrections
│       └── TemplateEditor.tsx    # Config champs à extraire par type
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── documents.py      # Upload + CRUD
│   │   │   ├── extraction.py     # POST /extract (async)
│   │   │   └── templates.py      # Templates extraction
│   │   ├── services/
│   │   │   ├── ocr_engine.py     # Tesseract + EasyOCR
│   │   │   ├── pdf_parser.py     # Layout analysis PyMuPDF
│   │   │   ├── llm_extractor.py  # Groq structured extraction
│   │   │   ├── validator.py      # Validation règles métier
│   │   │   └── ner.py            # spaCy NER dates/montants
│   │   └── models/
│   │       ├── document.py
│   │       └── extraction.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#92400e', 'primaryTextColor': '#fff', 'primaryBorderColor': '#78350f', 'lineColor': '#374151', 'secondaryColor': '#fef3c7'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3020)"]
        NEXT["Next.js 14\nDocument Intelligence"]
        API["FastAPI"]
        CELERY["Celery Workers\nAsync extraction"]

        subgraph NLP["📄 Extraction Pipeline"]
            OCR["Tesseract + EasyOCR\nText recognition"]
            LAYOUT["PyMuPDF\nLayout analysis"]
            GROQ["Groq LLM\nStructured extraction"]
            VALID["Validator\nBusiness rules"]
        end

        PG[("PostgreSQL\nDocuments + Extractions")]
        MINIO[("Minio S3\nDocument storage")]
    end

    DOCS["Documents\nPDF / PNG / TIFF"] --> MINIO
    MINIO --> CELERY
    CELERY --> NLP
```

### Séquence — Extraction d'une facture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#92400e', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant USER as Finance Team
    participant API as FastAPI
    participant MINIO as Minio
    participant CELERY as Celery
    participant OCR as OCR Engine
    participant LAYOUT as Layout
    participant GROQ as Groq LLM
    participant VALID as Validator

    USER->>API: POST /documents/upload (facture.pdf, type=invoice)
    API->>MINIO: store(facture.pdf)
    API->>CELERY: enqueue_extraction(doc_id, type=invoice)
    API-->>USER: {doc_id, status: "processing"}

    CELERY->>LAYOUT: parse_pdf(facture.pdf)
    LAYOUT-->>CELERY: {pages, text_blocks, tables}

    CELERY->>OCR: ocr_tables(table_images)
    OCR-->>CELERY: {table_text: "Ligne 1: Service conseil | 3 jours | 1500€/j | 4500€"}

    CELERY->>GROQ: extract_invoice(text, schema={vendor, date, amount, lines, vat})
    GROQ-->>CELERY: {vendor: "Acme Consulting", date: "2024-03-15", total_ht: 4500, vat: 900, total_ttc: 5400, lines: [...]}

    CELERY->>VALID: validate_invoice(extracted)
    VALID-->>CELERY: {valid: true, warnings: ["date format ok", "VAT 20% correct"]}

    CELERY->>API: update_document(doc_id, extraction, status=ready_for_review)
    API-->>USER: WebSocket: extraction_ready
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#92400e', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    DOCUMENT {
        uuid id PK
        string filename
        string doc_type
        string s3_key
        string status
        int pages
        float confidence_avg
        timestamp uploaded_at
    }
    EXTRACTION {
        uuid id PK
        uuid document_id FK
        jsonb extracted_fields
        float confidence
        boolean human_reviewed
        jsonb corrections
        timestamp extracted_at
    }
    EXTRACTION_TEMPLATE {
        uuid id PK
        string doc_type
        jsonb fields_schema
        string system_prompt
        jsonb validation_rules
    }
    EXTRACTION_FIELD {
        uuid id PK
        uuid extraction_id FK
        string field_name
        string value_raw
        string value_normalized
        float confidence
        int bbox_x
        int bbox_y
    }

    DOCUMENT ||--o| EXTRACTION : "has"
    EXTRACTION }o--|| EXTRACTION_TEMPLATE : "uses"
    EXTRACTION ||--o{ EXTRACTION_FIELD : "contains"
```

---

## PRD

### Problème
Les équipes Finance, RH et juridiques passent des heures à ressaisir manuellement des données depuis des documents : factures, contrats, formulaires d'entrée en relation. 80% de ces documents sont identiques structurellement. L'erreur humaine de saisie coûte cher (paiements doublons, TVA incorrecte).

### Solution
DocExtract automatise l'extraction avec un pipeline OCR → Layout → LLM → Validation. Les données sont disponibles en JSON structuré en < 30 secondes. L'interface de review permet au comptable de valider ou corriger en 10 secondes par document.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Comptable | Automatiser la saisie des factures fournisseurs |
| Juriste | Extraire les clauses clés des contrats entrants |
| RH | Traiter les formulaires d'embauche (DPAE, Urssaf) |

### OKRs
- Précision extraction > 95% sur champs critiques (montant, date)
- Temps traitement < 30 secondes par document
- Réduction temps saisie : -80%

---

## User Stories

```
US-01 [Comptable] En tant que comptable,
      je veux uploader 50 factures PDF
      et avoir tous les champs (fournisseur, montant HT/TTC, date, numéro)
      extraits automatiquement
      afin de les importer directement dans notre ERP.

US-02 [Juriste] En tant que juriste,
      je veux extraire les dates d'échéance, les montants et les parties
      de tous les contrats d'un dossier
      afin de préparer un tableau de synthèse en 5 minutes.

US-03 [Admin] En tant qu'admin,
      je veux créer un template d'extraction personnalisé
      pour notre formulaire de bon de commande interne
      afin que le système sache exactement quels champs chercher.

US-04 [Comptable] En tant que comptable,
      je veux voir chaque champ avec son score de confiance
      et corriger facilement les erreurs OCR
      afin d'avoir une boucle de validation rapide.

US-05 [Manager] En tant que manager finance,
      je veux voir le taux d'accuracy des extractions par type de document
      afin d'identifier quels types nécessitent encore de l'amélioration.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Multi-format | PDF natif, PDF scanné, PNG, JPEG, TIFF supportés | ✅ Format badges |
| R2 | Confidence threshold | Champ < 0.75 → marqué "à vérifier" | ✅ Confidence color |
| R3 | Validation TVA | TVA calculée vs extraite : cohérence ≥ 99% | ✅ Validation badge |
| R4 | NER dates | Normalisation dates → format ISO 8601 | ✅ Date normalize |
| R5 | NER montants | Extraction montants avec devise, HT/TTC | ✅ Amount extract |
| R6 | Skew correction | Images en biais < 15° → redressement auto | ✅ Deskew demo |
| R7 | Tables | Extraction de tables structurées (lignes de facture) | ✅ Table viewer |
| R8 | Batch | Upload 100 documents simultanément → file d'attente | ✅ Batch progress |
| R9 | Audit trail | Chaque correction humaine loguée | ✅ Correction log |
| R10 | Export | JSON structuré + CSV + intégration ERP (webhook) | ✅ Export options |

---

## Spécification API

**Base URL :** `http://docextract.wikolabs.com/api/v1`

### POST /documents/upload
```
Content-Type: multipart/form-data
file: facture.pdf, doc_type: invoice
// Response: {"doc_id": "d_xyz", "status": "processing", "eta_seconds": 25}
```

### GET /documents/{id}/extraction
```json
// Response: {
//   "confidence": 0.94,
//   "fields": {"vendor": {"value": "Acme Corp", "confidence": 0.98}, "total_ttc": {"value": 5400.00, "confidence": 0.97}, "date": {"value": "2024-03-15", "confidence": 0.99}},
//   "lines": [{"description": "Service conseil", "quantity": 3, "unit_price": 1500, "total": 4500}]
// }
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Document Uploader** | Drag-and-drop avec preview miniature + type auto-détecté |
| **Extraction Result** | Champs extraits colorés par confiance (vert/orange/rouge) |
| **PDF Viewer** | Viewer avec bounding boxes sur les zones extraites |
| **Validation Form** | Champs éditables pour corrections avec diff highlight |
| **Accuracy Dashboard** | Taux d'extraction correct par type de document |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: docextract, POSTGRES_USER: de_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
  redis:
    image: redis:7-alpine
  minio:
    image: minio/minio
    command: server /data
    environment: {MINIO_ROOT_USER: "${MINIO_USER}", MINIO_ROOT_PASSWORD: "${MINIO_PASSWORD}"}
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://de_user:${POSTGRES_PASSWORD}@postgres/docextract
      GROQ_API_KEY: "${GROQ_API_KEY}"
      MINIO_URL: "http://minio:9000"
    depends_on: [postgres, redis, minio]
    expose: ["8000"]
  worker:
    build: ./backend
    command: celery -A app.worker worker --loglevel=info
    depends_on: [redis]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3020:80"]
volumes:
  pg_data:
  minio_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] OCR PDF (Tesseract + EasyOCR)
- [ ] Extraction LLM (factures, contrats)
- [ ] Interface review + corrections

### Phase 2 — Intelligence
- [ ] Templates personnalisables par type document
- [ ] Validation règles métier (TVA, IBAN)
- [ ] Batch processing

### Phase 3 — Integration
- [ ] Webhook ERP (SAP, Sage, EBP)
- [ ] Fine-tuning LayoutLM sur documents métier
- [ ] API REST pour intégration directe

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
