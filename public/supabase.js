// Інтеграція з Supabase
// Додаємо скрипт для імпорту Supabase
const supabaseUrl = 'https://ektalbtnirqlttfkxdhe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGFsYnRuaXJxbHR0Zmt4ZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Nzg0MDMsImV4cCI6MjA1ODE1NDQwM30.rAnmyyn7W9VHmb8f0LOEQ6LesoqpaFZjT034IyHkBes';

// Створюємо клієнта Supabase. Замість supabaseExports використовуємо глобальний об'єкт supabase
let supabase;

// Функція для ініціалізації Supabase
function initSupabase() {
  // Перевіряємо, чи доступний глобальний об'єкт supabaseJs
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    console.log('Supabase клієнт ініціалізовано через глобальний об\'єкт supabase');
    return true;
  } else if (window.supabaseJs) {
    supabase = window.supabaseJs.createClient(supabaseUrl, supabaseKey);
    console.log('Supabase клієнт ініціалізовано через глобальний об\'єкт supabaseJs');
    return true;
  } else {
    console.error('Supabase не доступний. Перевірте, чи підключений скрипт Supabase CDN');
    return false;
  }
}

// Спроба ініціалізувати Supabase
initSupabase();

// Функція для ініціалізації бази даних (перевірка підключення)
async function initializeDatabase() {
  console.log('Перевірка підключення до бази даних...');
  
  if (!supabase) {
    if (!initSupabase()) {
      return { success: false, error: 'Supabase не ініціалізовано' };
    }
  }
  
  try {
    // Спроба виконання простого запиту до існуючої таблиці
    const { data, error } = await supabase
      .from('primaveravan_participants')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Помилка при перевірці підключення до бази даних:', error);
      return { success: false, error };
    }
    
    console.log('Підключення до бази даних успішне');
    return { success: true };
  } catch (error) {
    console.error('Помилка при ініціалізації бази даних:', error);
    return { success: false, error };
  }
}

// Функція для збереження контактів з фестивалю PrimaveraVan
async function savePrimaveraVanLead(formData) {
  if (!supabase) {
    if (!initSupabase()) {
      return { success: false, error: 'Supabase не ініціалізовано' };
    }
  }
  
  try {
    console.log('Відправляємо дані до таблиці primaveravan_participants:', formData);
    
    // Адаптуємо дані для нової схеми таблиці - правильне відображення полів
    const dataToInsert = {
      nombre: formData.name || formData.nombre,           // Використовуємо name або nombre, якщо є
      telefono: formData.phone || formData.telefono,      // Використовуємо phone або telefono
      email: formData.email,                              // email однаковий в обох випадках
      codigo_postal: formData.postal_code || formData.codigo_postal,
      owns_camper_van: true,                              // За замовчуванням вважаємо, що у людини є кемпер
      modelo_camper: formData.camper_model || formData.modelo_camper,
      ano: formData.year || formData.ano,                 // Рік виробництва
      plazas: formData.places || formData.plazas,         // Кількість місць
      instagram: formData.instagram,                      // Instagram однаковий
      privacy_accepted: formData.privacy_accepted === true || formData.privacy_accepted === 'true',
      source: formData.source || 'primaveravan',          // Джерело за замовчуванням
      language: formData.language || 'es',                // Мова за замовчуванням
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Перевіряємо наявність обов'язкових полів
    if (!dataToInsert.nombre) {
      console.error('Відсутнє обов\'язкове поле "nombre"');
      return { 
        success: false, 
        error: { 
          message: 'Відсутнє обов\'язкове поле "Ім\'я"',
          code: 'nome_required'
        }
      };
    }
    
    if (!dataToInsert.telefono) {
      console.error('Відсутнє обов\'язкове поле "telefono"');
      return { 
        success: false, 
        error: { 
          message: 'Відсутнє обов\'язкове поле "Телефон"',
          code: 'phone_required'
        }
      };
    }
    
    if (!dataToInsert.email) {
      console.error('Відсутнє обов\'язкове поле "email"');
      return { 
        success: false, 
        error: { 
          message: 'Відсутнє обов\'язкове поле "Email"',
          code: 'email_required'
        }
      };
    }
    
    console.log('Дані готові для відправки:', dataToInsert);
    
    // Додаткові параметри для запиту
    const options = {
      headers: {
        'Prefer': 'return=representation'
      }
    };
    
    // Додаємо дані до таблиці primaveravan_participants
    const { data, error, status } = await supabase
      .from('primaveravan_participants')
      .insert([dataToInsert], options);
    
    // Додаткова діагностична інформація
    console.log(`Отримано відповідь від Supabase: статус ${status}`);
    
    if (error) {
      console.error('Помилка при збереженні даних у таблицю primaveravan_participants:', error);
      return { success: false, error };
    }
    
    console.log('Дані успішно збережено у таблицю primaveravan_participants', data);
    return { success: true, data };
  } catch (error) {
    console.error('Помилка при збереженні даних:', error);
    return { success: false, error };
  }
}

// Експортуємо функції для використання в основному скрипті
window.PrimaveravanAPI = {
  initializeDatabase,
  savePrimaveraVanLead
};

// Для збереження зворотньої сумісності, тимчасово зберігаємо також як xBankAPI
// TODO: Видалити цей аліас у майбутньому після повного оновлення всіх посилань
window.xBankAPI = window.PrimaveravanAPI;
