-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('investor', 'company', 'private_owner', 'agency', 'agent');
CREATE TYPE document_status AS ENUM ('uploaded', 'approved', 'rejected');
CREATE TYPE delegation_model_type AS ENUM ('service_only', 'partial_help', 'full');
CREATE TYPE vehicle_status AS ENUM ('draft', 'approved', 'rejected', 'needs_more_info');
CREATE TYPE signature_status_type AS ENUM ('pending', 'signed', 'rejected');

-- 1. Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    role user_role NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create user_documents table
CREATE TABLE user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status document_status DEFAULT 'uploaded',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    plate TEXT UNIQUE,
    atom_vehicle_id TEXT,
    delegation_model delegation_model_type NOT NULL,
    status vehicle_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create agreements table
CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agreement_type TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_status signature_status_type DEFAULT 'pending',
    docu_sign_envelope_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX idx_agreements_user_id ON agreements(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Create basic security policies
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