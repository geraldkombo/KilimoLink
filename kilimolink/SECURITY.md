# Security

- Do not commit secrets. Use `backend/.env` locally and secret managers in production.
- Rotate `JWT_SECRET` and `DOCUMENTS_MASTER_KEY_BASE64` on compromise.
- Restrict admin access using MFA, strong passwords, and network controls.
- Keep dependencies updated and scan for vulnerabilities.

