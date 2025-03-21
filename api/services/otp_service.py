from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from config.settings import settings

# Initialize Twilio client
client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

async def send_verification_code(phone_number: str) -> bool:
    """
    Send a verification code to the provided phone number
    
    Args:
        phone_number: The phone number to send the verification code to
        
    Returns:
        bool: True if the verification code was sent successfully, False otherwise
    """
    try:
        verification = client.verify \
            .services(settings.TWILIO_VERIFY_SERVICE_SID) \
            .verifications \
            .create(to=phone_number, channel='sms')
            
        return verification.status == 'pending'
    except TwilioRestException as e:
        print(f"Error sending verification code: {e}")
        return False

async def verify_code(phone_number: str, code: str) -> bool:
    """
    Verify a code against a phone number
    
    Args:
        phone_number: The phone number to verify
        code: The verification code
        
    Returns:
        bool: True if the code is valid, False otherwise
    """
    try:
        verification_check = client.verify \
            .services(settings.TWILIO_VERIFY_SERVICE_SID) \
            .verification_checks \
            .create(to=phone_number, code=code)
            
        return verification_check.status == 'approved'
    except TwilioRestException as e:
        print(f"Error verifying code: {e}")
        return False
