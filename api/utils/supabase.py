from supabase import create_client
from config.settings import settings

# Create a Supabase client
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_client():
    """
    Get the Supabase client instance
    """
    return supabase
