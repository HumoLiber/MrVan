import { NextApiRequest, NextApiResponse } from 'next';
import { createSigningEnvelope, createEmbeddedSigningUrl } from '../../lib/docusign';
import fs from 'fs';
import util from 'util';
import path from 'path';

const readFileAsync = util.promisify(fs.readFile);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check action parameter to determine which operation to perform
  const { action } = req.body;

  try {
    // Handle different actions
    switch (action) {
      case 'createEnvelope':
        return handleCreateEnvelope(req, res);
      case 'embeddedSigning':
        return handleEmbeddedSigning(req, res);
      default:
        return res.status(400).json({ message: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('DocuSign API error:', error);
    return res.status(500).json({ 
      message: 'DocuSign API error', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}

// Handler for envelope creation
async function handleCreateEnvelope(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { documentId, signerEmail, signerName, documentPath } = req.body;

    // Check required parameters
    if (!documentId || !signerEmail || !signerName || !documentPath) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Read document
    let documentBase64;
    try {
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

// Handler for embedded signing URL generation
async function handleEmbeddedSigning(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { envelopeId, returnUrl, signerEmail, signerName, clientUserId } = req.body;

    // Check required parameters
    if (!envelopeId || !returnUrl || !signerEmail || !signerName || !clientUserId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Get signing URL
    const signingUrl = await createEmbeddedSigningUrl(
      envelopeId,
      signerEmail,
      signerName,
      clientUserId,
      returnUrl
    );

    return res.status(200).json({ 
      success: true, 
      signingUrl 
    });
  } catch (error) {
    console.error('Error generating signing URL:', error);
    return res.status(500).json({ 
      message: 'Error generating signing URL', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
} 