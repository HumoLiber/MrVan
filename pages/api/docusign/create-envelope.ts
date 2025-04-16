import { NextApiRequest, NextApiResponse } from 'next';
import { createSigningEnvelope } from '../../../lib/docusign';
import fs from 'fs';
import util from 'util';
import path from 'path';

const readFileAsync = util.promisify(fs.readFile);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не дозволений' });
  }

  try {
    const { documentId, signerEmail, signerName, documentPath } = req.body;

    // Перевірка обов'язкових параметрів
    if (!documentId || !signerEmail || !signerName || !documentPath) {
      return res.status(400).json({ message: 'Відсутні обов'язкові параметри' });
    }

    // Читання документа
    let documentBase64;
    try {
      // Якщо документPath є повним шляхом або URL - обробляємо його відповідно
      // Для прикладу, читаємо з файлової системи
      const filePath = path.resolve(process.cwd(), documentPath);
      const fileBuffer = await readFileAsync(filePath);
      documentBase64 = fileBuffer.toString('base64');
    } catch (error) {
      console.error('Помилка читання документа:', error);
      return res.status(500).json({ message: 'Помилка читання документа', error });
    }

    // Назва документа
    const documentName = path.basename(documentPath);

    // Створення конверта
    const envelope = await createSigningEnvelope(
      documentBase64, 
      documentName, 
      documentId,
      signerEmail, 
      signerName
    );

    // Повертаємо ідентифікатор конверта
    return res.status(200).json({ 
      success: true, 
      envelopeId: envelope.envelopeId 
    });

  } catch (error) {
    console.error('Помилка створення конверта:', error);
    return res.status(500).json({ 
      message: 'Помилка створення конверта', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
} 