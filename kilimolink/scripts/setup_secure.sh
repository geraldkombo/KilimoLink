#!/usr/bin/env bash
set -euo pipefail

echo "Set JWT_SECRET and DOCUMENTS_MASTER_KEY_BASE64 in backend/.env before production use."
echo "Generate a 32-byte base64 key with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
