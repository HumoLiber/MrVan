-- Insert test users
INSERT INTO users (email, phone, role, name) VALUES
('investor@example.com', '+380501111111', 'investor', 'Іван Інвестор'),
('company@example.com', '+380502222222', 'company', 'ТОВ "АвтоТранс"'),
('owner@example.com', '+380503333333', 'private_owner', 'Олена Власник'),
('agency@example.com', '+380504444444', 'agency', 'АгентствоАвто ЛТД'),
('agent@example.com', '+380505555555', 'agent', 'Петро Агент');

-- Insert user documents
INSERT INTO user_documents (user_id, doc_type, file_url, status) 
SELECT 
    id, 
    'ID', 
    'https://ektalbtnirqlttfkxdhe.supabase.co/storage/v1/object/public/documents/passport_' || id || '.pdf', 
    'approved'
FROM users WHERE email = 'investor@example.com';

INSERT INTO user_documents (user_id, doc_type, file_url, status) 
SELECT 
    id, 
    'ProofOfFunds', 
    'https://ektalbtnirqlttfkxdhe.supabase.co/storage/v1/object/public/documents/funds_' || id || '.pdf', 
    'uploaded'
FROM users WHERE email = 'investor@example.com';

INSERT INTO user_documents (user_id, doc_type, file_url, status) 
SELECT 
    id, 
    'LicenseDoc', 
    'https://ektalbtnirqlttfkxdhe.supabase.co/storage/v1/object/public/documents/license_' || id || '.pdf', 
    'approved'
FROM users WHERE email = 'company@example.com';

-- Insert vehicles
INSERT INTO vehicles (owner_id, make, model, year, plate, delegation_model, status) 
SELECT 
    id, 
    'BMW', 
    'X5', 
    2020, 
    'AA1234BB', 
    'full', 
    'approved'
FROM users WHERE email = 'owner@example.com';

INSERT INTO vehicles (owner_id, make, model, year, plate, delegation_model, status) 
SELECT 
    id, 
    'Mercedes', 
    'E-Class', 
    2021, 
    'AA5678BB', 
    'partial_help', 
    'draft'
FROM users WHERE email = 'owner@example.com';

INSERT INTO vehicles (owner_id, make, model, year, plate, atom_vehicle_id, delegation_model, status) 
SELECT 
    id, 
    'Audi', 
    'Q7', 
    2019, 
    'AA9012BB', 
    'ATOM123456', 
    'service_only', 
    'approved'
FROM users WHERE email = 'company@example.com';

-- Insert agreements
INSERT INTO agreements (user_id, agreement_type, signed_at, signature_status, docu_sign_envelope_id) 
SELECT 
    id, 
    'InvestorAgreement', 
    CURRENT_TIMESTAMP, 
    'signed', 
    'docusign-123456'
FROM users WHERE email = 'investor@example.com';

INSERT INTO agreements (user_id, agreement_type, signature_status) 
SELECT 
    id, 
    'DelegationAgreement', 
    'pending'
FROM users WHERE email = 'owner@example.com';

INSERT INTO agreements (user_id, agreement_type, signature_status) 
SELECT 
    id, 
    'AgentAgreement', 
    'pending'
FROM users WHERE email = 'agent@example.com'; 