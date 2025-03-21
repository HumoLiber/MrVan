import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.settings import settings

async def send_email(
    email_to: str,
    subject: str,
    html_content: str,
    text_content: str = None
) -> bool:
    """
    Send an email
    
    Args:
        email_to: Recipient email address
        subject: Email subject
        html_content: HTML content of the email
        text_content: Plain text content of the email (optional)
        
    Returns:
        bool: True if the email was sent successfully, False otherwise
    """
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
    message["To"] = email_to
    
    # Add plain text version
    if text_content:
        message.attach(MIMEText(text_content, "plain"))
    
    # Add HTML version
    message.attach(MIMEText(html_content, "html"))
    
    try:
        # Connect to SMTP server
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(
                settings.EMAILS_FROM_EMAIL,
                email_to,
                message.as_string()
            )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

async def send_password_reset_email(email_to: str, token: str) -> bool:
    """
    Send a password reset email
    
    Args:
        email_to: Recipient email address
        token: Password reset token
        
    Returns:
        bool: True if the email was sent successfully, False otherwise
    """
    reset_link = f"https://partners.mistervan.es/reset-password?token={token}"
    
    subject = "MrVan B2B Platform - Password Reset"
    
    html_content = f"""
    <html>
        <body>
            <h1>Password Reset</h1>
            <p>You have requested to reset your password for the MrVan B2B Platform.</p>
            <p>Please click the link below to reset your password:</p>
            <p><a href="{reset_link}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>The link will expire in 24 hours.</p>
            <p>Best regards,<br>MrVan Team</p>
        </body>
    </html>
    """
    
    text_content = f"""
    Password Reset
    
    You have requested to reset your password for the MrVan B2B Platform.
    
    Please visit the following link to reset your password:
    {reset_link}
    
    If you did not request this, please ignore this email.
    The link will expire in 24 hours.
    
    Best regards,
    MrVan Team
    """
    
    return await send_email(email_to, subject, html_content, text_content)

async def send_vehicle_status_update_email(
    email_to: str,
    vehicle_brand: str,
    vehicle_model: str,
    license_plate: str,
    status: str,
    rejection_reason: str = None
) -> bool:
    """
    Send a vehicle status update email
    
    Args:
        email_to: Recipient email address
        vehicle_brand: Vehicle brand
        vehicle_model: Vehicle model
        license_plate: Vehicle license plate
        status: New vehicle status
        rejection_reason: Reason for rejection (if applicable)
        
    Returns:
        bool: True if the email was sent successfully, False otherwise
    """
    subject = f"MrVan B2B Platform - Vehicle Status Update: {status.capitalize()}"
    
    status_message = ""
    if status == "approved":
        status_message = "Your vehicle has been approved and is now ready to be managed through our platform."
    elif status == "rejected":
        status_message = f"Unfortunately, your vehicle has been rejected. Reason: {rejection_reason or 'No specific reason provided.'}"
    
    html_content = f"""
    <html>
        <body>
            <h1>Vehicle Status Update</h1>
            <p>The status of your vehicle has been updated:</p>
            <ul>
                <li><strong>Vehicle:</strong> {vehicle_brand} {vehicle_model}</li>
                <li><strong>License Plate:</strong> {license_plate}</li>
                <li><strong>New Status:</strong> {status.capitalize()}</li>
            </ul>
            <p>{status_message}</p>
            <p>You can view more details by logging into your account at <a href="https://partners.mistervan.es">partners.mistervan.es</a>.</p>
            <p>Best regards,<br>MrVan Team</p>
        </body>
    </html>
    """
    
    text_content = f"""
    Vehicle Status Update
    
    The status of your vehicle has been updated:
    
    Vehicle: {vehicle_brand} {vehicle_model}
    License Plate: {license_plate}
    New Status: {status.capitalize()}
    
    {status_message}
    
    You can view more details by logging into your account at partners.mistervan.es.
    
    Best regards,
    MrVan Team
    """
    
    return await send_email(email_to, subject, html_content, text_content)
