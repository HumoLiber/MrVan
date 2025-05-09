# App Flow

🚀 **Version:** 0.7 (Updated with PrimaveraVan Festival integration)  
📅 **Date:** 2025-05-09
👨‍💻 **Authors:** Ilia

---


### 2.11 PrimaveraVan Festival Subproject

🎪 **PrimaveraVan Festival** - це спеціальний маркетинговий мікросайт для фестивалю:

- 🌍 **Багатомовний інтерфейс** - підтримує англійську, іспанську та каталанську мови
- 🎟️ **Промо-акції** - підписка на Instagram для отримання фестивального стакану та конкурс малюнків
- 📱 **Форма для збору контактів** - інтеграція з Supabase для збереження потенційних клієнтів
- 📊 **Потік даних:**
  1. Користувач заповнює форму з контактними даними
  2. Дані зберігаються в Supabase з маркером `source: 'primaveravan'`
  3. Користувач отримує підтвердження успішної реєстрації
  4. Адміністратор може переглядати зібрані контакти через MCP

#### 2.11.1 Технічні особливості PrimaveraVan

- 🌐 **Проста HTML/CSS/JS реалізація** - статичний сайт з мінімальними залежностями
- 🔄 **Інтеграція з Supabase** - використання Supabase для збереження даних форм
- 🌍 **Багатомовність** - використання JSON-файлу для перекладів та JavaScript для перемикання мов
- 📱 **Адаптивний дизайн** - оптимізовано для мобільних та десктопних пристроїв
- 📊 **Функції форми:**
  - Валідація полів
  - Збереження даних в Supabase через API
  - Відображення повідомлення про успіх після відправки

#### 2.11.2 API Endpoint для PrimaveraVan

🔹 **Функція:** `window.PrimaveravanAPI.savePrimaveraVanLead`  
🔹 **Параметри:**
  - `name` - Ім'я користувача
  - `email` - Email користувача
  - `instagram` - Instagram профіль (опціонально)
  - `privacy_accepted` - Чи прийнято політику конфіденційності
  - `source` - Встановлюється як 'primaveravan'
  - `created_at` - Дата створення запису
  
🔹 **Відповідь:** 
```json
{
  "success": true
}
```

#### 2.11.3 Діаграма потоку даних PrimaveraVan

```mermaid
sequenceDiagram
    participant Visitor as Відвідувач фестивалю
    participant Website as PrimaveraVan Website
    participant Supabase as Supabase DB
    participant Admin as MrVan Admin
    
    Visitor->>Website: Відвідує сайт фестивалю
    Website->>Visitor: Показує інформацію та промо-акції
    
    alt Instagram Cup Promotion
        Visitor->>Website: Переходить за посиланням на Instagram
        Visitor->>Website: Відвідує стенд на фестивалі
    else Drawing Contest
        Visitor->>Website: Заповнює форму для конкурсу
        Website->>Supabase: Зберігає дані учасника
    end
    
    Visitor->>Website: Заповнює контактну форму
    Website->>Supabase: savePrimaveraVanLead()
    Supabase-->>Website: Повертає статус успіху
    Website->>Visitor: Показує повідомлення про успіх
    
    Admin->>Supabase: Отримує дані через MCP
    Supabase-->>Admin: Повертає контакти з source='primaveravan'
    Admin->>Admin: Обробляє потенційних клієнтів
```

---

## 3. API Endpoints для DocuSign

### 3.1 Створення Конверта для Підписання

🔹 **Endpoint:** `/api/docusign/create-envelope`  
🔹 **Метод:** POST  
🔹 **Параметри запиту:**
  - `documentId` - ID документа
  - `signerEmail` - Email підписанта
  - `signerName` - Ім'я підписанта
  - `documentPath` - Шлях до документа для підписання
  
🔹 **Відповідь:** 
```json
{
  "success": true,
  "envelopeId": "abc123-xyz789"
}
```

### 3.2 Отримання URL для Вбудованого Підписання

🔹 **Endpoint:** `/api/docusign/embedded-signing`  
🔹 **Метод:** POST  
🔹 **Параметри запиту:**
  - `envelopeId` - ID конверта для підписання
  - `returnUrl` - URL для повернення після підписання
  - `signerEmail` - Email підписанта
  - `signerName` - Ім'я підписанта
  - `signerClientId` - (опціонально) ID клієнта
  
🔹 **Відповідь:** 
```json
{
  "success": true,
  "signingUrl": "https://demo.docusign.net/Signing/..."
}
```

---

## 4. Visual Flow (Mermaid Sequence Diagram)

```mermaid
sequenceDiagram
    participant User as End-User (Investor / Company / Private / Agency / Agent)
    participant SetupMyCar as SetupMyCar Interface
    participant Supabase as Supabase DB
    participant DocuSign as DocuSign eSign
    participant Admin as MrVan Admin
    participant ATOM as ATOM Mobility
    
    Note over User: Select Role:\nInvestor / Company / Private / Agency / Agent
    
    User->>SetupMyCar: Provide user type + basic data
    SetupMyCar->>User: Show relevant form fields
    
    alt Investor
        Note over User,SetupMyCar: Provide investment details\nUpload proof of funds\nSign Investor Agreement
    else Company
        Note over User,SetupMyCar: Provide company data\nChoose delegation model\nUpload docs
    else Private
        Note over User,SetupMyCar: Full Delegation only\nUpload personal docs
    else Agency
        Note over User,SetupMyCar: Collaboration scope\nSign Collaboration Agreement
    else Agent
        Note over User,SetupMyCar: Agent profile\nSign Agent Agreement
    end
    
    SetupMyCar->>Supabase: Save user records & documents
    SetupMyCar->>User: Prompt OTP for phone verification
    User->>SetupMyCar: Enter OTP code
    SetupMyCar->>Supabase: Mark phone verified or fail
    Supabase-->>SetupMyCar: success/fail
    
    alt If phone verified
        SetupMyCar->>DocuSign: Create envelope (POST /api/docusign/create-envelope)
        DocuSign-->>SetupMyCar: Return envelopeId
        SetupMyCar->>DocuSign: Get signing URL (POST /api/docusign/embedded-signing)
        DocuSign-->>SetupMyCar: Return signing URL
        SetupMyCar->>User: Show embedded signing interface
        User->>DocuSign: Sign digitally
        DocuSign-->>SetupMyCar: Callback "signed"
        SetupMyCar->>Supabase: Update signature status
        
        SetupMyCar->>Admin: Admin is notified
        Admin->>Supabase: Review documents & data
        alt Approved
            Admin->>Supabase: Set status=approved
            note over SetupMyCar,Admin: If Full Delegation:\nIntegrate w/ ATOM
            Admin->>ATOM: Create vehicle or user entry
            ATOM-->>Admin: Return entity_id
            Admin->>Supabase: Save atom_vehicle_id
        else Rejected
            Admin->>Supabase: Set status=rejected
            SetupMyCar->>User: Request more data or stop process
        end
    else If phone verification fails
        SetupMyCar->>User: Show error / resend code
    end
    
    Note over User,Admin: Done - user or entity onboarded (or rejected)
```