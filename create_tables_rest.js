// Скрипт для створення таблиць у Supabase через REST API
// Запустіть цей скрипт командою: node create_tables_rest.js

// Імпортуємо необхідні модулі
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Конфігурація Supabase
const supabaseUrl = 'https://yvolceamgqrgexrsddvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b2xjZWFtZ3FyZ2V4cnNkZHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU1NjI3NCwiZXhwIjoyMDU4MTMyMjc0fQ.ybaimJL0vs6JOJ8m7DmWL_KS2WOuK5Vg6ZCihv6vVTE';

// Створення клієнта Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL для створення таблиці leads
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

// SQL для створення таблиці contacts
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

// SQL для створення таблиці subscriptions
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

// Функція для виконання SQL через REST API
async function executeSQLviaREST(sql) {
  try {
    console.log('Виконання SQL запиту через REST API...');
    
    // Використовуємо Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        sql_query: sql
      })
    });
    
    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch (e) {
        errorText = await response.text();
      }
      
      console.error(`Помилка при виконанні SQL (HTTP ${response.status}):`, errorText);
      return { success: false, error: { status: response.status, message: errorText } };
    }
    
    console.log('SQL запит успішно виконано');
    return { success: true };
  } catch (error) {
    console.error('Виняток при виконанні SQL:', error);
    return { success: false, error };
  }
}

// Функція для перевірки існування таблиці
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('id').limit(1);
    
    if (error && error.code === '42P01') {
      // Таблиця не існує
      return false;
    } else if (error) {
      console.error(`Помилка при перевірці таблиці ${tableName}:`, error);
      throw error;
    }
    
    // Таблиця існує
    return true;
  } catch (error) {
    console.error(`Виняток при перевірці таблиці ${tableName}:`, error);
    throw error;
  }
}

// Функція для створення таблиці leads
async function createLeadsTable() {
  console.log('Створення таблиці leads...');
  
  try {
    // Перевіряємо, чи існує таблиця
    const exists = await tableExists('leads');
    
    if (!exists) {
      // Таблиця не існує, створюємо її
      const result = await executeSQLviaREST(createLeadsTableSQL);
      
      if (!result.success) {
        console.error('Помилка при створенні таблиці leads:', result.error);
        return result;
      }
      
      console.log('Таблиця leads успішно створена');
      return { success: true };
    } else {
      console.log('Таблиця leads вже існує');
      return { success: true };
    }
  } catch (error) {
    console.error('Виняток при створенні таблиці leads:', error);
    return { success: false, error };
  }
}

// Функція для створення таблиці contacts
async function createContactsTable() {
  console.log('Створення таблиці contacts...');
  
  try {
    // Перевіряємо, чи існує таблиця
    const exists = await tableExists('contacts');
    
    if (!exists) {
      // Таблиця не існує, створюємо її
      const result = await executeSQLviaREST(createContactsTableSQL);
      
      if (!result.success) {
        console.error('Помилка при створенні таблиці contacts:', result.error);
        return result;
      }
      
      console.log('Таблиця contacts успішно створена');
      return { success: true };
    } else {
      console.log('Таблиця contacts вже існує');
      return { success: true };
    }
  } catch (error) {
    console.error('Виняток при створенні таблиці contacts:', error);
    return { success: false, error };
  }
}

// Функція для створення таблиці subscriptions
async function createSubscriptionsTable() {
  console.log('Створення таблиці subscriptions...');
  
  try {
    // Перевіряємо, чи існує таблиця
    const exists = await tableExists('subscriptions');
    
    if (!exists) {
      // Таблиця не існує, створюємо її
      const result = await executeSQLviaREST(createSubscriptionsTableSQL);
      
      if (!result.success) {
        console.error('Помилка при створенні таблиці subscriptions:', result.error);
        return result;
      }
      
      console.log('Таблиця subscriptions успішно створена');
      return { success: true };
    } else {
      console.log('Таблиця subscriptions вже існує');
      return { success: true };
    }
  } catch (error) {
    console.error('Виняток при створенні таблиці subscriptions:', error);
    return { success: false, error };
  }
}

// Перевірка підключення до Supabase
async function checkConnection() {
  try {
    console.log('Перевірка підключення до Supabase...');
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1);
    
    if (error && error.code === '42P01') {
      // Таблиця не існує, але підключення працює
      console.log('Підключення до Supabase успішне!');
      return { connected: true };
    } else if (error) {
      console.error('Помилка підключення до Supabase:', error);
      return { connected: false, error };
    }
    
    console.log('Підключення до Supabase успішне!');
    return { connected: true };
  } catch (error) {
    console.error('Виняток при перевірці підключення:', error);
    return { connected: false, error };
  }
}

// Перевірка наявності функції execute_sql
async function checkExecuteSQLFunction() {
  try {
    console.log('Перевірка наявності функції execute_sql...');
    
    // Спробуємо викликати функцію
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        sql_query: 'SELECT 1'
      })
    });
    
    if (!response.ok) {
      console.error(`Функція execute_sql не знайдена (HTTP ${response.status})`);
      
      // Спробуємо створити функцію
      console.log('Спроба створити функцію execute_sql...');
      
      const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
      `;
      
      // Виконуємо SQL для створення функції
      const createResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: createFunctionSQL
        })
      });
      
      if (!createResponse.ok) {
        console.error('Не вдалося створити функцію execute_sql');
        return { success: false };
      }
      
      console.log('Функція execute_sql успішно створена');
      return { success: true };
    }
    
    console.log('Функція execute_sql існує');
    return { success: true };
  } catch (error) {
    console.error('Виняток при перевірці функції execute_sql:', error);
    return { success: false, error };
  }
}

// Головна функція
async function main() {
  // Перевіряємо підключення
  const connectionResult = await checkConnection();
  
  if (!connectionResult.connected) {
    console.error('Помилка підключення до Supabase. Неможливо створити таблиці.');
    process.exit(1);
  }
  
  // Перевіряємо наявність функції execute_sql
  const functionResult = await checkExecuteSQLFunction();
  
  if (!functionResult.success) {
    console.error('Не вдалося створити або перевірити функцію execute_sql. Неможливо створити таблиці.');
    process.exit(1);
  }
  
  // Створюємо таблиці
  const leadsResult = await createLeadsTable();
  if (!leadsResult.success) {
    console.error('Помилка при створенні таблиці leads:', leadsResult.error);
  }
  
  const contactsResult = await createContactsTable();
  if (!contactsResult.success) {
    console.error('Помилка при створенні таблиці contacts:', contactsResult.error);
  }
  
  const subscriptionsResult = await createSubscriptionsTable();
  if (!subscriptionsResult.success) {
    console.error('Помилка при створенні таблиці subscriptions:', subscriptionsResult.error);
  }
  
  console.log('Всі операції завершено.');
}

// Запускаємо головну функцію
main().catch(error => {
  console.error('Критична помилка:', error);
  process.exit(1);
});
