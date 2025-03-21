# Supabase Setup Instructions

Please create a file at `/Users/humoliber/Development/Mr.Van/partners.mistervan.es/api/.env` with the following content:

```
# Supabase Settings
SUPABASE_URL=https://ektalbtnirqlttfkxdhe.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGFsYnRuaXJxbHR0Zmt4ZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Nzg0MDMsImV4cCI6MjA1ODE1NDQwM30.rAnmyyn7W9VHmb8f0LOEQ6LesoqpaFZjT034IyHkBes

# JWT Settings
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_ALGORITHM=HS256

# Twilio Settings for OTP
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid

# ATOM Mobility API Settings
ATOM_API_URL=https://api.atommobility.com/v1
ATOM_API_KEY=your-atom-api-key

# Admin Settings
ADMIN_EMAIL=admin@mistervan.es
ADMIN_PASSWORD=your-secure-admin-password

# Email Settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
EMAILS_FROM_EMAIL=info@mistervan.es
EMAILS_FROM_NAME=MrVan B2B Platform
```

## Important Notes:

1. The `.env` file contains sensitive information and should never be committed to version control.
2. For production, you should use more secure values for JWT_SECRET and ADMIN_PASSWORD.
3. You'll need to update the other API keys and credentials as they become available.

## For Vercel Deployment:

When deploying to Vercel, you should add these environment variables in the Vercel project settings:

1. Go to your project on Vercel
2. Navigate to Settings > Environment Variables
3. Add each of the variables from the `.env` file

This ensures your API has access to these credentials in the production environment.
