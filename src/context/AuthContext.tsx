import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthService, SignUpData } from '../services/authService';
import { supabaseClient } from '../services/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      const { session, error } = await AuthService.getSession();
      if (!error) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (data: SignUpData) => {
    const response = await AuthService.signUp(data);
    return {
      user: response.user,
      error: response.error
    };
  };

  const signIn = async (email: string, password: string) => {
    const response = await AuthService.signIn(email, password);
    return {
      user: response.user,
      error: response.error
    };
  };

  const signOut = async () => {
    return await AuthService.signOut();
  };
  
  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email);
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
