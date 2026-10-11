# Content, Identity and Voice

## Professional positioning

Konstantinos is a recent B.Sc. graduate, not someone claiming company experience.

Use:
- academic project
- B.Sc. thesis
- individual academic project
- team academic project
- research prototype

Do not invent:
- jobs
- clients
- users
- production traffic
- commercial impact
- published papers
- conference/journal/DOI
- official government deployment

## Contact

Email:
`konstantinospapadogiannis.dev@gmail.com`

GitHub:
`https://github.com/KonstantinosPapadogiannis`

LinkedIn:
`https://www.linkedin.com/in/konstantinos-papadogiannis/`

ORCID:
`https://orcid.org/0009-0008-9445-2484` (iD `0009-0008-9445-2484`, supplied
by the owner). Link the public record, never the `my-orcid?orcid=` address.

## Home copy direction

Hero small identity:
`Konstantinos Papadogiannis / Athens, GR`

Hero headline:
`Backend systems, distributed software, and cloud infrastructure.`

Supporting copy:
Recent Informatics & Telematics graduate focused on backend engineering,
distributed systems and cloud infrastructure. The portfolio documents selected
academic engineering work and the technical decisions behind it.

## About direction

Explain naturally:
- recent B.Sc. completion
- growing focus on backend/distributed/cloud
- interest in how components communicate
- data boundaries
- trust boundaries
- deployment
- testing
- reliable operation
- thesis experience with Go, Hyperledger Fabric and browser-side cryptography

Avoid generic "passion" language.

## My story

A section of its own between About and Academic highlights ("My story" /
"Η διαδρομή μου"), 350–500 words in English, in three chapters: Curiosity,
Depth, Direction. Copy in `story` in the message files. The Greek is
written as Greek, not translated sentence by sentence.

Use only the verified facts: born and raised in Peristeri, Athens; the
PlayStation 2; an old PC and the internet at around twelve; computer
magazines, the school's computer science books, W3Schools, first web
pages; breaking and fixing PCs and laptops; the informatics track at school
and the national exams taken to study computer science; university more
demanding than expected; DevOps and Computer Architecture as influences (no
grades in the story); analytical, persistent, collaborative; reading about
economics, investing and entrepreneurship; time for friends and family.

Private, never published in any form: the year of birth, the age, the date
of birth. "Around twelve" is the age the story starts, not his age.

Anastasia Zerva: they have worked together since the first year, across
assignments and projects, and it has grown into a long-term,
research-oriented collaboration. Never a lab, company, formal research
group, employment or any institutional status.

His own lines, kept as written: "I want to understand before I implement."
/ "Θέλω να καταλαβαίνω πριν εφαρμόσω." and the closing "What is happening
underneath — and what can I build once I understand it?" / "Τι συμβαίνει
από πίσω — και τι μπορώ να χτίσω όταν το καταλάβω;"

Never: passionate, "my journey began", "ever since I was a child",
cutting-edge, "changing the world", "technology enthusiast", "lifelong
learner", "driven individual", "results-oriented", "innovative solutions",
stubborn. Apostrophes are typographic (’) in both languages.

## Education

Harokopio University of Athens  
B.Sc. in Informatics and Telematics  
2022–2026

Average:
7.51/10, shown as "Average 7.51 / 10" and "Μέσος όρος 7,51 / 10". No
classification wording (no "Very Good" / "Λίαν Καλώς"), and no course,
credit or ECTS counts. Labelled only as the average, with no further
qualifier.

Bachelor's thesis:
10/10, kept apart from the average and from the course list.

Academic highlights ("Ακαδημαϊκές επιδόσεις"):
Verified grades from the university record, grouped by field to show the
breadth of the degree, not as a transcript. Course names in Greek are the
university's; in English, natural translations. Thesis I and II are not
listed. A section of its own after My story, not part of About. Source:
`src/config/education.ts` and `academic` in the message files.

Systems and infrastructure:
- DevOps Concepts & Tools — 10/10
- Modern Parallel Architectures & High-Performance Programming — 10/10
- Cloud Computing Management — 9/10
- Distributed Systems — 8/10

Software and computing:
- Numerical Analysis — 10/10
- Programming II — 9/10
- Object-Oriented Programming I — 9/10
- Simulation — 8/10

AI, data and intelligent systems:
- Data Mining — 9/10
- Computer Vision & Graphics — 9/10
- Information Retrieval & Natural Language Processing — 9/10

Networks, security and digital systems:
- Economics of Digital Technology — 9/10
- Systems & Interfaces Evaluation — 9/10
- Telecommunication Systems — 8/10
- Signals & Systems — 8/10
- Information Systems Security — 8/10

Not on the verified record, so not shown: Computer Networks.
Avoid "exceptional", "outstanding", "elite", "top-performing" or similar
wording about grades.

## Technologies

Programming:
Go, TypeScript, JavaScript, Java, Python, SQL, C, CUDA, Bash

Backend:
Hyperledger Fabric, Spring Boot, REST, gRPC, Keycloak/OIDC, JWT

Frontend:
React, Redux, Tailwind CSS, Vite, Manifest V3, Web Crypto API

Cloud/DevOps:
Docker, Kubernetes/AKS, Jenkins, Ansible, OpenStack, Google Cloud, Azure, Nginx, Linux, Git

Data/ML:
PostgreSQL, PyTorch, TensorFlow/Keras, scikit-learn, pandas

Testing:
Go testing, Vitest, Playwright, JUnit, Jest

Present these typographically, not as a logo cloud.

## Project entries on the homepage

The thesis is the flagship, in Selected work. ErgoHub, OpenStack and CUDA
are the major projects, in the More work row; Computer Vision and Energy
Data Mining are compact, under Additional work.

A major project with a case study gets the major-project teaser, in its
column of the row and nothing larger:
- title and the meta line (number, name, year; kind and team);
- a description of two to four sentences: what the system does, then what
  was built, in plain terms;
- one or two concrete signals, facts that can be checked in the project
  (a count, the platform), not adjectives;
- `Read case study` / `Διαβάστε τη μελέτη περίπτωσης`, a text link to the
  case study in the reader's language, named with the project for
  assistive technology ("Read case study: ErgoHub").

45–80 words in English for the title, the description and the signals
together (45–70 for OpenStack, 40–65 for CUDA). The case study carries the
detail; the teaser only has to say what the project is and why it is worth
opening. A major project without a
case study keeps title, meta and one or two sentences, as now.

## Other project facts

### ErgoHub
Academic project · Team of two, with Anastasia Zerva · February–July 2025
Harokopio University of Athens: Distributed Systems, then DevOps Concepts &
Tools. Case study at `/work/ergohub` and `/el/work/ergohub`.

Verified in the project repositories (read-only; nothing is copied from
them):
- A freelance marketplace: clients post projects, an administrator approves
  or denies them, freelancers apply, optionally with a CV.
- Spring Boot 3 on Java 21: Spring Security, stateless JWT (shared HMAC
  key, 24 hours, with the role and whether the account is verified), BCrypt, Spring Data JPA on PostgreSQL, MinIO for CV files,
  JUnit with H2 for tests. Mail: MailHog under Docker Compose (the `dev`
  profile). The cluster ran the `prod` profile, whose mail sender is a
  real SMTP relay, so never say the cluster's mail went to MailHog (its
  Deployment existed, but it was not the application's mail path). Do not
  name the relay or anything about its account.
- Chat exists: a thread per project between the client and the
  freelancer, which polls the API about every three seconds. Never call it
  real-time; there are no WebSockets or server-sent events.
- React with Redux Toolkit and React Router, tested with Jest and React
  Testing Library, served by NGINX.
- Docker images for the API and the front end, pushed to Azure Container
  Registry with the build number and `latest`.
- Six Jenkins pipeline definitions (six Jenkinsfiles): one for the API and
  one for the front end, for each of three ways to deploy (AKS with
  kubectl, AKS through an Ansible playbook, and a local Minikube cluster
  through Ansible, with images on Docker Hub). The stage names on the page
  are the ones in the files. Provenance is in Git: the kubectl and Minikube
  pairs are in the full-history repository, and the `-ansible` pair was
  created upstream in commit `3d4c214` (2025-07-03). There
  are no build logs, so the claim is "definitions": never "six successful"
  or "six production" pipelines. Teaser signal: `6 Jenkins pipeline
  definitions` / `6 ορισμοί Jenkins pipeline`. Do not invent pipeline
  names.
- AKS: one namespace, five single-replica Deployments (frontend, backend,
  postgres, minio, mailhog), persistent volume claims of 5 Gi and 10 Gi,
  requests and limits, startup, liveness and readiness probes, a ConfigMap
  and a Secret, NGINX Ingress with cert-manager and Let’s Encrypt, HTTPS
  redirect.

Attribution: both of them worked across the API, the front end and the
delivery, so the page says "we". "I" only where it is his own: the
reflection at the end. Do not imply solo authorship.

Accurate, not flattering: the Health Check stage only lists the pods; lint
and `npm audit` do not fail the build; there is no password reset.

Never claim: RS256, React 18, payments, ratings, real-time chat or
messaging, that every pipeline ran successfully, a live demo, scores
or grades for the project, users, traffic, uptime or an SLA, Helm,
StatefulSets, SonarQube. Avoid production-ready, enterprise-grade, highly
scalable, robust, seamless, cutting-edge, revolutionary.

Not published: student numbers, the university email, the course
deployment's hostnames, registry and Docker Hub account names, anything
from kubeconfig, credential or environment files.

The public repository is not linked yet: its README lists student numbers,
features that were not built, RS256, React 18, a score and demo
credentials. Link it only after the README is corrected.

### OpenStack Private Cloud on Google Cloud
Individual academic project · June 2026
Harokopio University of Athens: Cloud Computing Management (Διαχείριση
Υπολογιστικού Νέφους). Case study at `/work/openstack` and
`/el/work/openstack`: a focused case study, 600–900 words in English
(three to five minutes), with one diagram. Teaser: 45–70 words in English.

Its story is one: getting the layers to connect. OpenStack's network and
Google Cloud's network did not know about each other, and the work was
joining them on the host and keeping them joined across a restart.

Verified in the project's report and notes (read-only; nothing is copied
from them):
- One Google Cloud n2-standard-4 VM with nested virtualisation, Ubuntu
  24.04, DevStack all-in-one; its services run as 24 systemd units.
- One tenant: a Keystone project, a user with the member role and its own
  openrc file; a Glance Ubuntu 22.04 Minimal image; Nova flavors and
  project quotas; a Neutron private network and subnet, a router to the
  public network, floating IPs and one security group (TCP 22, 80, 5432
  and ICMP).
- Of 18 problems logged, 8 came from using the admin credentials for the
  tenant's resources.
- The trace: `tcpdump` saw the packets on the tap interface and on
  `br-ex`, never on `ens4`. The fix: IP forwarding, FORWARD rules between
  `br-ex` and `ens4`, MASQUERADE on `ens4`, saved with iptables-persistent.
  Google Cloud drops traffic whose source is not the VM's address.
- After a stop and start, `br-ex` lost its address and the route to the
  floating range; a checklist, then `brex-setup.service`, a oneshot unit
  after the network and DevStack.
- An early `ovs-vsctl add-port br-ex ens4` cut the VM off; the serial
  console did not bring it back, and the VM was rebuilt.
- The lab exercises were written for VirtualBox and put PostgreSQL and
  Flask on one VM; he split them into `vm-db` (PostgreSQL 14, remote
  connections) and `vm-app` (Flask, Gunicorn as a systemd service, NGINX
  on port 80). The final test went through an SSH tunnel:
  `/api/products` returned four products.
- Weak points, said on the page: one security group for both tiers, the
  database password in the application code, PostgreSQL listening on
  every interface.

Voice: first person singular; it was his alone. "Individual academic
project", never work for a company.

Never claim: production, enterprise, a company or client, public access to
the application, high availability, multi-node, Kubernetes, storage or
load-balancing services that were not deployed, figures that were not
measured. Do not explain OpenStack from general knowledge: only what the
project's sources show. The source of the SNAT on the router (OVN) is
supported, not verified: say it carefully or not at all. That nested
virtualisation was enabled is verified; why (KVM rather than software
emulation) comes only from the course guide, so the page does not say it.

Not published: any address (including the floating range), project IDs,
passwords and credentials, the names of the Google Cloud projects, the VM
and the local machine, the course code, the professor's address, the
fictional company in the assignment brief, and resource names that contain
the student number.

### CUDA
Individual academic project · June 2026
Harokopio University of Athens: Modern Parallel Architectures and
High-Performance Programming. Case study at `/work/cuda` and
`/el/work/cuda`: a focused technical case study, 500–700 words in English
(two to four minutes), with one figure. Teaser: 40–65 words in English.

Its story is one: measure, find where the time goes, change where the
operands come from, measure again. The headline is the measured pair,
"From 306 ms to 86 ms".

Verified in the source, the report and the program's output (read-only;
nothing is copied from them):
- Single-precision C = A × B for square N × N matrices, N = 128 to 4096,
  compiled with `nvcc -O2 -arch=sm_75` on Google Colab, NVIDIA Tesla T4
  (16 GB).
- Three kernels: `naive_matmul` (16 × 16 threads, one element of C per
  thread, every operand from global memory); `tiled_matmul` (16 × 16
  tiles of A and B in shared memory, a barrier between loads);
  `register_blocked_matmul` (32 × 32 tiles, 64 threads, a 4 × 4 block of
  C per thread with its sums in registers, an outer product of four values
  of A and four of B at each step).
- Timing: `gettimeofday` around one launch and `cudaDeviceSynchronize`;
  copies from host to GPU excluded; C set to zero before each kernel; the
  same seeded inputs; one timed launch per kernel and size, in one
  session.
- At N = 4096: 0.305967 s, 0.190668 s, 0.086069 s. The page uses these
  three numbers only (`cuda` in `src/config/work.ts`); everything else on
  it is arithmetic on them or on the code.
- Derived: 3.6× from the first kernel to the third (3.5549), 1.6× for
  tiling (1.6047), 2.2× for the third kernel over the second (2.2153);
  3.2× to 5.8× across N = 256 to 4096. Global loads per element of C at
  N = 4096: 8,192, 512, 256 (2N, 2N/16, 2N/32).
- The naive kernel at N = 128 was the first launch of the session and
  took 0.159 s, about 300 times its time at N = 256; it is called
  start-up cost and left out, without a cause.
- Correctness: the sum of all elements of C, in double precision, was the
  same for the three kernels at every size. There is no element-by-element
  check against a CPU result, and the page says so.

Voice: first person singular. A ratio is written as a speedup (`3.6×
speedup`, `επιτάχυνση 3,6×`), never as `3.6× faster`. A percentage, if
one is ever used, is a runtime reduction and never stands in for the
speedup.

Never claim: profiling, bandwidth, occupancy, FLOPS or GFLOP/s, cache hit
rates, utilisation, repeated runs or averages, the cause of the warm-up
outlier, why tiling bought 1.6× rather than 16×, a share of the 2.2× for
register blocking alone (the third kernel also changed tile and block
size), a speed-up for GPUs or matrix multiplication in general, production
or industry use, a publication, a new algorithm. The report's remarks on
occupancy, L2 and latency are textbook, not measured: not published.

Not published: the professor's name, the course code, the student number
(it is in the folder name and the file headers), the names of the files,
the notebook and the folder.

### Computer Vision
Individual academic project · Feb 2026

ResNet18 on Oxford-IIIT Pet: 90.32% validation accuracy.
ViT-B/16 vs VGG16-BN on CIFAR-10: 95.85% vs 93.18%.
U-Net, Faster R-CNN, PyTorch.

### Energy Data Mining
Team of two · Jan 2026

Gradient Boosting: 89.4% test accuracy, ROC-AUC 96.3%.
Random Forest/LSTM next-day forecasting: RMSE 5.59 / 5.61 kWh vs 6.84 kWh persistence baseline.
