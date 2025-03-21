from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Any

from models.schemas import UserCreate, User, Token, PasswordResetRequest, PasswordReset, LoginRequest
from utils.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_active_user
)
from utils.supabase import get_supabase_client
from services.email_service import send_password_reset_email
from config.settings import settings

router = APIRouter()

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate) -> Any:
    """
    Register a new user
    """
    supabase = get_supabase_client()
    
    # Check if user already exists
    response = supabase.table("users").select("*").eq("email", user_data.email).execute()
    
    if response.data and len(response.data) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user in Supabase
    user_dict = user_data.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    user_dict["is_active"] = True
    user_dict["is_admin"] = False
    
    response = supabase.table("users").insert(user_dict).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    return response.data[0]

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest) -> Any:
    """
    Login for access token
    """
    supabase = get_supabase_client()
    
    # Get user by email
    response = supabase.table("users").select("*").eq("email", login_data.email).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = response.data[0]
    
    # Check if password is correct
    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login/token", response_model=Token)
async def login_with_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    supabase = get_supabase_client()
    
    # Get user by email
    response = supabase.table("users").select("*").eq("email", form_data.username).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = response.data[0]
    
    # Check if password is correct
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/password-reset-request", status_code=status.HTTP_204_NO_CONTENT)
async def request_password_reset(reset_request: PasswordResetRequest) -> Any:
    """
    Request a password reset
    """
    supabase = get_supabase_client()
    
    # Check if user exists
    response = supabase.table("users").select("*").eq("email", reset_request.email).execute()
    
    if not response.data or len(response.data) == 0:
        # Don't reveal that the user doesn't exist
        return
    
    user = response.data[0]
    
    # Create a password reset token
    token_expires = timedelta(hours=24)
    token = create_access_token(
        data={"sub": user["id"], "type": "password_reset"},
        expires_delta=token_expires
    )
    
    # Send password reset email
    await send_password_reset_email(reset_request.email, token)
    
    return

@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(reset_data: PasswordReset) -> Any:
    """
    Reset password
    """
    try:
        # Decode the JWT token
        payload = jwt.decode(
            reset_data.token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        user_id = payload.get("sub")
        token_type = payload.get("type")
        
        if user_id is None or token_type != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token"
            )
        
        # Hash the new password
        hashed_password = get_password_hash(reset_data.new_password)
        
        # Update the user's password
        supabase = get_supabase_client()
        response = supabase.table("users").update(
            {"hashed_password": hashed_password}
        ).eq("id", user_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to reset password"
            )
        
        return
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

@router.get("/me", response_model=User)
async def get_current_user_info(current_user = Depends(get_current_active_user)) -> Any:
    """
    Get current user information
    """
    return current_user
