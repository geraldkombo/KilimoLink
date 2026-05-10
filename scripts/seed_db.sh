#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../backend"

pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
