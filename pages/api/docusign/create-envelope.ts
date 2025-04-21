import { NextApiRequest, NextApiResponse } from 'next';
import { createSigningEnvelope } from '../../../lib/docusign';
import fs from 'fs';
import util from 'util';
import path from 'path';

const readFileAsync = util.promisify(fs.readFile);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { documentId, signerEmail, signerName, documentPath } = req.body;

    // Check required parameters
    if (!documentId || !signerEmail || !signerName || !documentPath) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Read document
    let documentBase64;
    try {
      // If documentPath is a full path or URL, handle it accordingly
      // For example, read from file system
      const filePath = path.resolve(process.cwd(), documentPath);
      const fileBuffer = await readFileAsync(filePath);
      documentBase64 = fileBuffer.toString('base64');
    } catch (error) {
      console.error('Error reading document:', error);
      return res.status(500).json({ message: 'Error reading document', error });
    }

    // Document name
    const documentName = path.basename(documentPath);

    // Create envelope
    const envelope = await createSigningEnvelope(
      documentBase64, 
      documentName, 
      documentId,
      signerEmail, 
      signerName
    );

    // Return envelope ID
    return res.status(200).json({ 
      success: true, 
      envelopeId: envelope.envelopeId 
    });

  } catch (error) {
    console.error('Error creating envelope:', error);
    return res.status(500).json({ 
      message: 'Error creating envelope', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
} 