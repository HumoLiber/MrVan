from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
import re


class UserBase(BaseModel):
    email: EmailStr
    company_name: str
    phone_number: str
    
    @validator('phone_number')
    def validate_phone_number(cls, v):
        # Simple validation for international phone number format
        if not re.match(r'^\+?[1-9]\d{1,14}$', v):
            raise ValueError('Invalid phone number format. Please use international format (e.g., +34612345678)')
        return v


class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    id: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


class User(UserBase):
    id: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


class VehicleBase(BaseModel):
    brand: str
    model: str
    year: int
    license_plate: str
    delegation_mode: str = Field(..., description="Options: service_only, partial, full_delegation")
    
    @validator('year')
    def validate_year(cls, v):
        current_year = datetime.now().year
        if v < 1900 or v > current_year + 1:
            raise ValueError(f'Year must be between 1900 and {current_year + 1}')
        return v
    
    @validator('delegation_mode')
    def validate_delegation_mode(cls, v):
        valid_modes = ['service_only', 'partial', 'full_delegation']
        if v not in valid_modes:
            raise ValueError(f'Delegation mode must be one of: {", ".join(valid_modes)}')
        return v


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    license_plate: Optional[str] = None
    delegation_mode: Optional[str] = None
    status: Optional[str] = None
    atom_vehicle_id: Optional[str] = None


class Vehicle(VehicleBase):
    id: str
    user_id: str
    status: str
    atom_vehicle_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True


class DocumentBase(BaseModel):
    vehicle_id: str
    doc_type: str = Field(..., description="Options: insurance, registration, contract")
    file_url: str
    
    @validator('doc_type')
    def validate_doc_type(cls, v):
        valid_types = ['insurance', 'registration', 'contract']
        if v not in valid_types:
            raise ValueError(f'Document type must be one of: {", ".join(valid_types)}')
        return v


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    doc_type: Optional[str] = None
    file_url: Optional[str] = None
    status: Optional[str] = None


class Document(DocumentBase):
    id: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True


class OTPRequest(BaseModel):
    phone_number: str
    
    @validator('phone_number')
    def validate_phone_number(cls, v):
        if not re.match(r'^\+?[1-9]\d{1,14}$', v):
            raise ValueError('Invalid phone number format. Please use international format (e.g., +34612345678)')
        return v


class OTPVerify(BaseModel):
    phone_number: str
    code: str
    
    @validator('code')
    def validate_code(cls, v):
        if not v.isdigit() or len(v) != 6:
            raise ValueError('OTP code must be a 6-digit number')
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordReset(BaseModel):
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class AdminVehicleApproval(BaseModel):
    vehicle_id: str
    status: str = Field(..., description="Options: approved, rejected")
    atom_vehicle_id: Optional[str] = None
    rejection_reason: Optional[str] = None
    
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['approved', 'rejected']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v
