# Designing Trust Across Seven Organisations

## A permissioned dApp for verifiable agricultural subsidy workflows

Most public-service software digitises a form. This project asked a harder question: **can the decision behind a subsidy become independently verifiable—without giving one organisation complete control of the workflow or custody of the citizen's signing key?**

For my BSc thesis in Informatics and Telematics at Harokopio University of Athens, I designed and developed the application layer of a research-grade agricultural subsidy platform built on Hyperledger Fabric. The system coordinates seven distinct participants across a shared workflow, translates policy rules into deterministic smart contracts, protects sensitive records through selective disclosure, and enables farmers to sign their own transactions from a browser wallet.

The result is not an official OPEKEPE service or a production implementation of the EU Common Agricultural Policy. It is a fully implemented research prototype that explores how distributed systems can make a complex public process more transparent, auditable and resistant to unilateral control.

---

## Project at a glance

| | |
|---|---|
| **Type** | BSc thesis · applied research · full-stack distributed system |
| **My role** | Application architect, blockchain and full-stack engineer, wallet developer, researcher |
| **Scope I led** | Smart contracts, application services, external-system connectors, seven role-specific portals, farmer wallet, end-to-end workflows and application-level verification |
| **Collaboration** | Developed as a two-part thesis with Anastasia Zerva, who led the Hyperledger Fabric infrastructure, orchestration and network evaluation |
| **Academic context** | Department of Informatics and Telematics, Harokopio University of Athens · Supervisor: Anargyros Tsadimas |
| **Core technologies** | Hyperledger Fabric, Go, React, TypeScript, Web Crypto API, Keycloak, PostgreSQL, CouchDB, IPFS/Kubo, Docker Compose, Playwright and Vitest |

## The challenge

Agricultural subsidy administration is not a single transaction between a citizen and an application. It is a long-running process involving different authorities, private records, changing policy rules, eligibility checks, approvals and payment instructions.

That creates four difficult design problems:

1. **No single organisation should silently rewrite the history of a case.** The parties need a shared record, but their legal responsibilities must remain distinct.
2. **A farmer should authorise their own application.** A server acting on the farmer's behalf is operationally convenient, but it weakens non-repudiation and turns the service provider into a key custodian.
3. **Shared verification must not mean shared visibility.** Tax information, land records and banking data cannot be exposed to every participant simply because they collaborate on the same process.
4. **Policy changes should not require a new application release.** Rates, thresholds, eligibility windows and penalty scales evolve. Hard-coding them into business logic would tightly couple regulation to deployment.

The goal was therefore not “put the process on a blockchain”. It was to decide, with precision, **which facts belong on a shared ledger, which facts must remain private, who is authorised to move a case forward, and what evidence should exist after every decision.**

## The design response

I structured the application around a simple principle:

> Institutions keep control of their systems. The consortium shares only the proofs, decisions and state required to complete the process.

The platform separates three planes:

```text
EXTERNAL REGISTRIES  ←  ORGANISATION CONNECTORS  →  FABRIC CONSORTIUM
```

The external plane represents the systems each institution already owns, such as tax, land, reserve and banking registries. The connector plane is the only layer allowed to communicate both with an institution's registry and its Fabric peer. The consortium plane contains the shared ledger and smart contracts. Static architecture checks enforce this boundary: connectors cannot import a database driver, and external registries cannot depend on Fabric.

This separation matters because a consortium should integrate sovereign systems—not quietly absorb them into a new central database.

## Policy became data, not code

I split the on-chain domain into three chaincodes with independent responsibilities:

- **Policy chaincode** stores the active policy version, payment schemes, rates, thresholds and penalty parameters as ledger data.
- **Entitlement chaincode** manages the request, verification, allocation and issuance of subsidy entitlements.
- **Subsidy chaincode** manages the annual application from submission and eligibility checks through approval and payment order.

The application uses a test policy named `CAP-2026-v1`, inspired by the Common Agricultural Policy but explicitly not presented as official legislation. A new policy period can be introduced as a new version in the ledger rather than as a hidden set of constants in a code release.

Across the three chaincodes, fifteen contracts implement state transitions, access rules, deadlines, duplicate-claim prevention and subsidy calculations. Every meaningful transition is guarded by both the current state and the caller's Membership Service Provider identity. Transaction timestamps come from Fabric's transaction context, never from a local system clock, keeping execution deterministic across endorsing peers.

## The farmer signs—not the platform

The most distinctive part of the project is a Chrome-compatible wallet extension for citizen self-custody.

Each farmer receives a real X.509 identity under a dedicated `FarmersMSP`. The wallet generates an ECDSA P-256 key pair in the browser, encrypts the private key at rest with AES-256-GCM using a PBKDF2-derived key, and exposes an encrypted, user-controlled backup flow. The unencrypted private key is never sent to the portal or backend.

Because a browser cannot act as a native Fabric Gateway client, I designed an offline-signing protocol:

1. The backend prepares an unsigned Fabric proposal using the farmer's public identity.
2. The wallet decodes the actual protobuf payload and verifies the channel, chaincode function, MSP, certificate and farmer identifier.
3. Only after those checks does it produce a low-S, DER-encoded ECDSA signature.
4. The backend transports the signed proposal for endorsement and returns the resulting transaction bytes.
5. The wallet verifies and signs the transaction envelope before the backend submits it to the ordering service.

This creates an important trust boundary: **the backend transports the transaction, but it cannot authorise one.** The wallet does not blindly sign a server-provided byte array; it independently verifies what those bytes mean.

I used the same identity for protected reads. A short-lived session begins with a one-time challenge, signed by the wallet under a domain-separated message. The backend validates the certificate chain against the FarmersMSP CA and derives the farmer identifier from the certificate—not from a query parameter. This closes an otherwise simple enumeration path against citizen records.

## Privacy was designed field by field

One shared channel gives every participant a consistent process history, while five Fabric Private Data Collections restrict sensitive values to the organisations that need them. Tax and land data are shared only with the relevant authority and OPEKEPE. The bank resolves an IBAN inside its own registry; the IBAN never enters the ledger.

Large or erasable documents follow a different path. A young farmer's supporting diploma is stored in a private two-node IPFS/Kubo swarm operated by separate organisations. Only its content-addressed identifier is committed to the workflow, preserving an integrity reference without placing the PDF itself in immutable ledger state. Human review remains mandatory because a file hash proves content integrity, not that the document belongs to a specific person.

This was a deliberate rejection of the “store everything on-chain” pattern. Immutability is useful for decisions and evidence; it is often the wrong property for personal documents.

## One workflow, seven perspectives

The system includes seven role-specific React portals and a browser wallet:

- Farmers enrol, review entitlements, prepare applications and sign transactions.
- OPEKEPE staff manage campaigns, registrations, escalations and final decisions.
- AADE verifies tax-related conditions.
- Regional authorities validate parcels and declared land.
- The Ministry handles National Reserve decisions and high-value co-approval.
- The Bank processes payment orders without disclosing banking data to the consortium.
- The EU Observer receives a read-only audit view and cannot endorse or submit state changes.

The backends react to chaincode events rather than relying on a single central workflow engine. When a case reaches the relevant state, each organisation performs its own check against its own registry and records a signed result. The interface is therefore not a collection of disconnected dashboards; each portal is a controlled window into the same state machine.

## Engineering for the failure that still looks successful

In a payment system, the most dangerous defect is not always a crash. It is a workflow that completes normally with the wrong amount.

That observation shaped the verification strategy. Tests assert exact monetary outcomes, authorised callers, legal state transitions, privacy boundaries and end-to-end ledger state—not merely HTTP status codes.

The current repository contains:

- **Three chaincodes and fifteen smart contracts** covering policy, entitlements and subsidy applications.
- **Five private data collections** on one channel, with live isolation checks from different organisational peers.
- **Six institution-specific connectors and five simulated sovereign registries**, separated by enforceable dependency rules.
- **Seven operational portals plus a dedicated browser wallet**, backed by unit, integration, end-to-end, security and conformance suites.
- **157 top-level chaincode test functions** and more than **300 frontend unit-test declarations** in the current codebase.

The self-custody signing path was benchmarked with a real proposal captured from the running system. Median decode, verification, signing and DER-encoding time was **0.075 ms on 2022 hardware** and **0.21 ms on a 2011 desktop**. The cryptographic work was effectively imperceptible; network endorsement and consensus, not client-side signing, dominated the user's wait.

The complete research platform was also deployed beyond a laptop: the consortium ran across six physical machines connected through WireGuard, with an additional cloud node serving the citizen-facing edge. That deployment belonged to the infrastructure half of the joint thesis, while the application workflows described here operated on top of it.

## What I learned

The strongest result was not that blockchain can record subsidy decisions. A conventional database can record them too.

The meaningful result was that **authority can be distributed without making responsibility ambiguous**. OPEKEPE remains the payment authority. The tax agency remains responsible for tax facts. The bank keeps banking data in its own system. The farmer holds the key that authorises the application. The ledger provides a shared sequence of signed decisions that no participant can rewrite alone.

The project also made the limits visible:

- Self-custody was technically validated, but usability with real farmers remains a future study.
- The prototype uses simulated institutional registries and cannot move real funds.
- The test policy is representative, not an authoritative codification of EU law.
- Keeping documents off-chain reduces—but does not eliminate—the tension between immutable ledgers and the right to erasure, because some identifying fields still remain on-chain.
- A rule cannot be enforced if the domain model does not contain the fact it depends on. Missing data is not something smart-contract code can responsibly invent.

Those constraints are not footnotes. They define where the system's guarantees end.

## Outcome

This thesis produced a working, measurable answer to its central question: a citizen can sign their own public-service transaction; changing policy can be represented as governed, versioned data; multiple institutions can coordinate on one ledger without exposing every underlying record; and verification can focus on the correctness of decisions rather than the simple availability of software.

For me, the project became an exercise in a broader kind of engineering: designing not only what a system does, but **who is allowed to know, decide, sign and prove each part of it.**

