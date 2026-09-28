# Project: AlzheimerCare AI

You are a senior full-stack + ML engineer. Build AlzheimerCare AI: a medical web platform for cognitive follow-up of patients with cognitive disorders. It is a DECISION-SUPPORT tool. It never makes autonomous diagnoses and never triggers clinical decisions without human (doctor) validation.

## Stack
- Frontend: React + TypeScript + Tailwind CSS + Recharts (Vite), React Router, TanStack Query
- Backend: Django + Django REST Framework + JWT (SimpleJWT), PostgreSQL
- Async: Celery + Redis (MRI analysis, transcription, notifications, PDF generation)
- AI service: separate FastAPI (or Django-isolated) service using PyTorch, MONAI, NiBabel, NumPy; Grad-CAM/SHAP for explainability
- Automation: n8n via webhooks/HTTP requests
- DevOps: Docker + Docker Compose (frontend, backend, ai-service, postgres, redis, n8n), GitHub Actions CI/CD, MLflow for model versions, Prometheus/Grafana

## Roles (RBAC + object-level permissions)
- Patient: only their own data (tests, games, evolution, appointments, messages, consents)
- Doctor: only patients assigned to them (visits, MRI, scores, predictions, consultations, transcripts, reports)
- Admin: users, roles, AI models, stats, logs, settings. NO automatic clinical modification.
After login, redirect to the role's interface.

## Django apps
accounts, patients, doctors, cognitive_tests, games, mri_images, predictions, consultations, transcriptions, reports, appointments, notifications, consents, audit_logs

## Data model
User(email, password, role, status); PatientProfile(pseudonymized identity, birth date, consents); DoctorProfile(specialty, license no., availability); MedicalVisit(date, reason, notes, doctor); MRIImage(patient, visit, file, modality, quality); CognitiveTest(type, answers, score, duration, date); Prediction(score, class, confidence, model_version, date); Consultation(participants, status, audio, consent); Transcript(segments, speaker, timestamp); MedicalReport(summary, validation status, version, author); Appointment(patient, doctor, date, status); AuditLog(user, action, date, target object).

## API endpoints (minimum)
POST /api/mri/upload/, POST /api/predictions/, POST /api/tests/, POST /api/games/, POST /api/consultations/start/, POST /api/transcriptions/, POST /api/reports/generate/, PATCH /api/reports/{id}/validate/, GET /api/patients/{id}/timeline/
Plus auth (login, logout, refresh, password reset), user admin, appointments, notifications, model management.

## Hard business rules (never violate; cover with tests)
1. A patient can never access another patient's data.
2. A doctor sees only assigned patients.
3. Every Prediction stores the model version and timestamp.
4. AI-generated reports stay DRAFT until a doctor validates them. n8n and agents can never validate a report or publish a diagnosis.
5. Audio recording/transcription requires explicit patient consent, with a stop button, retention period and deletion.
6. Every access to a sensitive record (MRI, transcript, report, scores) is written to AuditLog.
7. Games and quizzes are follow-up/engagement tools, NEVER presented as a diagnosis. Patient-facing wording is simple and reassuring.
8. Risk score wording: "estimated probability of progression over the chosen horizon (e.g. 12 months)", never "X% chance of having Alzheimer's".

## Model output contract
{ state: "stable" | "to_monitor" | "likely_progression" | "insufficient_data", risk_score: 0-1, confidence: 0-1, data_quality: str, influential_factors: [...], model_version: str, created_at }

## Security
JWT with expiry, hashed passwords, optional MFA, file validation (type/size), rate limiting, CORS, encryption in transit and at rest, pseudonymization, environment-based secrets (no secrets in code).

## Engineering standards
- Type hints in Python, strict TypeScript, no `any`
- Serializers/permissions per object, thin views, business logic in services
- Every feature ships with tests (pytest + DRF APIClient; Vitest/RTL for React)
- Migrations included; OpenAPI docs via drf-spectacular
- Small, reviewable commits; explain assumptions in comments or the PR description
- If a requirement is ambiguous, state your assumption and continue rather than blocking

## Data science rules
Split train/val/test by PATIENT (never by image), keep all visits of a patient in one split, handle missing visits/modalities, document every preprocessing step, evaluate with AUROC, precision, recall, F1, confusion matrix and calibration.
