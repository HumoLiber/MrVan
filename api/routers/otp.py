from fastapi import APIRouter, HTTPException, status
from typing import Any, Dict

from models.schemas import OTPRequest, OTPVerify
from services.otp_service import send_verification_code, verify_code

router = APIRouter()

@router.post("/send", status_code=status.HTTP_200_OK)
async def send_otp(otp_request: OTPRequest) -> Dict[str, Any]:
    """
    Send OTP to phone number
    """
    result = await send_verification_code(otp_request.phone_number)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification code"
        )
    
    return {"message": "Verification code sent successfully"}

@router.post("/verify", status_code=status.HTTP_200_OK)
async def verify_otp(otp_verify: OTPVerify) -> Dict[str, Any]:
    """
    Verify OTP code
    """
    result = await verify_code(otp_verify.phone_number, otp_verify.code)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    return {"message": "Verification successful", "verified": True}
