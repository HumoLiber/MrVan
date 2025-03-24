// Експортуємо типи для зручності
export type { 
  User, 
  Session, 
  AuthError, 
  PostgrestError,
  SupabaseClient
} from '@supabase/supabase-js';

// Цей файл служить для реекспорту типів і не створює клієнт напряму
// Замість цього ми використовуємо контекст SupabaseContext
