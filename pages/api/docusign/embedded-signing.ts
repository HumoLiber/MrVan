import { NextApiRequest, NextApiResponse } from 'next';
import { getEmbeddedSigningUrl } from '../../../lib/docusign';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не дозволений' });
  }

  try {
    const { envelopeId, returnUrl, signerEmail, signerName, signerClientId } = req.body;

    // Перевірка обов'язкових параметрів
    if (!envelopeId || !returnUrl || !signerEmail || !signerName) {
      return res.status(400).json({ message: 'Відсутні обов\'язкові параметри' });
    }

    // Отримання URL для вбудованого підписання
    const clientId = signerClientId || '1000'; // Використання за замовчуванням, якщо не передано
    
    const viewUrl = await getEmbeddedSigningUrl(
      envelopeId,
      signerEmail,
      signerName,
      clientId,
      returnUrl
    );

    // Повертаємо URL для вбудованого підписання
    return res.status(200).json({ 
      success: true, 
      signingUrl: viewUrl 
    });

  } catch (error) {
    console.error('Помилка отримання URL для підписання:', error);
    return res.status(500).json({ 
      message: 'Помилка отримання URL для підписання', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
} // Виправлено синтаксичну помилку TypeScript
