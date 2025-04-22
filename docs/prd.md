# Product Requirements Document (PRD)

## 1. Overview

**Project Name:** MrVan B2B Onboarding & Vehicle Management Platform  
**Document Version:** 0.2  
**Date:** 2025-04-22  
**Authors:** Ilia, Andrea, Humo

### 1.1 Purpose
This PRD describes the requirements for the **MrVan B2B platform**, which enables camper-owners (B2B partners) to register, submit their vehicle data, sign contracts, and eventually manage their fleet via Koster Dashboard. The platform also supports WordPress integration for the registration form, focusing primarily on B2B clients.

### 1.2 Background
- **MrVan** operates in the camper rental market, partnering with vehicle owners and agencies.  
- We need a **central onboarding solution** to handle legal documentation, vehicle registration, and partial CRM functionality.  
- **Koster** will be the primary dashboard for real-time vehicle status and analytics.
- The platform needs to integrate with **WordPress** to provide a seamless registration experience for B2B clients.

## 2. Goals and Objectives

1. **Seamless B2B Onboarding**  
   - Provide a smooth registration process, including phone verification (OTP), company info, e-signature of contracts.
   - Integrate with WordPress to enable registration directly from the WordPress site.
2. **Vehicle Registration**  
   - Gather essential data (plate number, brand, year, insurance docs) and store it securely.
3. **Legal & Document Management**  
   - Upload and manage PDF/JPG files (insurance, registration).  
   - Automatic contract signing (DocuSign).
4. **Integration with Koster**  
   - Once a vehicle is approved, it should be created in Koster.  
   - Retain `koster_vehicle_id` in our database for reference.
5. **Email Notifications**  
   - Send a copy of the signed document to the user's email.
   - Provide confirmation of successful registration.

6. **WordPress Integration**  
   - Embed registration form on WordPress site.
   - Ensure data synchronization between WordPress and the main system.

7. **Payments & Commission Handling** (Future Scope)  
   - Track revenue share for each partner, manage payouts.

## 3. Key Features & Requirements

### 3.1 User Roles

- **B2B Partner / Camper Owner**  
  - Registers an account, verifies phone.  
  - Adds vehicles, uploads documents, signs contract.  
  - Views basic status of submission/approval.  
- **MrVan Admin**  
  - Reviews newly added vehicles.  
  - Approves or rejects them, requests more info.  
  - Monitors partner data and document compliance.

### 3.2 Workflow Summary

1. **Partner creates account**  
   - Email + password + phone OTP.  
2. **Partner logs in**  
   - Sees a “Add Vehicle” button.  
3. **Vehicle creation**  
   - Fills in plate number, brand/model/year, insurance upload, etc.  
   - Possibly signs an addendum contract if required.  
4. **MrVan Admin moderation**  
   - Checks validity of docs.  
   - Sets vehicle status to “Approved”.  
5. **Koster creation**  
   - System calls Koster API => obtains `koster_vehicle_id`.  
   - Partner can view vehicle in Koster Dashboard.

6. **Email confirmation**  
   - System sends signed document to user's email.
   - Confirmation of successful registration is sent.

### 3.3 Functional Requirements

1. **User Registration & Auth**  
   - Must handle OTP phone verification (Twilio or MessageBird, etc.).  
2. **Document Handling**  
   - Supabase Storage for PDFs, images.  
   - `documents` table for referencing files, contract statuses.  
3. **Contracts (E-Sign)**  
   - Integration with DocuSign/Adobe Sign.  
   - Store final signed PDF.  
4. **Vehicle Management**  
   - `vehicles` table with basic/more advanced fields.  
   - Relationship to company, user, docs.  
   - Integration with Koster.  
5. **Admin Tools**  
   - Admin can update `approved` or `rejected` status, see logs, send requests for more info.

### 3.4 Non-Functional Requirements (NFR)

1. **Security & Compliance**  
   - GDPR compliance for EU-based personal data.  
   - SSL/TLS encryption, secure file upload.  
2. **Performance**  
   - Quick form submission under normal usage ( <3 sec response).  
3. **Reliability**  
   - Database backups, minimal downtime.  
4. **Scalability**  
   - Potentially hundreds of B2B partners, thousands of vehicles.  
   - Ability to integrate with more 3rd-party services.


## 4. Success Criteria

- **90%** of newly created vehicles are approved within 24 hours (quick doc check).  
- **Zero** major security incidents regarding document data leaks.  
- **Minimal** friction for partners to submit all required docs (average <10 minutes to complete onboarding).  
- **First applications** received through the platform, prioritizing B2B clients.
- **Successful integration** with WordPress for seamless registration experience.

## 5. WordPress Integration

### 5.1 Overview
The WordPress integration allows B2B clients to register directly from the WordPress site, with data being synchronized to the main system.

### 5.2 Requirements

1. **Registration Form**
   - Embed a registration form on the WordPress site using shortcode or plugin.
   - Form should collect all necessary information for the onboarding process.

2. **Data Synchronization**
   - All data submitted through the WordPress form should be automatically transferred to the main system.
   - Ensure secure data transmission between systems.

3. **User Experience**
   - Provide a seamless experience for users registering through WordPress.
   - Maintain consistent branding and messaging.

4. **Security**
   - Implement appropriate security measures to protect user data.
   - Ensure compliance with data protection regulations.


