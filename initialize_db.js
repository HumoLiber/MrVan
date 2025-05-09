// Скрипт для ініціалізації бази даних Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Конфігурація Supabase
const supabaseUrl = 'https://yvolceamgqrgexrsddvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b2xjZWFtZ3FyZ2V4cnNkZHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU1NjI3NCwiZXhwIjoyMDU4MTMyMjc0fQ.ybaimJL0vs6JOJ8m7DmWL_KS2WOuK5Vg6ZCihv6vVTE';

// Створення клієнта Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL для створення таблиці лідів
const createLeadsTableSQL = `
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  bank_name TEXT,
  company TEXT,
  phone TEXT,
  portfolio TEXT,
  region TEXT,
  tech_stack TEXT,
  consent BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Створюємо політику для вставки (будь-хто може додавати ліди)
CREATE POLICY IF NOT EXISTS "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Створюємо політику для читання (тільки авторизовані користувачі можуть читати)
CREATE POLICY IF NOT EXISTS "Authenticated users can read leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');
`;

// SQL для створення таблиці контактів
const createContactsTableSQL = `
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Створюємо політику для вставки (будь-хто може додавати контакти)
CREATE POLICY IF NOT EXISTS "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Створюємо політику для читання (тільки авторизовані користувачі можуть читати)
CREATE POLICY IF NOT EXISTS "Authenticated users can read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');
`;

// SQL для створення таблиці підписок
const createSubscriptionsTableSQL = `
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Створюємо політику для вставки (будь-хто може підписатися)
CREATE POLICY IF NOT EXISTS "Anyone can insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (true);

-- Створюємо політику для читання (тільки авторизовані користувачі можуть читати)
CREATE POLICY IF NOT EXISTS "Authenticated users can read subscriptions" ON subscriptions
  FOR SELECT USING (auth.role() = 'authenticated');
`;

// Функція для виконання SQL запиту
async function executeSQL(sql) {
  try {
    console.log('Виконання SQL запиту...');
    const { data, error } = await supabase.rpc('pgexec', { query: sql });
    
    if (error) {
      console.error('Помилка при виконанні SQL:', error);
      return { success: false, error };
    }
    
    console.log('SQL запит успішно виконано');
    return { success: true, data };
  } catch (error) {
    console.error('Виняток при виконанні SQL:', error);
    return { success: false, error };
  }
}

// Функція для ініціалізації бази даних
async function initializeDatabase() {
  console.log('Початок ініціалізації бази даних...');
  
  console.log('Створення таблиці leads...');
  const leadsResult = await executeSQL(createLeadsTableSQL);
  if (!leadsResult.success) {
    console.error('Помилка при створенні таблиці leads:', leadsResult.error);
  } else {
    console.log('Таблиця leads успішно створена або вже існує');
  }
  
  console.log('Створення таблиці contacts...');
  const contactsResult = await executeSQL(createContactsTableSQL);
  if (!contactsResult.success) {
    console.error('Помилка при створенні таблиці contacts:', contactsResult.error);
  } else {
    console.log('Таблиця contacts успішно створена або вже існує');
  }
  
  console.log('Створення таблиці subscriptions...');
  const subscriptionsResult = await executeSQL(createSubscriptionsTableSQL);
  if (!subscriptionsResult.success) {
    console.error('Помилка при створенні таблиці subscriptions:', subscriptionsResult.error);
  } else {
    console.log('Таблиця subscriptions успішно створена або вже існує');
  }
  
  console.log('Ініціалізація бази даних завершена');
  return {
    leads: leadsResult,
    contacts: contactsResult,
    subscriptions: subscriptionsResult
  };
}

// Перевірка підключення до Supabase
async function checkConnection() {
  try {
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1);
    
    if (error && error.code === '42P01') {
      // Таблиця не існує, але підключення працює
      return { connected: true };
    } else if (error) {
      return { connected: false, error };
    }
    
    return { connected: true };
  } catch (error) {
    return { connected: false, error };
  }
}

// Головна функція
async function main() {
  console.log('Перевірка підключення до Supabase...');
  const connectionResult = await checkConnection();
  
  if (!connectionResult.connected) {
    console.error('Помилка підключення до Supabase:', connectionResult.error);
    return;
  }
  
  console.log('Підключення до Supabase успішне!');
  
  // Ініціалізуємо базу даних
  const dbResult = await initializeDatabase();
  console.log('Результат ініціалізації бази даних:', dbResult);
}

// Запускаємо головну функцію
main().catch(error => {
  console.error('Критична помилка:', error);
});
