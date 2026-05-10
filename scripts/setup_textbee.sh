#!/usr/bin/env bash
set -euo pipefail

echo "Add TEXTBEE_API_KEY and TEXTBEE_SENDER_ID to backend/.env to enable SMS."
echo "Run the backend with ENABLE_WORKERS=true to process queued SMS jobs."
