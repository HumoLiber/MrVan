import supabase from './supabase';

export interface UserData {
  name?: string;
  email: string;
  role: 'investor' | 'company' | 'private_owner' | 'agency' | 'agent';
  phone?: string;
}

export interface VehicleData {
  owner_id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  delegation_model: 'service_only' | 'partial_help' | 'full';
}

interface DocumentData {
  user_id: string;
  doc_type: string;
  file_url: string;
}

/**
 * Основна функція збереження даних користувача
 */
export async function submitUserData(userData: UserData) {
  try {
    // Зберігаємо основні дані користувача
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name || null,
        role: userData.role,
        phone: userData.phone || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id')
      .single();

    if (userError) {
      console.error('Помилка при збереженні даних користувача:', userError);
      return { success: false, error: userError, message: 'Не вдалося зберегти дані користувача' };
    }

    // Логуємо успішну реєстрацію
    await logUserAction(user.id, 'registration_completed', userData);

    return { 
      success: true, 
      data: user, 
      message: 'Дані користувача успішно збережені' 
    };
  } catch (error) {
    console.error('Загальна помилка при збереженні даних:', error);
    return { 
      success: false, 
      error, 
      message: 'Сталася непередбачена помилка при збереженні даних' 
    };
  }
}

/**
 * Функція для створення транспортного засобу
 */
export async function createVehicle(vehicleData: VehicleData) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{
        owner_id: vehicleData.owner_id,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        plate: vehicleData.plate,
        delegation_model: vehicleData.delegation_model,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Помилка при створенні авто:', error);
      return { success: false, error, message: 'Не вдалося створити транспортний засіб' };
    }

    // Логуємо створення транспортного засобу
    await logUserAction(vehicleData.owner_id, 'vehicle_created', {
      vehicle_id: data.id,
      make: vehicleData.make,
      model: vehicleData.model
    });

    return { success: true, data, message: 'Транспортний засіб успішно створено' };
  } catch (error) {
    console.error('Загальна помилка при створенні авто:', error);
    return { success: false, error, message: 'Сталася непередбачена помилка при створенні авто' };
  }
}

/**
 * Функція для створення/підписання угоди
 */
export async function createAgreement(userId: string, agreementType: string) {
  try {
    const { data, error } = await supabase
      .from('agreements')
      .insert([{
        user_id: userId,
        agreement_type: agreementType,
        signature_status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Помилка при створенні угоди:', error);
      return { success: false, error, message: 'Не вдалося створити угоду' };
    }

    // Логуємо створення угоди
    await logUserAction(userId, 'agreement_created', {
      agreement_id: data.id,
      agreement_type: agreementType
    });

    return { success: true, data, message: 'Угоду успішно створено' };
  } catch (error) {
    console.error('Загальна помилка при створенні угоди:', error);
    return { success: false, error, message: 'Сталася непередбачена помилка при створенні угоди' };
  }
}

/**
 * Функція для завантаження документів
 */
export async function uploadDocument(userId: string, docType: string, file: File) {
  try {
    // В реальному проекті тут було б фактичне завантаження файлу
    // Для мокового режиму просто симулюємо завантаження
    const filePath = `documents/${userId}/${docType}/${file.name}`;
    
    // Імітуємо успішне завантаження
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Зберігаємо запис про документ
    const { data, error } = await supabase
      .from('user_documents')
      .insert([{
        user_id: userId,
        doc_type: docType,
        file_url: filePath,
        status: 'uploaded',
        uploaded_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Помилка при збереженні даних про документ:', error);
      return { success: false, error };
    }

    // Логуємо завантаження документа
    await logUserAction(userId, 'document_uploaded', { docType, fileName: file.name });

    return { success: true, data: { filePath, fileName: file.name } };
  } catch (error) {
    console.error('Помилка при завантаженні документа:', error);
    return { success: false, error };
  }
}

/**
 * Функція для логування дій користувача
 * Зберігає логи в локальному storage, оскільки таблиці логування немає в схемі
 */
export async function logUserAction(userId: string, action: string, details?: any) {
  try {
    // Оскільки таблиці логування немає в схемі, зберігаємо в localStorage
    const log = {
      user_id: userId,
      action,
      details: details ? JSON.stringify(details) : null,
      timestamp: new Date().toISOString()
    };
    
    // Отримуємо поточні логи
    const logsJson = localStorage.getItem('user_logs') || '[]';
    const logs = JSON.parse(logsJson);
    
    // Додаємо новий лог
    logs.push(log);
    
    // Зберігаємо оновлені логи
    localStorage.setItem('user_logs', JSON.stringify(logs));
    
    console.log('Дію користувача записано в локальне сховище:', log);
    
    return { success: true, data: log };
  } catch (error) {
    console.error('Загальна помилка при логуванні:', error);
    return { success: false, error };
  }
} 