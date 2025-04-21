import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../lib/supabase';

type ResponseData = {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Перевіряємо, що запит POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Метод не дозволений. Використовуйте POST.'
    });
  }

  try {
    const userData = req.body;

    // Базова валідація
    if (!userData || !userData.email || !userData.role) {
      return res.status(400).json({
        success: false,
        message: 'Відсутні обов\'язкові поля: email, role'
      });
    }

    // Зберігаємо в Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name || null,
        role: userData.role,
        phone: userData.phone || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id');

    if (error) {
      console.error('Помилка при збереженні користувача:', error);
      return res.status(500).json({
        success: false,
        message: 'Помилка при збереженні користувача',
        error
      });
    }

    // Успішна відповідь
    return res.status(200).json({
      success: true,
      message: 'Дані користувача успішно збережені',
      data
    });
  } catch (err) {
    console.error('Неочікувана помилка:', err);
    return res.status(500).json({
      success: false,
      message: 'Сталася неочікувана помилка',
      error: err
    });
  }
} 