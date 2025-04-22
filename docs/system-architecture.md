# System Architecture

## 1. Overview

This document describes the structure of the **MrVan B2B Onboarding & Vehicle Management** database.  
Our goal is to manage:
- B2B **companies** and their **users**,
- **vehicles** (campers) owned by those companies,
- **documents** (e.g. contracts, insurance),
- **WordPress integration** for registration forms,
- **email notifications** for signed documents,
- optional **rentals** (if we store booking data here),
- **payouts** (commissions, revenue sharing).

## Sequence Diagram

sequenceDiagram
    participant User as B2B Partner (User)
    participant SetupMyCar as SetupMyCar Interface
    participant Supabase as Supabase DB
    participant DocuSign as DocuSign eSign
    participant Admin as MrVan Admin
    participant Koster as Koster
    
    Note over User: Step 1: Decide user type\n(Private or Company)
    
    User->>SetupMyCar: 1) Open “SetupMyCar” page
    SetupMyCar->>User: Ask: “Are you Private or Company?”
    User->>SetupMyCar: Chooses type
    
    alt If Private Person
        Note over User,SetupMyCar: Only “Full Delegation” is allowed
        SetupMyCar->>User: Next: “Vehicle Info”
    else If Company
        SetupMyCar->>User: Next: “Vehicle Info + \nchoose collaboration mode”
        note over User: “Service only / Partial help / Full delegation”
    end
    
    User->>SetupMyCar: 2) Enter camper data (make, model, year, plate)
    SetupMyCar->>Supabase: Save vehicle (draft)
    Supabase-->>SetupMyCar: OK
    
    SetupMyCar->>User: 3) Upload required docs (insurance, etc.)
    User->>SetupMyCar: Upload docs
    SetupMyCar->>Supabase: Store doc metadata / files
    Supabase-->>SetupMyCar: doc references saved
    
    SetupMyCar->>User: 4) Confirm final details
    User->>SetupMyCar: Press “Finish setup”

    Note over SetupMyCar: OTP step is last \n to confirm phone & consent

    SetupMyCar->>User: 5) Enter phone for OTP
    SetupMyCar->>User: Sends OTP code via SMS
    User->>SetupMyCar: Submit OTP code
    SetupMyCar->>Supabase: Mark phone verified or fail
    Supabase-->>SetupMyCar: success/fail
    
    alt OTP success
        SetupMyCar->>User: 6) Initiate eSign via DocuSign
        User->>DocuSign: Accept & sign contract
        DocuSign-->>SetupMyCar: Callback “signed”
        SetupMyCar->>Supabase: Update contract status (signed)
        
        SetupMyCar->>Admin: 7) Notify Admin: “New request ready”
        Admin->>Supabase: View details (car info, docs, signed contract)
        Admin->>Admin: Approve or not
        
        alt Approved
            Admin->>Supabase: Set vehicle “approved”
            Admin->>Koster: Create vehicle if full delegation \nor needed for next steps
            Koster-->>Admin: Return vehicle_id
            Admin->>Supabase: Save koster_vehicle_id
            Admin->>User: Send signed document via email
            Note over Admin,Supabase: Vehicle integrated with ATOM
        else Not Approved
            Admin->>Supabase: Mark status=“rejected” or request more info
        end
    else OTP fails
        SetupMyCar->>User: show error/resend code
        Note over SetupMyCar: no eSign triggered, \ncan't proceed to admin
    end
    
    Note over User,Admin: Done. If approved, user's camper is managed according to chosen mode
    
    Note over User,SetupMyCar: WordPress Integration
    User->>WordPress: Access registration form on WordPress site
    WordPress->>SetupMyCar: Submit registration data via API
    SetupMyCar->>Supabase: Store data
    SetupMyCar->>User: Continue with regular flow (OTP, DocuSign, etc.)

## 2. Data Schema

This section outlines the **Supabase** data schema for the MrVan B2B onboarding & vehicle management project. We describe each table’s purpose and fields, along with the storage buckets used for file uploads.

---

### 2.1 Overview

We use **PostgreSQL** via Supabase for:

- **Relational tables** (users, companies, vehicles, documents, etc.).
- **Row-Level Security (RLS)** to ensure each partner only sees their own data.
- **Supabase Storage** (buckets) for uploading PDFs, images, etc.

Additionally, we have a reference table for **car makes** or models (if needed) so that the front-end can pull a list of available brands/types when registering a new vehicle.

---

### 2.2 Tables

Below is a high-level list of the primary tables:

#### 1. `users`
| Field           | Type           | Description                                                 |
|-----------------|----------------|-------------------------------------------------------------|
| `id`            | `uuid (PK)`    | Unique user identifier.                                     |
| `email`         | `text`         | Email (unique), used for login (or combined with phone).    |
| `password_hash` | `text`         | Hashed password (unless using external auth).               |
| `role`          | `text`         | e.g. `admin`, `b2b_partner`.                                |
| `phone`         | `text` (opt.)  | For storing phone, used in OTP.                             |
| `created_at`    | `timestamptz`  | When the record was created.                                |
| `updated_at`    | `timestamptz`  | When the record was last updated.                           |

**Purpose**: Holds account data for both B2B partners and admins.  
**RLS**: Typically, users can only see or update their own row, while admins can see all.

---

#### 2. `companies`
| Field         | Type           | Description                                               |
|---------------|----------------|-----------------------------------------------------------|
| `id`          | `uuid (PK)`    | Unique company identifier.                               |
| `name`        | `text`         | Official name of the company.                            |
| `tax_id`      | `text`         | Tax/registration number.                                 |
| `address`     | `text`         | Legal address of the company.                            |
| `phone`       | `text`         | Contact phone (if separate from user’s phone).          |
| `status`      | `text`         | e.g. `pending`, `active`, `suspended`.                  |
| `created_at`  | `timestamptz`  | Creation time.                                           |
| `updated_at`  | `timestamptz`  | Last update time.                                        |

**Purpose**: For B2B partners that represent a company (multiple users can belong to one company).  
**RLS**: Only users whose `company_id` matches see the record, or admins see all.

---

#### 3. `vehicles`
| Field             | Type           | Description                                                  |
|-------------------|----------------|--------------------------------------------------------------|
| `id`              | `uuid (PK)`    | Unique vehicle ID.                                           |
| `company_id`      | `uuid (FK)`    | If the vehicle is owned by a company (nullable if private?). |
| `brand`            | `text`         | e.g. “Volkswagen,” “Ford.”                                   |
| `model`           | `text`         | e.g. “California,” “Transit.”                                |
| `year`            | `integer`      | Year of manufacture.                                         |
| `license_plate`   | `text`         | Plate number.                                                |
| `status`          | `text`         | e.g. `draft`, `approved`, `rejected`.                        |
| `delegation_mode` | `text`         | e.g. `service_only`, `partial`, `full_delegation`.           |
| `koster_vehicle_id` | `text`         | If synced with Koster, store the returned ID.                |
| `created_at`      | `timestamptz`  | When the record was created.                                 |
| `updated_at`      | `timestamptz`  | When the record was last updated.                            |

**Purpose**: Core table for storing camper data. The front end references this table to display or update vehicle details.  
**RLS**: Only the owner (user/company) sees their vehicles, or admins see all.

---

#### 5. `wordpress_submissions`
| Field         | Type           | Description                                                  |
|---------------|----------------|--------------------------------------------------------------|
| `id`          | `uuid (PK)`    | Unique submission ID.                                        |
| `form_id`     | `text`         | Identifier for the WordPress form used.                      |
| `user_data`   | `jsonb`        | JSON data containing all form fields submitted.              |
| `status`      | `text`         | e.g. `new`, `processed`, `error`.                           |
| `created_at`  | `timestamptz`  | When the submission was created.                             |
| `processed_at`| `timestamptz`  | When the submission was processed.                           |

**Purpose**: Stores submissions from WordPress forms before they are processed into the main system.  
**RLS**: Only admins can see all submissions.

---

#### 4. `documents`
| Field         | Type           | Description                                                  |
|---------------|----------------|--------------------------------------------------------------|
| `id`          | `uuid (PK)`    | Unique document ID.                                         |
| `company_id`  | `uuid (FK)`    | Which company this doc belongs to (nullable if private?).   |
| `vehicle_id`  | `uuid (FK)`    | If doc is linked to a specific vehicle.                     |
| `doc_type`    | `text`         | e.g. `insurance`, `registration`, `contract`.               |
| `file_url`    | `text`         | Link to the file in Supabase Storage.                       |
| `signed_at`   | `timestamptz`  | If DocuSign or eSign was completed, store the timestamp.    |
| `status`      | `text`         | Could be `uploaded`, `signed`, `rejected`.                  |
| `created_at`  | `timestamptz`  | When the doc was created.                                   |
| `updated_at`  | `timestamptz`  | When it was last updated.                                   |

**Purpose**: Records metadata about uploaded PDFs/images. If eSign (DocuSign) is used, store `signed_at`.  
**RLS**: Tied to the same company or user that owns it, or admin sees all.

---

#### 5. `cars` (Optional reference table)
| Field        | Type           | Description                             |
|--------------|----------------|-----------------------------------------|
| `id`         | `serial PK`    | Unique ID for each row.                 |
| `car_brand`  | `text`         | e.g. “Volkswagen,” “Ford,” “Mercedes.”  |
| `car_model`  | `text`         | e.g. “Volkswagen,” “Ford,” “Mercedes.”  |
| `created_at` | `timestamptz`  | Creation timestamp.                     |

**Purpose**: If you want the front end to **pull a predefined list** of car makes or models.  
**Usage**: The user picks from a dropdown “Volkswagen,” “Ford,” etc. The back end can store the string or reference ID in `vehicles.make`.

---

### 2.3 Additional/Future Tables

- **`rentals`**: if storing booking data inside your system (not just in Koster).  
- **`payouts`**: if you track revenue sharing, commissions.  
- **`maintenance`**: if you track maintenance logs, repairs, or check-ups.
- **`email_logs`**: for tracking email notifications sent to users.

---

### 2.4 File Storage (Buckets)

We use **Supabase Storage** for storing uploaded documents. Typically, you might set up:

### 2.5 WordPress Integration

For the WordPress integration, we use:

- **REST API** for data transfer between WordPress and the main system
- **Custom plugin or shortcode** to embed the registration form on WordPress
- **JWT authentication** to secure API endpoints
- **Webhook notifications** to trigger actions when new submissions are received

1. **`company-docs`** bucket  
   - Path structure: `company-{company_id}/{document_id}/filename.pdf`

2. **`vehicle-docs`** bucket  
   - Path structure: `vehicle-{vehicle_id}/{document_id}/filename.jpg` or `.pdf`

**Security**:  
- You can apply Supabase Storage policies, ensuring only the owner or admin can read the files.  
- `documents.file_url` references the exact path in the bucket.

---

### 2.5 Row-Level Security (RLS) & Policies

To ensure each partner sees only their data:

1. **`users`**: each user can see/update only their own row.  
2. **`companies`**: a user sees the company row only if `company_id` is theirs.  
3. **`vehicles`**: a user sees vehicles where `company_id` matches or belongs to them (private user might just set `company_id = NULL` but link via user ID).  
4. **`documents`**: if the doc is tied to `company_id` or `vehicle_id` from that user’s domain.

For an admin role, you can allow reading/updating all records by verifying role in the policy.

---

### 2.6 Diagram Example

If you want a quick ER diagram in Mermaid:

```mermaid
erDiagram
  USERS ||--|{ COMPANIES : "belongs to or none (private?)"
  COMPANIES ||--|{ VEHICLES : "owns"
  VEHICLES ||--|{ DOCUMENTS : "has"
  COMPANIES ||--|{ DOCUMENTS : "uploads"
  CAR_MAKES }|..|| VEHICLES : "optional ref for make"

  USERS {
    uuid id PK
    text email
    text password_hash
    text role
    text phone
    timestamptz created_at
    timestamptz updated_at
  }

  COMPANIES {
    uuid id PK
    text name
    text tax_id
    text address
    text phone
    text status
    timestamptz created_at
    timestamptz updated_at
  }

  VEHICLES {
    uuid id PK
    uuid company_id FK
    text make
    text model
    integer year
    text license_plate
    text status
    text delegation_mode
    text atom_vehicle_id
    timestamptz created_at
    timestamptz updated_at
  }

  DOCUMENTS {
    uuid id PK
    uuid company_id FK
    uuid vehicle_id FK
    text doc_type
    text file_url
    timestamptz signed_at
    text status
    timestamptz created_at
    timestamptz updated_at
  }

  CAR_MAKES {
    int id PK
    text make_name
    timestamptz created_at
  }



**Версія документації:** 1.2  
**Дата:** 2025-03-17