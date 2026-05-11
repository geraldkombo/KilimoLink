# Market & Value-Addition Standards

This document records the standards and frameworks that inform implementation choices in KilimoLink.

## Value-Addition & Trade Standards

**Key requirements / interpretation**
- Smallholder farmers require direct access to urban markets to avoid value loss.
- Value addition (processing, branding) is the primary driver of increased farm-gate income.

**Implementation notes for this project**
- Use Solana as a "Proof of Trade" ledger to record successful marketplace transactions.
- Align training to "Value Addition" standards (processing, packaging, branding) to improve product marketability.

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

## International Alignment (UN SDGs)

**Key requirements / interpretation**
KilimoLink directly contributes to several United Nations Sustainable Development Goals:
- **SDG 2: Zero Hunger**: By improving supply chain efficiency and food security.
- **SDG 8: Decent Work and Economic Growth**: By providing market access and skill development.
- **SDG 12: Responsible Consumption and Production**: Through price transparency and reduced waste.

**Implementation notes for this project**
- Use these tags in donor reporting to align with international funding priorities.

