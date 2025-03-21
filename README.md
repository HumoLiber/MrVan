# MrVan B2B Onboarding & Vehicle Management Platform

A comprehensive platform for industry representatives to register and manage their vehicles with MrVan.

## Project Overview

The MrVan B2B Platform is designed to streamline the onboarding process for partners and vehicle owners who want to integrate with MrVan's vehicle management system. The platform allows users to register, add vehicles, upload necessary documentation, and track the approval process.

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material UI** - Component library for consistent design
- **React Router** - For navigation and routing
- **Supabase JS Client** - For authentication and data access

### Backend
- **FastAPI** - Python web framework for building APIs
- **Supabase** - Backend-as-a-Service for database and authentication
- **Twilio** - For OTP verification
- **SMTP** - For email notifications
- **ATOM Mobility API** - For vehicle integration

## Project Structure

### Frontend
```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API service functions
├── styles/         # Global styles
├── utils/          # Utility functions
├── App.tsx         # Main application component
└── index.tsx       # Entry point
```

### Backend
```
api/
├── config/         # Configuration settings
├── models/         # Data models and schemas
├── routers/        # API route handlers
├── services/       # Business logic services
├── utils/          # Utility functions
└── main.py         # FastAPI application entry point
```

## Features

- **User Authentication** - Secure login and registration with email/password
- **OTP Verification** - Phone number verification using Twilio
- **Vehicle Management** - Add, edit, and delete vehicles
- **Document Upload** - Upload and manage vehicle documentation
- **Admin Dashboard** - For reviewing and approving vehicle submissions
- **Email Notifications** - Automated emails for status updates
- **ATOM Mobility Integration** - Seamless integration with ATOM's vehicle management system

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Supabase account
- Twilio account (for OTP)
- SMTP server access (for emails)

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your configuration:
   ```
   # Copy from .env.example and fill in your values
   cp .env.example .env
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

## Database Schema

The platform uses Supabase with the following main tables:

- **users** - User accounts and profile information
- **vehicles** - Vehicle information and status
- **documents** - Vehicle documentation and verification status

## Deployment

### Frontend
1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy to your hosting provider of choice (Vercel, Netlify, etc.)

### Backend
1. Deploy using a service like Heroku, AWS, or Google Cloud
2. Set up environment variables on your hosting platform
3. Configure CORS to allow requests from your frontend domain

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary - All rights reserved by MrVan.

## Contact

For questions or support, please contact support@mistervan.es
