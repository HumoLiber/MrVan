import supabase from './supabase';

// Функція для надсилання OTP коду
export async function sendOtpCode(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Тут буде реальний код для SMS-сервісу
    // Наразі просто імітуємо успішне надсилання
    
    // Генеруємо випадковий 6-значний код
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Зберігаємо код в базі даних
    const { error } = await supabase
      .from('otp_codes')
      .insert({
        phone_number: phoneNumber,
        code: otpCode,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 хвилин
        verified: false
      });
    
    if (error) throw new Error(error.message);
    
    // В реальному додатку тут буде виклик SMS API
    console.log(`Код підтвердження для ${phoneNumber}: ${otpCode}`);
    
    return { success: true };
  } catch (error) {
    console.error('Помилка при надсиланні OTP:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Невідома помилка'
    };
  }
}

// Функція для перевірки OTP коду
export async function verifyOtpCode(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Отримуємо код із бази даних
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .is('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      return { 
        success: false, 
        error: 'Недійсний або прострочений код' 
      };
    }
    
    // Позначаємо код як використаний
    await supabase
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', data.id);
    
    // Оновлюємо статус верифікації користувача
    await supabase
      .from('users')
      .update({ is_phone_verified: true })
      .eq('phone', phoneNumber);
    
    return { success: true };
  } catch (error) {
    console.error('Помилка при перевірці OTP:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Невідома помилка'
    };
  }
} 