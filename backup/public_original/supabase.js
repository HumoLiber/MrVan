// Інтеграція з Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Конфігурація Supabase
const supabaseUrl = 'https://yvolceamgqrgexrsddvd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b2xjZWFtZ3FyZ2V4cnNkZHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU1NjI3NCwiZXhwIjoyMDU4MTMyMjc0fQ.ybaimJL0vs6JOJ8m7DmWL_KS2WOuK5Vg6ZCihv6vVTE';

// Створення клієнта Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Функція для ініціалізації бази даних (створення таблиць)
async function initializeDatabase() {
  // Ця функція буде використовуватися для створення таблиць,
  // якщо у вас є service_role ключ з відповідними правами
  console.log('Ініціалізація бази даних...');
  
  try {
    // Виконуємо SQL запит для створення таблиці лідів
    const { data, error } = await supabase.rpc('pgexec', { 
      query: `
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
      `
    });
    
    if (error) {
      console.error('Помилка при створенні таблиці лідів:', error);
      return { success: false, error };
    }
    
    console.log('Таблиця лідів успішно створена');
    return { success: true, data };
  } catch (error) {
    console.error('Помилка при ініціалізації бази даних:', error);
    return { success: false, error };
  }
}

// Функція для перевірки існування таблиці лідів
async function checkLeadsTable() {
  try {
    // Перевіряємо чи існує таблиця
    const { error: checkError } = await supabase
      .from('leads')
      .select('id')
      .limit(1);
    
    // Якщо таблиця не існує, отримаємо помилку
    if (checkError && checkError.code === '42P01') {
      console.log('Таблиця leads не існує, потрібно створити через SQL API');
      return { exists: false, error: checkError };
    }
    
    return { exists: true };
  } catch (error) {
    console.error('Помилка при перевірці таблиці leads:', error);
    return { exists: false, error };
  }
}

// Функція для створення таблиці контактів
async function createContactsTable() {
  try {
    // Перевіряємо чи існує таблиця
    const { error: checkError } = await supabase
      .from('contacts')
      .select('id')
      .limit(1);
    
    // Якщо таблиця не існує, отримаємо помилку
    if (checkError && checkError.code === '42P01') {
      console.log('Таблиця contacts не існує, потрібно створити через SQL API');
      // Для створення таблиці потрібен service_role ключ і виклик SQL API
      return { exists: false, error: checkError };
    }
    
    return { exists: true };
  } catch (error) {
    console.error('Помилка при перевірці таблиці contacts:', error);
    return { exists: false, error };
  }
}

// Функція для створення таблиці підписок
async function createSubscriptionsTable() {
  try {
    // Перевіряємо чи існує таблиця
    const { error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    // Якщо таблиця не існує, отримаємо помилку
    if (checkError && checkError.code === '42P01') {
      console.log('Таблиця subscriptions не існує, потрібно створити через SQL API');
      // Для створення таблиці потрібен service_role ключ і виклик SQL API
      return { exists: false, error: checkError };
    }
    
    return { exists: true };
  } catch (error) {
    console.error('Помилка при перевірці таблиці subscriptions:', error);
    return { exists: false, error };
  }
}

// Функція для ініціалізації всіх таблиць
async function initializeTables() {
  const leadsResult = await checkLeadsTable();
  const contactsResult = await createContactsTable();
  const subscriptionsResult = await createSubscriptionsTable();
  
  return {
    leads: leadsResult,
    contacts: contactsResult,
    subscriptions: subscriptionsResult
  };
}

// Функція для збереження лідів
async function saveLead(leadData) {
  try {
    // Перевіряємо чи існує таблиця
    const { exists, error: tableError } = await checkLeadsTable();
    
    if (!exists) {
      console.log('Таблиця leads не існує, спроба створення...');
      // Спробуємо створити таблицю за допомогою SQL API
      const initResult = await initializeDatabase();
      if (!initResult.success) {
        return { success: false, error: initResult.error || tableError };
      }
    }
    
    // Додаємо лід до таблиці
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData]);
    
    if (error) {
      console.error('Помилка при збереженні ліда:', error);
      return { success: false, error };
    }
    
    console.log('Лід успішно збережено:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Помилка при збереженні ліда:', error);
    return { success: false, error };
  }
}

// Функція для збереження контактної форми
async function saveContactForm(formData) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([formData]);
    
    if (error) {
      console.error('Помилка при збереженні контактної форми:', error);
      // Якщо таблиця не існує, спробуємо ініціалізувати
      if (error.code === '42P01') {
        console.log('Таблиця не існує, спроба ініціалізації...');
        const initResult = await initializeTables();
        console.log('Результат ініціалізації:', initResult);
      }
    }
    
    return { success: !error, data, error };
  } catch (err) {
    console.error('Виняток при збереженні контактної форми:', err);
    return { success: false, error: err };
  }
}

// Функція для підписки на оновлення
async function subscribeToUpdates(email) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{ email, created_at: new Date().toISOString() }]);
    
    if (error) {
      console.error('Помилка при підписці на оновлення:', error);
      // Якщо таблиця не існує, спробуємо ініціалізувати
      if (error.code === '42P01') {
        console.log('Таблиця не існує, спроба ініціалізації...');
        const initResult = await initializeTables();
        console.log('Результат ініціалізації:', initResult);
      }
    }
    
    return { success: !error, data, error };
  } catch (err) {
    console.error('Виняток при підписці на оновлення:', err);
    return { success: false, error: err };
  }
}

// Функція для отримання всіх лідів
async function getAllLeads() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Помилка при отриманні лідів:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Виняток при отриманні лідів:', error);
    return { success: false, error };
  }
}

// Експортуємо функції для використання в основному скрипті
window.xBankAPI = {
  saveContactForm,
  saveLead,
  subscribeToUpdates,
  initializeTables,
  createContactsTable,
  createSubscriptionsTable,
  checkLeadsTable,
  getAllLeads
};

// Експортуємо supabase клієнт та функції для використання в інших модулях
export { 
  supabase, 
  initializeTables, 
  initializeDatabase, 
  saveLead, 
  getAllLeads, 
  checkLeadsTable 
};
