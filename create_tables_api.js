// Скрипт для створення таблиць у Supabase через API
// Запустіть цей скрипт командою: node create_tables_api.js

// Імпортуємо необхідні модулі
const { createClient } = require('@supabase/supabase-js');

// Конфігурація Supabase
const supabaseUrl = 'https://yvolceamgqrgexrsddvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b2xjZWFtZ3FyZ2V4cnNkZHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU1NjI3NCwiZXhwIjoyMDU4MTMyMjc0fQ.ybaimJL0vs6JOJ8m7DmWL_KS2WOuK5Vg6ZCihv6vVTE';

// Створення клієнта Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Функція для створення таблиці leads
async function createLeadsTable() {
  console.log('Створення таблиці leads...');
  
  try {
    // Перевіряємо, чи існує таблиця
    const { error: checkError } = await supabase.from('leads').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      // Таблиця не існує, створюємо її
      const { error } = await supabase.schema.createTable('leads', [
        { name: 'id', type: 'serial', primaryKey: true },
        { name: 'name', type: 'text', notNull: true },
        { name: 'email', type: 'text', notNull: true },
        { name: 'type', type: 'text', notNull: true },
        { name: 'bank_name', type: 'text' },
        { name: 'company', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'portfolio', type: 'text' },
        { name: 'region', type: 'text' },
        { name: 'tech_stack', type: 'text' },
        { name: 'consent', type: 'boolean', defaultValue: true },
        { name: 'created_at', type: 'timestamptz', defaultValue: 'now()' }
      ]);
      
      if (error) {
        console.error('Помилка при створенні таблиці leads:', error);
        return { success: false, error };
      }
      
      // Включаємо RLS
      await supabase.schema.alterTable('leads', (table) => {
        table.enableRLS();
      });
      
      // Створюємо політики
      await supabase.schema.createPolicy('leads', 'Anyone can insert leads', {
        operation: 'INSERT',
        check: 'true'
      });
      
      await supabase.schema.createPolicy('leads', 'Authenticated users can read leads', {
        operation: 'SELECT',
        using: "auth.role() = 'authenticated'"
      });
      
      console.log('Таблиця leads успішно створена');
      return { success: true };
    } else if (checkError) {
      console.error('Помилка при перевірці таблиці leads:', checkError);
      return { success: false, error: checkError };
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
    const { error: checkError } = await supabase.from('contacts').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      // Таблиця не існує, створюємо її
      const { error } = await supabase.schema.createTable('contacts', [
        { name: 'id', type: 'serial', primaryKey: true },
        { name: 'name', type: 'text', notNull: true },
        { name: 'email', type: 'text', notNull: true },
        { name: 'type', type: 'text', notNull: true },
        { name: 'message', type: 'text' },
        { name: 'created_at', type: 'timestamptz', defaultValue: 'now()' }
      ]);
      
      if (error) {
        console.error('Помилка при створенні таблиці contacts:', error);
        return { success: false, error };
      }
      
      // Включаємо RLS
      await supabase.schema.alterTable('contacts', (table) => {
        table.enableRLS();
      });
      
      // Створюємо політики
      await supabase.schema.createPolicy('contacts', 'Anyone can insert contacts', {
        operation: 'INSERT',
        check: 'true'
      });
      
      await supabase.schema.createPolicy('contacts', 'Authenticated users can read contacts', {
        operation: 'SELECT',
        using: "auth.role() = 'authenticated'"
      });
      
      console.log('Таблиця contacts успішно створена');
      return { success: true };
    } else if (checkError) {
      console.error('Помилка при перевірці таблиці contacts:', checkError);
      return { success: false, error: checkError };
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
    const { error: checkError } = await supabase.from('subscriptions').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      // Таблиця не існує, створюємо її
      const { error } = await supabase.schema.createTable('subscriptions', [
        { name: 'id', type: 'serial', primaryKey: true },
        { name: 'email', type: 'text', notNull: true, unique: true },
        { name: 'created_at', type: 'timestamptz', defaultValue: 'now()' }
      ]);
      
      if (error) {
        console.error('Помилка при створенні таблиці subscriptions:', error);
        return { success: false, error };
      }
      
      // Включаємо RLS
      await supabase.schema.alterTable('subscriptions', (table) => {
        table.enableRLS();
      });
      
      // Створюємо політики
      await supabase.schema.createPolicy('subscriptions', 'Anyone can insert subscriptions', {
        operation: 'INSERT',
        check: 'true'
      });
      
      await supabase.schema.createPolicy('subscriptions', 'Authenticated users can read subscriptions', {
        operation: 'SELECT',
        using: "auth.role() = 'authenticated'"
      });
      
      console.log('Таблиця subscriptions успішно створена');
      return { success: true };
    } else if (checkError) {
      console.error('Помилка при перевірці таблиці subscriptions:', checkError);
      return { success: false, error: checkError };
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
