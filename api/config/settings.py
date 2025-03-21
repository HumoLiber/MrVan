import os
from typing import List
from pydantic import BaseSettings, AnyHttpUrl
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "MrVan B2B Partners API"
    
    # CORS Settings
    CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://partners.mistervan.es"
    ]
    
    # Supabase Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # JWT Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Twilio Settings for OTP
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_VERIFY_SERVICE_SID: str = os.getenv("TWILIO_VERIFY_SERVICE_SID", "")
    
    # ATOM Mobility API Settings
    ATOM_API_URL: str = os.getenv("ATOM_API_URL", "")
    ATOM_API_KEY: str = os.getenv("ATOM_API_KEY", "")
    
    # Admin Settings
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@mistervan.es")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")
    
    # Email Settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "info@mistervan.es")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "MrVan B2B Platform")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

# Create settings instance
settings = Settings()
