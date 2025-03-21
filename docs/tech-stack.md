# Tech Stack & Architecture

## 1. Overview

This document outlines the **technical architecture** and **tooling** for the **MrVan B2B Onboarding & Vehicle Management** project.  
Our stack includes **Create React App** on the front-end, **Python (FastAPI)** on the back-end, **Supabase** for database and storage, and **Docker** for containerization. We also integrate with **DocuSign** (eSign), **ATOM Mobility** for fleet management, and **Twilio/MessageBird** for OTP.

## 2. High-Level Architecture

- **Front-End**:  
  - Create React App for the B2B user interface (onboarding, vehicle form).  
  - Hosted on Vercel.  
- **Back-End**:  
  - Python (FastAPI) service for business logic, eSign callbacks, ATOM API integration.  
  - Containerized via **Docker** and also deployed on Vercel (if using Vercel’s container support or alternative container host).  
- **Database**:  
  - Supabase (PostgreSQL) for user data, vehicles, documents references.  
- **File Storage**:  
  - Supabase Storage for documents (PDF, images) or AWS S3 if needed.  
- **External Services**:  
  - OTP (Twilio or MessageBird)  
  - E-Sign (DocuSign)  
  - ATOM Mobility (vehicle management dashboard)  
  - Supabase (Auth + Database + Storage)  
  - Vercel (front-end & possibly back-end hosting)  
  - GitHub (source control & CI/CD)  
- **Containerization**:  
  - Docker images for the back-end (and possibly front-end if needed).  

## 3. Detailed Stack Components

### 3.1 Front-End

- **Framework**: Create React App  
  - **Why**: Simple to set up, React ecosystem, easy integration with Supabase Auth, SEO not critical for a B2B portal.  
- **UI Library**: Material UI  
- **Auth Handling**: Supabase Auth for email/password login.  
- **Deployment**:  
  - Vercel for hosting the React build as static files.  
  - *Optionally* containerize the front-end as well, though typically a static build is enough.

### 3.2 Back-End

- **Language**: *Python (FastAPI)*  
  - **Why**: Simpler, clear data validation (Pydantic), good for REST APIs, you prefer to develop Python skills.  
- **Key Responsibilities**:  
  1. **User & Company Management**: Creating records in DB, verifying phone.  
  2. **Document Handling**: Storing metadata, linking to files in Supabase Storage.  
  3. **E-Sign Integration**: Calling DocuSign API, receiving “signed” callbacks.  
  4. **ATOM Integration**: Exposing an endpoint or script to call “Create Vehicle” in ATOM.  
  5. **Commission/Payout (Future)**: Possibly integrate Stripe or Mangopay, store transactions.  
- **Containerization**:  
  - We'll create a **Dockerfile** with FastAPI (e.g. using a `python:3.10` base image).  
  - This image can be pushed to a registry (Docker Hub, GHCR) and then deployed on Vercel (if using their Docker-based deploy) or another container host.  

### 3.3 Database (Supabase / PostgreSQL)

- **Tables**:  
  - `users`: B2B partners + admins  
  - `companies`: Info about each B2B org  
  - `vehicles`: Vehicle data, status, references to `atom_vehicle_id`  
  - `documents`: Upload references (file URL, doc type, sign status)  
  - `rentals` / `payouts` (future scope)  
- **Security**:  
  - Row-Level Security (RLS) + policies  
  - Only owners see their data  
- **Storage**:  
  - Supabase Storage for file uploads  
  - Potentially S3 as an alternative  

### 3.4 Integrations

1. **OTP Service** (Twilio Verify / MessageBird)  
   - Sends SMS codes for phone confirmation  
   - An endpoint to verify the code (server-side in FastAPI)  
2. **E-Sign Provider**: DocuSign (or Adobe Sign)  
   - B2B partner clicks “Sign Contract” → redirect to DocuSign → callback to FastAPI  
   - Final PDF stored in Supabase Storage or a reference in DB  
3. **ATOM Mobility**  
   - REST or GraphQL (depending on their API) for “Vehicle Create/Update”  
   - Possibly webhooks from ATOM for status changes  
4. **Supabase**  
   - Auth, DB, Storage  
   - RLS for data privacy  
5. **Docker**  
   - Containerize the back-end (and optionally front-end if needed)  
   - Allows consistent environment from dev to prod  

### 3.5 Infrastructure & DevOps

- **Hosting**:  
  - *Front-End:* Vercel (serving CRA static build).  
  - *Back-End:*  
    - Vercel with Docker-based deployment (or alternate container hosting like AWS ECS/Fargate, Fly.io, etc.).  
- **CI/CD**:  
  - GitHub Actions to build/test Docker images, push to a registry, then trigger deployment.  
- **Monitoring**:  
  - Basic logs in e.g. CloudWatch, Datadog, or LogDNA (depending on final hosting).  
  - Error tracking with Sentry (Front-End + Back-End).  

### 3.6 Docker Usage

- **Dockerfile (Back-End)**:  
  - Based on `python:3.10` (or another official Python image).  
  - Installs dependencies (`pip install -r requirements.txt`).  
  - Exposes port 8000 (FastAPI default) or whichever is needed.  
  - Possibly includes a `CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`.  
- **Docker Compose** (optional):  
  - If local dev or advanced orchestration is needed, a `docker-compose.yml` can link the back-end container with other services (like Supabase, if you run a local version).  

---

## 4. Summary

- **Front-End**: Create React App + Material UI, deployed on Vercel.  
- **Back-End**: Python FastAPI in a Docker container; integration with DocuSign, ATOM, Twilio.  
- **Database**: Supabase (PostgreSQL) with RLS for data security, plus Supabase Storage for doc uploads.  
- **CI/CD**: GitHub Actions building Docker images, deploying to Vercel or another container host.  
- **Monitoring**: Sentry for error tracking, plus logs or APM (Datadog, etc.) as needed.

This **Docker-based** approach ensures consistent environments between dev and production, while **Vercel** manages the front-end hosting and possibly the container for your back-end. The rest of the architecture remains the same, maintaining Supabase for data, DocuSign for eSign, and ATOM for camper management.
