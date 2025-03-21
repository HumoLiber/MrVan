-- Create tables for MrVan B2B Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    delegation_mode VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    atom_vehicle_id VARCHAR(255),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_status CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    CONSTRAINT valid_delegation_mode CHECK (delegation_mode IN ('service_only', 'partial', 'full_delegation'))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_doc_type CHECK (doc_type IN ('insurance', 'registration', 'contract')),
    CONSTRAINT valid_doc_status CHECK (status IN ('uploaded', 'verified', 'rejected'))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_vehicle_id ON documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_documents_doc_type ON documents(doc_type);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Phone verification table
CREATE TABLE IF NOT EXISTS phone_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(50) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verification_attempts INTEGER DEFAULT 0,
    last_verification_attempt TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone_number ON phone_verifications(phone_number);

-- Create RLS (Row Level Security) policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_select_own ON users FOR SELECT 
    USING (auth.uid() = id OR (SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY users_update_own ON users FOR UPDATE 
    USING (auth.uid() = id OR (SELECT is_admin FROM users WHERE id = auth.uid()));

-- Vehicles policies
CREATE POLICY vehicles_select_own ON vehicles FOR SELECT 
    USING (auth.uid() = user_id OR (SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY vehicles_insert_own ON vehicles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY vehicles_update_own ON vehicles FOR UPDATE 
    USING (auth.uid() = user_id OR (SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY vehicles_delete_own ON vehicles FOR DELETE 
    USING (auth.uid() = user_id OR (SELECT is_admin FROM users WHERE id = auth.uid()));

-- Documents policies
CREATE POLICY documents_select_own ON documents FOR SELECT 
    USING ((SELECT user_id FROM vehicles WHERE id = documents.vehicle_id) = auth.uid() 
           OR (SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY documents_insert_own ON documents FOR INSERT 
    WITH CHECK ((SELECT user_id FROM vehicles WHERE id = documents.vehicle_id) = auth.uid() 
                OR (SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY documents_update_own ON documents FOR UPDATE 
    USING ((SELECT user_id FROM vehicles WHERE id = documents.vehicle_id) = auth.uid() 
           OR (SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY documents_delete_own ON documents FOR DELETE 
    USING ((SELECT user_id FROM vehicles WHERE id = documents.vehicle_id) = auth.uid() 
           OR (SELECT is_admin FROM users WHERE id = auth.uid()));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle_documents', 'Vehicle Documents', true);

-- Set up storage policies
CREATE POLICY storage_select_own ON storage.objects FOR SELECT 
    USING (bucket_id = 'vehicle_documents' AND 
           ((storage.foldername(name))[1] = auth.uid()::text OR 
            (SELECT is_admin FROM users WHERE id = auth.uid())));

CREATE POLICY storage_insert_own ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'vehicle_documents' AND 
                (storage.foldername(name))[1] = auth.uid()::text);

-- Create functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email TEXT,
    admin_password TEXT,
    admin_company TEXT,
    admin_phone TEXT
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    INSERT INTO users (
        email,
        hashed_password,
        company_name,
        phone_number,
        is_active,
        is_admin
    ) VALUES (
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        admin_company,
        admin_phone,
        TRUE,
        TRUE
    )
    RETURNING id INTO user_id;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
