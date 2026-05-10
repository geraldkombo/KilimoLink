# Official Mandates (Kenya)

This document records official Kenya government requirements and mandates that inform implementation choices in this repository. URLs are included for traceability.

## NDMA (Drought phases + early warning)

**Source**
- https://ndma.go.ke/drought-information/
- https://ndma.go.ke/drought-situation-brief/

**Key requirements / interpretation**
- NDMA operates a drought early warning system and publishes drought status using five phases: **Normal, Alert, Alarm, Emergency, Recovery**.
- NDMA publishes regular drought updates/bulletins intended to inform early action and recommended interventions.

**Implementation notes for this project**
- Map the drought phase model to:
  - county-level alerts (SMS/push, opt-in only)
  - donor reporting (aggregated counts of alerted businesses by county)
  - optional market “disruption indicators” for price/availability analytics (aggregated only)

## WASREB / Majidata (water & sanitation georeferenced monitoring)

**Source**
- https://www.majidata.go.ke/

**Key requirements / interpretation**
- Majidata describes itself as a **national monitoring and georeferenced information system** for water and sanitation services.
- Majidata references **Water Act 2016 Section 111**, stating WASREB is mandated to establish a national monitoring and georeferenced information system for water and sanitation services.

**Implementation notes for this project**
- Where “location-aware” reporting is introduced (e.g., market linkage, buyer delivery), treat location data as sensitive:
  - minimize collection
  - aggregate for donor views
  - store with clear retention rules

## Ministry of Agriculture (ASDSP II / value chain commercialization)

**Source**
- https://asdsp.kilimo.go.ke/who-we-are/
- https://drive.kilimo.go.ke/participating-counties

**Key requirements / interpretation**
- ASDSP II emphasizes commercialization of agriculture through:
  - productivity improvements in priority value chains
  - entrepreneurial skills strengthening
  - improved market access for value chain actors
- DRIVE highlights county-level coordination and support, including enabling women and youth participation and refining business proposals.

**Implementation notes for this project**
- Align core modules to these mandates:
  - Training hub (entrepreneurial + market readiness)
  - Market linkage (product listing + buyer orders)
  - Grant application workflow (proposal readiness + document handling)

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
- **SDG 1: No Poverty**: By increasing farmer income through direct market access.
- **SDG 2: Zero Hunger**: By improving supply chain efficiency and food security.
- **SDG 5: Gender Equality**: By prioritizing women-led agribusinesses (captured in profile).
- **SDG 8: Decent Work and Economic Growth**: By providing training and grants to youth.
- **SDG 12: Responsible Consumption and Production**: Through price transparency and reduced waste.

**Implementation notes for this project**
- Use these tags in donor reporting and grant application metadata to align with international funding priorities.

