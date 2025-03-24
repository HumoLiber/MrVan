/**
 * Основні типи даних для проекту MrVan B2B
 */

// Типи користувачів
export type UserRole = 'admin' | 'b2b_partner';
export type UserType = 'private' | 'company';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Типи компаній
export type CompanyStatus = 'pending' | 'active' | 'suspended';

export interface Company {
  id: string;
  name: string;
  tax_id: string;
  address?: string;
  phone?: string;
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
}

// Типи транспортних засобів
export type VehicleStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type DelegationMode = 'service_only' | 'partial' | 'full_delegation';

export interface Vehicle {
  id: string;
  company_id?: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  status: VehicleStatus;
  delegation_mode: DelegationMode;
  atom_vehicle_id?: string;
  created_at: string;
  updated_at: string;
}

// Типи документів
export type DocumentType = 'insurance' | 'registration' | 'contract';
export type DocumentStatus = 'uploaded' | 'signed' | 'rejected';

export interface Document {
  id: string;
  company_id?: string;
  vehicle_id: string;
  doc_type: DocumentType;
  file_url: string;
  signed_at?: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
}

// Типи для форм
export interface VehicleFormData {
  brand: string;
  model: string;
  year: number | '';
  license_plate: string;
  delegation_mode: DelegationMode;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  companyName?: string;
  taxId?: string;
}

// Типи для API відповідей
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Типи для OTP верифікації
export type PhoneVerificationStatus = 'pending' | 'verified' | 'failed';

export interface OtpVerification {
  phone: string;
  code: string;
  userId: string;
}
