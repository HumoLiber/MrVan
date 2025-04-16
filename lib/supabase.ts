import { createClient } from '@supabase/supabase-js';

// Використовуємо значення з .env.local або жорстко задані, якщо середовище не налаштовано
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ektalbtnirqlttfkxdhe.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGFsYnRuaXJxbHR0Zmt4ZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Nzg0MDMsImV4cCI6MjA1ODE1NDQwM30.rAnmyyn7W9VHmb8f0LOEQ6LesoqpaFZjT034IyHkBes';

// Перевіряємо, що URL і ключ не порожні
if (!supabaseUrl || !supabaseKey) {
  console.error('Відсутні Supabase URL або ключ! Перевірте налаштування середовища.');
}

console.log('Supabase URL:', supabaseUrl); // Для відладки

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 