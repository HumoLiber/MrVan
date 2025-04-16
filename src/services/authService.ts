import { User, Session, createClient } from '@supabase/supabase-js';

// Створення клієнта Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export interface SignUpData {
  email: string;
  password: string;
  userType: 'private' | 'company';
  companyName?: string;
  taxId?: string;
}

export const AuthService = {
  /**
   * Sign up a new user
   */
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    try {
      // 1. Register user with Supabase Auth
      const { data: authData, error: signUpError } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (signUpError) throw signUpError;
      
      // 2. If company, create company record
      if (data.userType === 'company' && authData.user) {
        const { error: companyError } = await supabaseClient
          .from('companies')
          .insert([
            { 
              name: data.companyName, 
              tax_id: data.taxId,
              status: 'pending'
            }
          ]);
          
        if (companyError) throw companyError;
      }
      
      return {
        user: authData.user,
        session: authData.session,
        error: null
      };
    } catch (error) {
      console.error('Auth service error:', error);
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error : new Error('Unknown authentication error')
      };
    }
  },
  
  /**
   * Sign in an existing user
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return {
        user: data.user,
        session: data.session,
        error: null
      };
    } catch (error) {
      console.error('Auth service error:', error);
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error : new Error('Unknown authentication error')
      };
    }
  },
  
  /**
   * Sign out the current user
   */
  signOut: async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Auth service error:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown sign out error')
      };
    }
  },
  
  /**
   * Get the current session
   */
  getSession: async (): Promise<{ session: Session | null; error: Error | null }> => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      
      if (error) throw error;
      
      return {
        session: data.session,
        error: null
      };
    } catch (error) {
      console.error('Auth service error:', error);
      return {
        session: null,
        error: error instanceof Error ? error : new Error('Unknown session error')
      };
    }
  },
  
  /**
   * Reset password
   */
  resetPassword: async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Auth service error:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown password reset error')
      };
    }
  }
};
