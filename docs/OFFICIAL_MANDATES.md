# Cooperative & Private Standards

This document records the standards and cooperative frameworks that inform implementation choices in KilimoLink.

## SACCO & Cooperative Frameworks

**Key requirements / interpretation**
- Cooperatives require transparent oversight of internal funds and member disbursements.
- SACCOs prioritize member savings and credit history for loan eligibility.

**Implementation notes for this project**
- Use Solana as a transparent internal ledger for SACCO-managed funds.
- Align training to "Value Addition" standards (processing, packaging, branding) to improve member productivity.

## Kenya Revenue Authority (eTIMS / electronic invoicing)

**Source**
- https://kra.go.ke/business/etims-electronic-tax-invoice-management-system/learn-about-etims
- https://www.kra.go.ke/helping-tax-payers/facts-about-kra/category/9

**Key requirements / interpretation**
- eTIMS is KRA’s electronic tax invoicing system with multiple solution types (web/USSD/app/client/system-integration) and is intended to support invoice generation and transmission.
- eTIMS guidance includes requirements for electronic invoices and references regulatory obligations for transmitting invoice details.

**Implementation notes for this project**
- This project is not a payments/tax product today, but for transactional extensions:
  - keep a stubbed “tax compliance” section (no secrets, no live KRA integration)
  - structure invoices for future eTIMS compatibility (QR, invoice identifiers, immutability)

## General Government Portals (service entry points)

**Source**
- https://gok.kenya.go.ke/

**Implementation notes for this project**
- Use these portals as canonical entry points to sector ministries when building “official source” documentation and when validating the provenance of requirements.

## International Alignment (UN SDGs)

**Key requirements / interpretation**
KilimoLink directly contributes to several United Nations Sustainable Development Goals:
- **SDG 2: Zero Hunger**: By improving supply chain efficiency and food security.
- **SDG 8: Decent Work and Economic Growth**: By providing market access and skill development.
- **SDG 12: Responsible Consumption and Production**: Through price transparency and reduced waste.

**Implementation notes for this project**
- Use these tags in donor reporting to align with international funding priorities.

