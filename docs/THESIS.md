# Thesis Implementation Rules

## Canonical factual source

`PORTFOLIO_CASE_STUDY.md` is the current canonical factual source for the thesis.

Read it in full before implementing the thesis page.

Do not replace it with generic marketing prose.

## Attribution

Konstantinos' scope:
- application architecture
- blockchain/application logic
- chaincodes/smart contracts
- application services/connectors
- seven role-specific portals
- farmer wallet
- workflows
- application-level verification

The companion thesis led by Anastasia Zerva covered:
- Hyperledger Fabric infrastructure
- orchestration
- network evaluation

Do not claim infrastructure work as Konstantinos' work.

## Important limitation

This is:
- a working research prototype

It is not:
- an official OPEKEPE service
- a production EU Common Agricultural Policy implementation

## Homepage thesis title

Use a concise title such as:

`Distributed subsidy management on Hyperledger Fabric`

Metadata:
- Bachelor's Thesis
- 2026
- 10/10

## Real architecture source

The source diagram represents seven actors on one operational flow:

1. Farmer
   - FarmersMSP
   - self-custody X.509
   - no Keycloak
   - no peer / no orderer

2. OPEKEPE
   - OpekepeMSP
   - Keycloak SSO
   - orchestrator
   - consenter

3. AADE
   - AADEMSP
   - Keycloak SSO
   - tax verification

4. Region
   - RegionalMSP
   - Keycloak SSO
   - land / LPIS

5. Ministry
   - MinistryMSP
   - Keycloak SSO
   - national allocation
   - escalation AND

6. Bank
   - BankMSP
   - Keycloak SSO
   - payment execution
   - no consenter

7. EU Observer
   - EUObserverMSP
   - Keycloak SSO
   - read-only audit
   - no consenter

Shared:
- `subsidychannel`
- one permissioned ledger
- `policy-chaincode`
- `entitlement-chaincode`
- `subsidy-chaincode`
- world state per chaincode namespace
- 5 private data collections

When source diagram and case-study Markdown conflict, use `PORTFOLIO_CASE_STUDY.md`.

## Diagram rule

Do not display the rough source diagram directly in production.

Redraw it as responsive React/SVG matching the portfolio visual language.

Desktop:
- seven restrained actor structures
- clear connectors
- one shared ledger block
- chaincode/world-state/private-data substructure

Avoid:
- cartoon people
- huge blue bubbles
- PowerPoint styling
- crypto illustrations
- heavy shadows

Homepage:
- simplified

Case study:
- more complete

Mobile:
- deliberate mobile composition; do not merely shrink desktop

## Signing flow

Create a second diagram based only on the canonical Markdown:

Backend:
- prepares unsigned Fabric proposal

Wallet:
- decodes protobuf
- verifies channel
- verifies chaincode/function
- verifies MSP/certificate
- verifies farmer identifier
- signs ECDSA P-256

Backend:
- transports signed proposal
- obtains endorsement

Wallet:
- verifies transaction envelope
- signs transaction

Backend:
- submits to ordering service

Do not invent extra protocol steps.

## Case-study structure

Suggested:
1. Overview
2. Project at a glance
3. Challenge
4. Design response
5. Architecture
6. Policy as data
7. Farmer self-custody/signing
8. Transaction flow
9. Privacy model
10. Seven organisational perspectives
11. Testing and verification
12. Performance/results
13. Limitations
14. What I learned
15. Outcome
16. Source links

## Quantitative claims

Before publication, cross-check the Markdown and repository/source code where practical.

If numbers differ, report the discrepancy instead of silently choosing the more impressive value.
