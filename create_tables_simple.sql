-- Включення розширення UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Таблиця users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    role TEXT CHECK (role IN ('investor', 'company', 'private_owner', 'agency', 'agent')),
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблиця user_documents
CREATE TABLE user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT CHECK (status IN ('uploaded', 'approved', 'rejected')) DEFAULT 'uploaded',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблиця vehicles
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    plate TEXT UNIQUE,
    atom_vehicle_id TEXT,
    delegation_model TEXT CHECK (delegation_model IN ('service_only', 'partial_help', 'full')) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'approved', 'rejected', 'needs_more_info')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Таблиця agreements
CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agreement_type TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_status TEXT CHECK (signature_status IN ('pending', 'signed', 'rejected')) DEFAULT 'pending',
    docu_sign_envelope_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Створення індексів для оптимізації
CREATE INDEX idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX idx_agreements_user_id ON agreements(user_id);

-- Включення Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Створення політик безпеки
CREATE POLICY "Users can view and edit their own data" ON users
    FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "Users can view and edit their own documents" ON user_documents
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view and edit their own vehicles" ON vehicles
    FOR ALL
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can view and edit their own agreements" ON agreements
    FOR ALL
    USING (auth.uid() = user_id); 