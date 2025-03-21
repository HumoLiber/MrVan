// Скрипт для програмного створення таблиць у Supabase
import { supabase } from './supabase.js';

// Функція для виконання SQL запитів
async function executeSQL(query) {
  try {
    // Примітка: для виконання SQL запитів потрібен service_role ключ
    // Цей код буде працювати тільки з відповідними правами
    const { data, error } = await supabase.rpc('pgexec', { query });
    
    if (error) {
      console.error('Помилка при виконанні SQL запиту:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Виняток при виконанні SQL запиту:', error);
    return { success: false, error };
  }
}

// SQL для створення таблиці лідів (потенційних клієнтів)
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

// SQL для створення таблиці контактів (залишаємо для сумісності)
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

// Функція для створення таблиці лідів
async function createLeadsTable() {
  console.log('Створення таблиці leads...');
  return await executeSQL(createLeadsTableSQL);
}

// Функція для створення всіх таблиць
async function createAllTables() {
  console.log('Створення таблиці leads...');
  const leadsResult = await executeSQL(createLeadsTableSQL);
  
  console.log('Створення таблиці contacts...');
  const contactsResult = await executeSQL(createContactsTableSQL);
  
  console.log('Створення таблиці subscriptions...');
  const subscriptionsResult = await executeSQL(createSubscriptionsTableSQL);
  
  return {
    leads: leadsResult,
    contacts: contactsResult,
    subscriptions: subscriptionsResult
  };
}

// Функція для перевірки підключення до Supabase
async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
    
    if (error && error.code !== '42P01') {
      console.error('Помилка підключення до Supabase:', error);
      return { connected: false, error };
    }
    
    return { connected: true };
  } catch (error) {
    console.error('Виняток при перевірці підключення до Supabase:', error);
    return { connected: false, error };
  }
}

// Ініціалізація бази даних
async function initializeDatabase() {
  console.log('Перевірка підключення до Supabase...');
  const connectionCheck = await checkSupabaseConnection();
  
  if (!connectionCheck.connected) {
    console.error('Не вдалося підключитися до Supabase. Перевірте URL та ключ API.');
    return { success: false, error: connectionCheck.error };
  }
  
  console.log('Підключення до Supabase успішне. Створення таблиць...');
  const tablesResult = await createAllTables();
  
  return {
    success: tablesResult.contacts.success && tablesResult.subscriptions.success,
    tables: tablesResult
  };
}

// Експортуємо функції
export {
  initializeDatabase,
  createAllTables,
  createLeadsTable,
  checkSupabaseConnection,
  executeSQL
};

// Якщо скрипт запущено напряму, виконуємо ініціалізацію
if (typeof window !== 'undefined' && window.document && window.document.currentScript && window.document.currentScript.getAttribute('data-init') === 'true') {
  initializeDatabase().then(result => {
    console.log('Результат ініціалізації бази даних:', result);
  });
}
