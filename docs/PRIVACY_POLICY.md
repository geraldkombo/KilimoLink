# Privacy Policy (Kenya DPA 2019)

This project is a reference implementation intended to support Kenya’s Data Protection Act (2019) principles: lawful processing, purpose limitation, data minimization, accuracy, storage limitation, integrity/confidentiality, and accountability.

## Data Collected

- Phone number for authentication (OTP)
- Business profile attributes (sector, county, youth/women-led flags)
- Grant application metadata and uploaded documents
- Training progress and market transactions

## Security Controls

- OTP verification for users
- Rate limiting (OTP and monthly grant applications)
- Encryption at rest for uploaded documents (AES-256-GCM)
- Admin authentication with MFA (TOTP)
- Audit logs for admin actions

## Data Retention

- Grant applications: 3 years (recommended policy for implementers)
- User profiles: retained until account deletion request

## Consent

- SMS and push notifications require explicit opt-in recorded on the user profile (`consentSms`, `consentPush`, `consentAt`).
- Users can update consent via API and may opt out at any time.

## Deletion (Right to Erasure)

- Users can request account deletion via the platform. Deletion disables login and removes direct identifiers (e.g., phone).
- Implementers should document whether operational records (applications, transactions) are retained for reporting/accountability and for how long.

## Sharing

- Donor portal endpoints expose aggregated, anonymized metrics only (no PII).

## User Rights

Implementers should provide mechanisms for:
- Access and correction of personal data
- Account deletion where feasible
- Complaint and escalation pathways
