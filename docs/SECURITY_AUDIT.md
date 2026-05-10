# Security Audit

## Threat Model (MAESTRO-Style)

| Layer | Key Risks | Controls Implemented |
|---|---|---|
| Data Operations | Injection, broken validation, IDOR | Global ValidationPipe (whitelist + forbidNonWhitelisted), DTO validation, ownership checks, small-cell suppression for donor aggregates |
| Auth | Brute force, OTP abuse, admin account takeover | OTP hourly send limits, OTP verify throttle + lockout, admin TOTP MFA, admin login lockout, global rate limiting |
| Storage | Document leakage, plaintext persistence | AES-256-GCM encrypted documents at rest with per-file keys wrapped by master key; admin-only decrypt-and-stream download (no plaintext writes) |
| Queues/Jobs | Spam, retry storms, poisoned jobs | BullMQ workers gated behind ENABLE_WORKERS, notification logs, deadline-alert dedupe via GrantDeadlineNotice |
| Infra/Deployment | Misconfigurations, secret leakage | .env.example only; production requires strong JWT_SECRET and DOCUMENTS_MASTER_KEY_BASE64; Docker Compose reference stack |
| Observability | PII in logs | Avoid logging OTP codes, tokens, and secrets; donor endpoints exclude PII |
| Ecosystem/Supply Chain | Dependency issues | CI build pipeline; recommend Dependabot/Snyk in production repos |

## Kenya DPA 2019 Controls

- Consent: explicit opt-in for SMS/push recorded on user profile.
- Data minimization: donor endpoints provide aggregated reporting only, with suppression of buckets <5 to reduce disclosure risk.
- Right to erasure: user deletion endpoint disables login and removes direct identifiers.
- Retention: purge job (configurable retention years) removes old grant applications and encrypted files.

## Remaining Recommendations

- Run the backend behind a TLS-terminating reverse proxy and restrict admin routes by network policy.
- Enable database-level backups and restore testing.
- Add automated dependency scanning and container image scanning.

