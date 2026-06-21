# Data Refresh (Kenya)

This repository ships only lightweight sample datasets (to avoid bloating git). Implementers can replace these with official sources and larger datasets.

## Included Samples

- `backend/prisma/seed_data/knbs_agri.sample.json`
- `backend/prisma/seed_data/kenya_counties.sample.json`

## Refresh Workflow

1. Download official data (KNBS / county sources) using your organization’s approved method.
2. Convert to JSON/CSV following the sample schemas.
3. Store large files outside git (object storage) and load them via your ingestion pipeline.

