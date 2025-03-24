// Типи ролей
export type UserRole = 
  | 'investor' 
  | 'company_owner' 
  | 'private_owner' 
  | 'agency' 
  | 'agent';

// Типи моделей делегації для компаній
export type DelegationModel = 
  | 'service_only' 
  | 'partial_help' 
  | 'full_delegation';

// Базовий інтерфейс користувача
export interface BaseUser {
  id?: string;
  email: string;
  phone: string;
  isPhoneVerified?: boolean;
  createdAt?: Date;
  role: UserRole;
}

// Інтерфейс інвестора
export interface Investor extends BaseUser {
  role: 'investor';
  name: string;
  investmentAmount?: number;
  regionsOfInterest?: string[];
  documentsUploaded?: boolean;
  ndaSigned?: boolean;
  investorAgreementSigned?: boolean;
  adminReviewed?: boolean;
}

// Інтерфейс компанії-власника
export interface CompanyOwner extends BaseUser {
  role: 'company_owner';
  companyName: string;
  registrationNumber: string;
  delegationModel: DelegationModel;
  documentsUploaded?: boolean;
  agreementSigned?: boolean;
  adminReviewed?: boolean;
}

// Інтерфейс приватного власника
export interface PrivateOwner extends BaseUser {
  role: 'private_owner';
  name: string;
  documentsUploaded?: boolean;
  agreementSigned?: boolean;
  adminReviewed?: boolean;
}

// Інтерфейс агентства-співробітника
export interface Agency extends BaseUser {
  role: 'agency';
  name: string;
  registrationNumber: string;
  collaborationType: string;
  agreementSigned?: boolean;
  adminReviewed?: boolean;
}

// Інтерфейс агента-співробітника
export interface Agent extends BaseUser {
  role: 'agent';
  name: string;
  region: string;
  experience?: string;
  agreementSigned?: boolean;
  adminReviewed?: boolean;
}

// Інтерфейс транспортного засобу (кемпера)
export interface Vehicle {
  id?: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  ownerId: string;
  ownerType: 'company' | 'private';
  delegationModel: DelegationModel;
  documentsUploaded?: boolean;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'needs_more_info';
  atomVehicleId?: string;
} 