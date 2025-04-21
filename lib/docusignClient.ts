/**
 * Client-side functions for interacting with DocuSign API
 */

/**
 * Create a signature envelope and return the envelope ID
 */
export async function createEnvelope(documentId: string, signerEmail: string, signerName: string, documentPath: string) {
  try {
    const response = await fetch('/api/docusign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createEnvelope',
        documentId,
        signerEmail,
        signerName,
        documentPath
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error creating envelope');
    }
    
    return data;
  } catch (error) {
    console.error('Error in createEnvelope:', error);
    throw error;
  }
}

/**
 * Get a URL for embedded signing
 */
export async function getEmbeddedSigningUrl(
  envelopeId: string, 
  signerEmail: string, 
  signerName: string, 
  clientUserId: string,
  returnUrl: string
) {
  try {
    const response = await fetch('/api/docusign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'embeddedSigning',
        envelopeId,
        signerEmail,
        signerName,
        clientUserId,
        returnUrl
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error getting signing URL');
    }
    
    return data.signingUrl;
  } catch (error) {
    console.error('Error in getEmbeddedSigningUrl:', error);
    throw error;
  }
} 