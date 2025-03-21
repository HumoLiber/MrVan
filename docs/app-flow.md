# App Flow

**Version:** 0.3 (Updated)  
**Date:** 2025-03-17
**Authors:** Ilia, Andrea

## 1. Overview

This document describes the **current flow** for how a B2B user (private individual or company) enters their camper details (via the “SetupMyCar” interface), verifies their phone number at the end, signs the DocuSign contract, and is then subject to admin approval. If the vehicle is approved, and relevant, the system integrates with ATOM Mobility depending on the chosen delegation mode.

## 2. Detailed Flow

### 2.1 Step 1: “Who Are You?” (Private or Company)

1. **User opens** the “SetupMyCar” page.  
2. The interface prompts: **“Are you a Private person or a Company?”**  
3. If **Private**, only **full delegation** is offered.  
4. If **Company**, the user picks from:  
   - “Service Only”  
   - “Partial Help”  
   - “Full Delegation”

### 2.2 Step 2: Enter Camper Data

1. After choosing user type, the system proceeds to the **“Vehicle Info”** form.  
2. The user enters **make, model, year, plate**, etc.  
3. The system saves a record in the database with `status = draft`.

### 2.3 Step 3: Upload Documents

1. The user uploads required documents: insurance, registration, or other files.  
2. The system stores **metadata** in the `documents` table (Supabase) and the actual files in **Supabase Storage**.

### 2.4 Step 4: Finish Setup

1. The interface displays a **summary** of everything the user has entered.  
2. By clicking “Finish Setup,” the user confirms all data is correct and wants to proceed to the final steps.

### 2.5 Step 5: Phone OTP

1. The **OTP** step is **last**, ensuring final phone confirmation and consent.  
2. The user provides a phone number → the system sends an **SMS code** (Twilio / MessageBird).  
3. The user enters the code into the interface.  
4. If **verification is successful**, proceed to **eSign**. If **it fails**, show an error and block the process.

### 2.6 Step 6: eSign (DocuSign)

1. The system initiates **DocuSign** (or another eSign solution), sending a contract that matches the chosen user type (private or company) and delegation mode.  
2. The user signs the document → DocuSign triggers a callback, and the interface (or back end) updates `signed_at` or `signature_status`.  
3. If signing is successful, the data is now **ready** for admin review.

### 2.7 Step 7: Admin Processing (MrVan Admin)

1. **The admin** sees the new entry (in the `vehicles` table) along with all documents.  
2. The admin verifies: correct documents, eSign completed, etc.  
3. The admin can either:  
   - `approved`: set the vehicle to “approved,”  
   - `rejected`: if something is wrong,  
   - `needs_more_info`: request additional details.

### 2.8 Step 8: Integration with ATOM (if Full Delegation or Other Cases)

1. For **Full Delegation** (either for a private person or a company), the admin (or the system) creates the vehicle in **ATOM** (API call).  
2. Receives `atom_vehicle_id`, then stores it in `vehicles.atom_vehicle_id`.  
3. As a result, in **ATOM Mobility**, the camper is visible; the B2B Partner can see its status or manage it in the ATOM Dashboard (according to permissions).

### 2.9 Result

- If **approved** and (if needed) integrated with ATOM, the user can fully utilize the vehicle for rental or management, per the chosen delegation mode.  
- If **rejected**, the user is informed and can re-submit or provide additional data.

---

## 3. Visual Flow (Mermaid Sequence Diagram)

Below is the updated diagram reflecting all the steps:

```mermaid
sequenceDiagram
    participant User as B2B Partner (User)
    participant SetupMyCar as SetupMyCar Interface
    participant Supabase as Supabase DB
    participant DocuSign as DocuSign eSign
    participant Admin as MrVan Admin
    participant ATOM as ATOM Mobility
    
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
            Admin->>ATOM: Create vehicle if full delegation \nor needed for next steps
            ATOM-->>Admin: Return vehicle_id
            Admin->>Supabase: Save atom_vehicle_id
            Note over Admin,Supabase: Vehicle integrated with ATOM
        else Not Approved
            Admin->>Supabase: Mark status=“rejected” or request more info
        end
    else OTP fails
        SetupMyCar->>User: show error/resend code
        Note over SetupMyCar: no eSign triggered, \ncan't proceed to admin
    end
    
    Note over User,Admin: Done. If approved, user’s camper is managed according to chosen mode
