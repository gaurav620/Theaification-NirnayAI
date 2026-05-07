# NirnayAI — Round 1 Solution Document
## Theme 3: AI-Based Tender Evaluation and Eligibility Analysis for Government Procurement (CRPF)

**Team:** Theaification  
**Date:** May 2026  
**Submission Type:** Written Solution + Working Prototype

---

## 1. Problem Understanding

### The Reality of Government Procurement

Government procurement in India operates under strict legal frameworks — GFR 2017, CVC guidelines, and procurement-specific rules like DPP. A tender document is not a simple form: it is a legally binding specification that mixes formal eligibility conditions, technical standards, financial thresholds, compliance requirements, and administrative procedures across 30–200 pages of dense government language.

Bidder submissions are equally complex. Ten bidders submitting for a single tender can mean 300–500 individual documents: typed PDFs, scanned certificates, Word files, spreadsheet annexures, and even photographs of physical documents taken on a mobile phone. The same piece of information — say, annual turnover — may appear as a number in an audited balance sheet, as a CA certificate with a UDIN, or as a handwritten figure on a ledger page.

The current manual process asks a small procurement committee to cross-check every bidder against every criterion, using paper documents or scanned copies, often within a tight timeline. This creates three structural problems:

1. **Inconsistency** — Two evaluators reading the same scanned certificate may reach different conclusions about whether a figure clears the threshold.
2. **Oversight** — With 10 criteria × 10 bidders = 100 evaluation points, items are missed, especially when documents are incomplete or ambiguous.
3. **Non-auditability** — There is often no machine-readable record of *which document* and *which value* led to a specific verdict, making challenge or appeal difficult.

NirnayAI is built around one core principle: **every verdict must be traceable to a specific criterion, a specific document, and a specific value, and that trace must be immutable.**

---

## 2. Extracting Eligibility Criteria from the Tender Document

### The Challenge

Tender eligibility criteria are not structured data. They appear in section headings ("Qualifying Requirements"), numbered lists, footnotes, and annexures. A single criterion like "minimum annual turnover of ₹5 crore for each of the last three financial years" may be stated once in Section 3, referenced again in the document checklist in Annexure A, and carry a separate note about CA certification in Annexure C.

### Our Approach

**Step 1 — Document Ingestion**

The tender document is passed through our 3-tier OCR pipeline (described in Section 4). For text-based PDFs, we extract with `pdfplumber` including table detection. For scanned PDFs, we use `PyMuPDF` to render pages as images and pass them through Tesseract OCR (configured for `eng+hin` to handle Hindi annotations common in Indian government documents). For DOCX files, we use `python-docx` to extract paragraphs and tables.

**Step 2 — Chunked LLM Extraction**

Large tenders exceed any LLM's practical context window for reliable extraction. We split the extracted text into 40,000-character chunks with 2,000-character overlap (ensuring criteria near chunk boundaries are not missed). Each chunk is sent to Claude with a structured prompt:

```
Extract ALL eligibility criteria. For each, return:
  id, label, description (verbatim from document), type
  (financial/technical/compliance/documentation), mandatory (bool),
  threshold (exact value stated), unit, extraction_confidence (0–1)
```

The overlap ensures a criterion that starts near the end of one chunk and continues into the next is captured in at least one of them.

**Step 3 — Deduplication and Merging**

Criteria extracted from multiple chunks are deduplicated by normalised label (lowercase, stripped). When the same criterion appears in two chunks, we keep the version with higher `extraction_confidence`. IDs are re-sequenced as C1, C2, C3... after merging.

**Step 4 — Mandatory vs Optional Classification**

The LLM prompt explicitly asks the model to distinguish mandatory from optional criteria based on language signals: "must", "shall", "mandatory", "essential" → `mandatory: true`; "preferred", "desirable", "if applicable", "optional" → `mandatory: false`. Optional criteria (e.g. MSME registration, Make-in-India compliance) are retained but flagged — they attract price preference, not disqualification.

**Step 5 — Human Review Gate**

Extracted criteria are presented to the procurement officer in an editable review screen before evaluation begins. The officer can correct thresholds, reclassify types, toggle mandatory status, or add criteria the system missed. This review step is mandatory — the system moves to evaluation only after the officer clicks "Confirm All & Proceed". This ensures AI extraction errors do not propagate to final verdicts.

---

## 3. Parsing Bidder Submissions

### The Challenge

Bidder submissions arrive in every imaginable format. A single bidder may submit:
- A typed PDF cover letter
- A scanned copy of their GST certificate (photographed on a phone, slightly tilted)
- A Word document with financial tables
- An Excel sheet with turnover figures
- A JPG of a physical ISO certificate

Each of these requires a different parsing strategy, and the same information (e.g. turnover figure) may be expressed differently: "₹8,20,45,000", "Rs. 8.20 Crore", "INR 8200000", or handwritten as "8.2 Crores".

### Our 3-Tier OCR Pipeline

```
Input File
    │
    ├─ .pdf  ──→ Tier 1: pdfplumber (digital text extraction)
    │              confidence = meaningful_chars / total_chars
    │              if confidence > 0.85 → done
    │              else → Tier 2: PyMuPDF → render pages → Tesseract
    │
    ├─ .jpg/.png/.bmp/.tiff
    │          ──→ Tier 3: PIL image preprocessing → Tesseract
    │              preprocessing: deskew → denoise → CLAHE → Otsu binarise
    │
    ├─ .docx  ──→ python-docx (paragraphs + tables)
    ├─ .xlsx  ──→ openpyxl (all sheets, structured rows)
    └─ .csv   ──→ stdlib csv reader
```

**Image Preprocessing Detail:** Before passing any image to Tesseract, we apply:
1. Deskew (rotation correction up to ±15°)
2. Gaussian denoise
3. CLAHE (Contrast Limited Adaptive Histogram Equalization) for uneven lighting
4. Otsu binarisation (converts to black/white, improves OCR accuracy on aged documents)

Tesseract is configured with `lang='eng+hin'` to handle Hindi text in mixed-language Indian government certificates.

**Confidence Scoring:** The pipeline reports a confidence score per document (0.0–1.0) based on the proportion of readable characters. Low-confidence extractions (< 0.70) are flagged in the audit trail and surfaced to the officer for manual review rather than being silently used.

**Table Extraction:** `pdfplumber`'s `page.extract_tables()` is used for PDFs with tabular financial data. Tables are serialised as `[TABLE]...[/TABLE]` blocks in the extracted text so the LLM can parse them as structured data.

---

## 4. Matching Bidder Information to Criteria

### Value Extraction

For each bidder document, we run a second LLM pass — the value extractor. For each criterion, the model is asked to locate the specific value in the bidder's document text:

```
For criterion: "Minimum Annual Turnover — ₹5 Crore per year for FY22, FY23, FY24"
Find in the bidder document: the actual turnover figures, the financial years they cover,
the certifying authority (CA name, UDIN), and the source section.
Return: value_found, extracted_value, source_section, confidence, raw_text, notes
```

The value extractor never returns ELIGIBLE or NOT_ELIGIBLE — it returns only `PASS_TO_RULE_ENGINE` (value found with sufficient confidence) or `MANUAL_REVIEW` (value ambiguous, not found, or OCR confidence too low). This is a hard constraint: the LLM is used only for extraction, never for eligibility judgement.

### Handling Variation in Language and Presentation

Bidders present the same information in many ways. Our system handles this through:

- **INR normalisation:** "₹8.20 Crore", "Rs 820 Lakhs", "INR 82,000,000" are all normalised to rupees before comparison against the threshold.
- **Date and year normalisation:** "FY 2021-22", "2021-22", "April 2021 to March 2022" are normalised to a financial year tuple.
- **Compliance signal matching:** For boolean criteria (GST registration, ISO certification), the rule engine looks for positive signals ("valid", "active", "registered", "in force") and negative signals ("expired", "cancelled", "not found", "surrendered").
- **Fuzzy label matching:** The value extractor prompt includes the criterion label and description, so even if a bidder uses "Annual Revenue" instead of "Annual Turnover", the model can correctly map it.

---

## 5. Evaluation, Explainability, and Human Review

### The Rule Engine

After value extraction, a deterministic rule engine (no LLM involved) applies the eligibility logic:

```python
def evaluate_criterion(criterion, extraction):
    if not extraction.value_found:
        return MANUAL_REVIEW, "Value not found in document"
    if extraction.confidence < 0.60:
        return MANUAL_REVIEW, f"Low OCR confidence ({extraction.confidence:.0%})"
    if criterion.type == 'financial':
        normalised = normalise_inr(extraction.extracted_value)
        threshold  = normalise_inr(criterion.threshold)
        if normalised >= threshold:
            return ELIGIBLE, f"Turnover {normalised} ≥ threshold {threshold}"
        else:
            return NOT_ELIGIBLE, f"Turnover {normalised} < threshold {threshold}"
    if criterion.type == 'compliance':
        if has_positive_signal(extraction.extracted_value):
            return ELIGIBLE, "Valid certificate found"
        if has_negative_signal(extraction.extracted_value):
            return NOT_ELIGIBLE, "Certificate expired or invalid"
        return MANUAL_REVIEW, "Certificate status unclear"
    ...
```

The aggregate bidder verdict follows strict rules:
- If **any mandatory criterion** → `NOT_ELIGIBLE`: bidder verdict = `NOT_ELIGIBLE`
- If **any criterion** → `MANUAL_REVIEW`: bidder verdict = `MANUAL_REVIEW`
- If **all criteria** → `ELIGIBLE`: bidder verdict = `ELIGIBLE`

**The system never silently disqualifies.** A bidder with an ambiguous OCR read on a mandatory criterion is flagged `MANUAL_REVIEW` with the reason ("OCR confidence 52% — figure unreadable"), not rejected without explanation.

### Criterion-Level Explainability

Every verdict produced by the system includes:

| Field | Example |
|---|---|
| Criterion checked | EC-01 — Annual Turnover |
| Requirement | ₹5 Crore/year for FY22, FY23, FY24 |
| Document used | Annexure_A_FinancialStatements.pdf |
| Value extracted | ₹8,20,45,000 (FY22), ₹9,70,80,000 (FY23), ₹11,30,25,000 (FY24) |
| Source section | "Certificate of Annual Turnover — CA Rohit Sharma, UDIN: 24XXXXX" |
| Verdict | ELIGIBLE |
| Reason | All three years exceed ₹5 Crore threshold |
| Confidence | 0.94 |

This is stored immutably and rendered in the final evaluation report.

### Human-in-the-Loop Design

The system has two explicit human review gates:

1. **Criteria Review Gate** — After extracting criteria from the tender, the officer reviews and confirms them before evaluation begins. This catches extraction errors early.
2. **MANUAL_REVIEW Flag** — Any bidder or criterion flagged for manual review is explicitly surfaced to the officer with the reason for ambiguity. The officer must record a manual decision. The system cannot proceed to a final report without all MANUAL_REVIEW items resolved.

Optional criteria are never used for disqualification — only for preference scoring.

---

## 6. Audit Trail Design

The audit trail is implemented as a SQLite database with four INSERT-only tables:

```sql
criteria_extractions  — every LLM criteria extraction call (chunk, provider, confidence)
value_extractions     — every criterion-level value extraction (bidder, criterion, result)
verdicts              — every rule engine verdict (criterion, value, reason, threshold)
bidder_summaries      — overall per-bidder verdict with mandatory failure list
```

Key properties:
- **INSERT-only:** No UPDATE or DELETE operations are ever performed. History is immutable.
- **Input hashing:** The SHA-256 hash of the tender and bidder text is stored (not the raw text), enabling reproducibility verification without storing potentially sensitive document content.
- **Provider logging:** Every LLM call records which provider (Claude / OpenAI / Groq / Gemini) produced the response, so the audit trail is reproducible and attributable.
- **Thread-safe:** SQLite WAL mode + thread-local connections handle concurrent requests safely.

The audit trail supports three queries required for government accountability:
1. *"Which criteria were extracted from this tender, and by which model?"*
2. *"What value was found in this bidder's document for criterion EC-03?"*
3. *"Why was Bidder X marked Not Eligible?"*

---

## 7. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROCUREMENT OFFICER                          │
│                   (Browser — localhost:3000)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│              FRONTEND + API PROXY (Next.js 16)                  │
│  app/dashboard/    — workspace, upload, criteria review, eval   │
│  app/report/       — locked audit-ready officer report          │
│  app/api/ml/       — server-side proxy to ML pipeline           │
│  Prisma + Neon PostgreSQL — workspace/bidder/doc state          │
│  Clerk — authentication (officer login)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP (Railway ML_PIPELINE_URL)
┌──────────────────────────▼──────────────────────────────────────┐
│              ML PIPELINE (FastAPI — Railway)                    │
│                                                                 │
│  /process-document  → 3-tier OCR pipeline                       │
│  /extract-criteria  → chunked LLM extraction (Claude primary)   │
│  /extract-values    → per-criterion value extraction + routing  │
│  /evaluate-bidder   → OCR + extraction + rule engine → verdict  │
│  /evaluate-batch    → tender + N bidders → consolidated results │
│  /generate-report   → structured JSON report for PDF render     │
│                                                                 │
│  LLM fallback: Claude → OpenAI → Groq → Gemini                  │
│  Audit: SQLite (INSERT-only, WAL, mounted Railway volume)       │
│  Cache: SHA-256 keyed JSON files (mounted Railway volume)       │
└─────────────────────────────────────────────────────────────────┘
```

**Data flow for a complete evaluation:**
1. Officer uploads tender PDF → OCR → extracted text saved to Neon DB
2. Criteria extracted by LLM → officer reviews and confirms
3. For each bidder: documents uploaded → OCR → value extraction per criterion → rule engine → verdict logged to audit DB
4. Consolidated report generated → locked PDF-style report rendered in browser
5. Officer reviews MANUAL_REVIEW flags, records decisions, signs off

---

## 8. Technology Choices and Justifications

| Component | Choice | Reason |
|---|---|---|
| **Primary LLM** | Claude (claude-sonnet-4-6) | Best instruction-following for structured JSON extraction; lowest hallucination rate on domain-specific prompts |
| **LLM fallback** | OpenAI → Groq → Gemini | Redundancy for government-grade uptime; Groq/Gemini are free-tier fallbacks for cost control |
| **OCR** | Tesseract 5.5 | Open-source, deployable on Railway without per-page API cost; `eng+hin` supports Indian government documents |
| **PDF parsing** | pdfplumber (digital) + PyMuPDF (scanned) | pdfplumber best for table extraction; PyMuPDF fastest for page-to-image rendering |
| **Database** | Neon PostgreSQL (via Prisma) | Serverless Postgres — scales to zero, no cost when idle; Prisma gives type-safe schema |
| **Audit DB** | SQLite (WAL mode) | Self-contained, zero infrastructure, INSERT-only trivially enforced, portable for inspection/export |
| **Frontend** | Next.js 16 + Turbopack | App Router for server components; Turbopack for fast local dev; no separate API server needed |
| **Auth** | Clerk | SOC 2 compliant, zero-config, government-appropriate role support (evaluator vs admin) |
| **Deployment** | Railway (ML) + Vercel (Frontend) | Railway supports apt packages (Tesseract, poppler) via Nixpacks; Vercel is zero-config for Next.js |

---

## 9. Risks, Trade-offs, and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| OCR fails on heavily degraded scans | Medium | High — value unextractable | MANUAL_REVIEW flag surfaced to officer; image preprocessing reduces failure rate |
| LLM extracts wrong threshold value | Medium | High — wrong eligibility decision | Human review gate after extraction; rule engine is deterministic (no LLM in verdict) |
| LLM provider outage | Low | High — pipeline stops | 4-provider fallback chain; 60s timeout per provider |
| Bidder presents turnover in unconventional format | High | Medium — normalisation fails | INR normaliser covers all common formats; MANUAL_REVIEW for unrecognised formats |
| Very large tender (200+ pages) | Low | Medium — LLM misses criteria | Chunked extraction with overlap; human review gate catches misses |
| Audit DB lost on Railway redeploy | Medium | High — auditability broken | Volume mount with AUDIT_DB_PATH env var; startup warning if not configured |
| Scanned Hindi-only certificate | Medium | Medium — Tesseract accuracy lower for Hindi | `tesseract-ocr-hin` installed; MANUAL_REVIEW for low-confidence extractions |

**Key trade-off:** We chose to use LLMs only for extraction (not for verdict logic), keeping the rule engine fully deterministic. This sacrifices some flexibility (e.g. handling complex multi-condition criteria automatically) but guarantees that eligibility decisions are reproducible, auditable, and explainable without reference to a model's internal state.

---

## 10. Round 2 Implementation Plan

Given a sandbox with representative tender and bidder documents, the Round 2 implementation will proceed in three phases:

### Phase 1 — Document Ingestion Validation (Days 1–3)
- Run the 3-tier OCR pipeline against all provided sample documents
- Measure per-document extraction confidence; tune Tesseract preprocessing for document quality
- Validate that criteria extraction returns correct fields for the sample tender
- Identify any document formats not yet handled (e.g. password-protected PDFs)

### Phase 2 — Criterion Matching Calibration (Days 4–7)
- Run value extraction against all sample bidder submissions
- Compare extracted values against known ground truth (if provided)
- Tune INR/date/compliance normalisation for the specific domain (construction, IT, goods etc.)
- Validate MANUAL_REVIEW flag rate — target: flag genuinely ambiguous cases, not clear ones

### Phase 3 — Evaluation Report and Audit (Days 8–10)
- Run full batch evaluation (tender + all bidders) end-to-end
- Review generated evaluation report against expected verdicts
- Verify audit trail completeness — every verdict must have a logged criterion-level record
- Demo walkthrough with procurement officer persona: upload → criteria review → evaluation → report sign-off

### Acceptance Criteria for Round 2
- All clearly eligible bidders correctly marked ELIGIBLE with criterion-level evidence
- All clearly ineligible bidders correctly marked NOT_ELIGIBLE with the specific failing criterion and document reference
- All genuinely ambiguous cases marked MANUAL_REVIEW with the reason for ambiguity
- Zero silently disqualified bidders — every NOT_ELIGIBLE has an explicit rule engine reason
- Audit trail complete and exportable for all decisions

---

## Summary

NirnayAI addresses the CRPF tender evaluation problem by combining:
- A multi-tier OCR pipeline that handles every document format submitted in real procurement
- Chunked LLM extraction that scales to 200-page tenders without missing criteria in annexures
- A deterministic rule engine that keeps eligibility decisions reproducible and auditable
- An explicit MANUAL_REVIEW path that surfaces ambiguity rather than guessing
- An immutable audit trail that supports formal government procurement accountability
- A human-in-the-loop design at every critical decision point

The system does not replace the procurement officer — it gives them structured, evidence-backed information so they can make faster, more consistent, and fully auditable decisions.
