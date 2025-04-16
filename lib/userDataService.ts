import supabase from './supabase';

export interface UserData {
  name?: string;
  email: string;
  role: 'investor' | 'company' | 'private_owner' | 'agency' | 'agent';
  phone?: string;
}

interface DocumentData {
  userId: string;
  docType: 'id' | 'proof_funds' | 'vehicle_ownership' | 'insurance' | 'other';
  filePath: string;
  fileName: string;
  uploadedAt: Date;
}

interface LogData {
  userId: string;
  action: string;
  details?: any;
  timestamp: Date;
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

    // Зберігаємо специфічні дані в залежності від ролі
    if (userData.role === 'investor') {
      await saveInvestorData(user.id, userData);
    } else if (userData.role === 'company' || userData.role === 'private_owner') {
      await saveOwnerData(user.id, userData);
    } else if (userData.role === 'agency' || userData.role === 'agent') {
      await saveCollaboratorData(user.id, userData);
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
 * Збереження даних інвестора
 */
async function saveInvestorData(userId: string, userData: any) {
  return await supabase
    .from('investors')
    .insert([{
      user_id: userId,
      investment_amount: userData.investmentAmount || null,
      regions_of_interest: userData.regionsOfInterest || null
    }]);
}

/**
 * Збереження даних власника (компанії або приватної особи)
 */
async function saveOwnerData(userId: string, userData: any) {
  return await supabase
    .from('owners')
    .insert([{
      user_id: userId,
      delegation_type: userData.delegationType || 'full_delegation',
      vehicle_count: userData.vehicleCount || 1
    }]);
}

/**
 * Збереження даних співпрацівника (агентство або агент)
 */
async function saveCollaboratorData(userId: string, userData: any) {
  return await supabase
    .from('collaborators')
    .insert([{
      user_id: userId,
      collaboration_scope: userData.collaborationScope || null,
      experience_years: userData.experienceYears || null
    }]);
}

/**
 * Функція для мокового завантаження документів
 */
export async function uploadDocument(userId: string, docType: DocumentData['docType'], file: File) {
  try {
    // В реальному проекті тут було б фактичне завантаження файлу
    // Для мокового режиму просто симулюємо завантаження
    const filePath = `documents/${userId}/${docType}/${file.name}`;
    
    // Імітуємо успішне завантаження
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Зберігаємо запис про документ
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        user_id: userId,
        doc_type: docType,
        file_path: filePath,
        file_name: file.name,
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
 */
export async function logUserAction(userId: string, action: string, details?: any) {
  try {
    const { data, error } = await supabase
      .from('user_logs')
      .insert([{
        user_id: userId,
        action,
        details: details ? JSON.stringify(details) : null,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('Помилка при логуванні дії користувача:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Загальна помилка при логуванні:', error);
    return { success: false, error };
  }
} 