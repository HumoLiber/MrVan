// Скрипт для створення таблиць у Supabase через командний рядок
// Запустіть цей скрипт командою: node create_tables.js

// Імпортуємо необхідні модулі
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Конфігурація Supabase
const supabaseUrl = 'https://yvolceamgqrgexrsddvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b2xjZWFtZ3FyZ2V4cnNkZHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU1NjI3NCwiZXhwIjoyMDU4MTMyMjc0fQ.ybaimJL0vs6JOJ8m7DmWL_KS2WOuK5Vg6ZCihv6vVTE';

// Створення клієнта Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Функція для виконання SQL запиту
async function executeSQL(sql) {
  try {
    console.log('Виконання SQL запиту...');
    // Використовуємо REST API для виконання SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Помилка при виконанні SQL:', error);
      return { success: false, error };
    }
    
    console.log('SQL запит успішно виконано');
    return { success: true };
  } catch (error) {
    console.error('Виняток при виконанні SQL:', error);
    return { success: false, error };
  }
}

// Функція для створення таблиці leads
async function createLeadsTable() {
  const sql = `
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
  
  console.log('Створення таблиці leads...');
  return await executeSQL(sql);
}

// Функція для створення таблиці contacts
async function createContactsTable() {
  const sql = `
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
  
  console.log('Створення таблиці contacts...');
  return await executeSQL(sql);
}

// Функція для створення таблиці subscriptions
async function createSubscriptionsTable() {
  const sql = `
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
  
  console.log('Створення таблиці subscriptions...');
  return await executeSQL(sql);
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

// Головна функція
async function main() {
  // Перевіряємо підключення
  const connectionResult = await checkConnection();
  
  if (!connectionResult.connected) {
    console.error('Помилка підключення до Supabase. Неможливо створити таблиці.');
    process.exit(1);
  }
  
  // Створюємо таблиці
  const leadsResult = await createLeadsTable();
  if (!leadsResult.success) {
    console.error('Помилка при створенні таблиці leads:', leadsResult.error);
  } else {
    console.log('Таблиця leads успішно створена або вже існує');
  }
  
  const contactsResult = await createContactsTable();
  if (!contactsResult.success) {
    console.error('Помилка при створенні таблиці contacts:', contactsResult.error);
  } else {
    console.log('Таблиця contacts успішно створена або вже існує');
  }
  
  const subscriptionsResult = await createSubscriptionsTable();
  if (!subscriptionsResult.success) {
    console.error('Помилка при створенні таблиці subscriptions:', subscriptionsResult.error);
  } else {
    console.log('Таблиця subscriptions успішно створена або вже існує');
  }
  
  console.log('Всі операції завершено.');
}

// Запускаємо головну функцію
main().catch(error => {
  console.error('Критична помилка:', error);
  process.exit(1);
});
