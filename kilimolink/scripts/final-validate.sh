#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "== KilimoLink final validation =="
echo "Root: ${ROOT_DIR}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required." >&2
  exit 1
fi

echo "Node: $(node --version)"
echo "npm: $(npm --version)"

echo "\n== Backend install/build/test =="
cd "${ROOT_DIR}/backend"
npm ci
npx prisma generate
npm run build
npm test

echo "\n== Web install/build/test =="
cd "${ROOT_DIR}/web"
npm ci
npm run build
npm test

echo "\n✅ Final validation passed."
