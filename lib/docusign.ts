import { ApiClient, EnvelopesApi, EnvelopeDefinition, Recipients, Signer, SignHere, Tabs, RecipientViewRequest } from 'docusign-esign';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Конфігурація DocuSign
const config = {
  integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || '',
  userId: process.env.DOCUSIGN_USER_ID || '',
  authServer: process.env.DOCUSIGN_AUTH_SERVER || 'https://account-d.docusign.com',
  oAuthBasePath: process.env.DOCUSIGN_OAUTH_BASEPATH || 'account-d.docusign.com',
  basePath: process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi',
  redirectUri: process.env.DOCUSIGN_REDIRECT_URI || 'http://localhost:3001/api/docusign/callback',
  privateKey: process.env.DOCUSIGN_PRIVATE_KEY || '',
};

// Ініціалізація клієнта
export const getDocuSignClient = async () => {
  const apiClient = new ApiClient({
    basePath: config.basePath,
    oAuthBasePath: config.oAuthBasePath
  });

  // JWT авторизація
  const response = await apiClient.requestJWTUserToken(
    config.integrationKey,
    config.userId,
    ['signature', 'impersonation'],
    config.privateKey,
    3600
  );

  const { accessToken } = response.body;
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
  
  return apiClient;
};

// Асинхронний читач файлів
export const readFileAsync = promisify(fs.readFile);

// Функція для підготовки документа
const prepareDocument = async (documentPath: string, documentName: string, documentId: string) => {
  const docBuffer = await readFileAsync(documentPath);
  const docBase64 = docBuffer.toString('base64');

  return {
    documentBase64: docBase64,
    name: documentName,
    fileExtension: path.extname(documentPath).substring(1),
    documentId
  };
};

// Функція для створення підписуваного конверта
export async function createSigningEnvelope(
  documentBase64: string, 
  documentName: string, 
  documentId: string,
  signerEmail: string, 
  signerName: string,
  fileExtension: string = 'pdf'
) {
  try {
    // Ініціалізація клієнта DocuSign
    const {
      DOCUSIGN_USER_ID,
      DOCUSIGN_ACCOUNT_ID,
      DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_BASE_PATH,
      DOCUSIGN_PRIVATE_KEY,
    } = process.env;

    if (!DOCUSIGN_USER_ID || !DOCUSIGN_ACCOUNT_ID || !DOCUSIGN_INTEGRATION_KEY || 
        !DOCUSIGN_BASE_PATH || !DOCUSIGN_PRIVATE_KEY) {
      throw new Error('Відсутні обов\'язкові змінні середовища DocuSign');
    }

    // Налаштування аутентифікації JWT
    const jwtLifeSec = 3600; // 1 година
    const dsApi = new ApiClient();
    dsApi.setBasePath(DOCUSIGN_BASE_PATH);

    try {
      // Кодування ключа з формату base64 (якщо він у такому форматі)
      const privateKey = DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, '\n');
      const results = await dsApi.requestJWTUserToken(
        DOCUSIGN_INTEGRATION_KEY,
        DOCUSIGN_USER_ID,
        ['signature'],
        Buffer.from(privateKey, 'utf8'),
        jwtLifeSec
      );

      const accessToken = results.body.access_token;
      dsApi.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    } catch (error) {
      console.error('Помилка аутентифікації JWT:', error);
      throw new Error('Помилка аутентифікації DocuSign JWT');
    }

    // Створення конверта для підписання
    const envelopeDefinition = new EnvelopeDefinition();
    envelopeDefinition.emailSubject = 'Будь ласка, підпишіть цей документ';
    envelopeDefinition.emailBlurb = 'Будь ласка, підпишіть цей документ за допомогою DocuSign';

    // Додавання документа
    const document = {
      documentBase64,
      name: documentName,
      fileExtension,
      documentId
    };
    envelopeDefinition.documents = [document];

    // Додавання одержувача для підпису
    const signer = new Signer();
    signer.email = signerEmail;
    signer.name = signerName;
    signer.recipientId = '1';
    signer.clientUserId = '1000'; // Для вбудованого підписання

    // Створення мітки для підпису на документі
    const signHere = new SignHere();
    signHere.anchorString = '/sn1/';
    signHere.anchorUnits = 'pixels';
    signHere.anchorXOffset = '10';
    signHere.anchorYOffset = '20';

    // Якщо в документі немає якорів, можна використовувати координати
    if (!documentBase64.includes('/sn1/')) {
      signHere.documentId = documentId;
      signHere.pageNumber = '1';
      signHere.xPosition = '300';
      signHere.yPosition = '500';
      delete signHere.anchorString;
      delete signHere.anchorUnits;
      delete signHere.anchorXOffset;
      delete signHere.anchorYOffset;
    }

    // Додавання мітки до документа
    const tabs = new Tabs();
    tabs.signHereTabs = [signHere];
    signer.tabs = tabs;

    // Додавання підписанта до конверта
    const recipients = new Recipients();
    recipients.signers = [signer];
    envelopeDefinition.recipients = recipients;

    // Статус конверта
    envelopeDefinition.status = 'sent';

    // Відправка конверта через API
    const envelopesApi = new EnvelopesApi(dsApi);
    const results = await envelopesApi.createEnvelope(DOCUSIGN_ACCOUNT_ID, {
      envelopeDefinition,
    });

    return results.envelopeId;
  } catch (error) {
    console.error('Помилка створення конверта для підписання:', error);
    throw error;
  }
}

// Функція для отримання URL для вбудованого підписання
export async function getEmbeddedSigningUrl(
  envelopeId: string,
  signerEmail: string,
  signerName: string,
  clientId: string = '1000',
  returnUrl: string
) {
  try {
    // Ініціалізація клієнта DocuSign
    const {
      DOCUSIGN_USER_ID,
      DOCUSIGN_ACCOUNT_ID,
      DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_BASE_PATH,
      DOCUSIGN_PRIVATE_KEY,
    } = process.env;

    if (!DOCUSIGN_USER_ID || !DOCUSIGN_ACCOUNT_ID || !DOCUSIGN_INTEGRATION_KEY || 
        !DOCUSIGN_BASE_PATH || !DOCUSIGN_PRIVATE_KEY) {
      throw new Error('Відсутні обов\'язкові змінні середовища DocuSign');
    }

    // Налаштування аутентифікації JWT
    const jwtLifeSec = 3600; // 1 година
    const dsApi = new ApiClient();
    dsApi.setBasePath(DOCUSIGN_BASE_PATH);

    try {
      // Кодування ключа з формату base64 (якщо він у такому форматі)
      const privateKey = DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, '\n');
      const results = await dsApi.requestJWTUserToken(
        DOCUSIGN_INTEGRATION_KEY,
        DOCUSIGN_USER_ID,
        ['signature'],
        Buffer.from(privateKey, 'utf8'),
        jwtLifeSec
      );

      const accessToken = results.body.access_token;
      dsApi.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    } catch (error) {
      console.error('Помилка аутентифікації JWT:', error);
      throw new Error('Помилка аутентифікації DocuSign JWT');
    }

    // Створення запиту на отримання URL для вбудованого підписання
    const recipientViewRequest = new RecipientViewRequest();
    recipientViewRequest.authenticationMethod = 'none';
    recipientViewRequest.clientUserId = clientId;
    recipientViewRequest.recipientId = '1';
    recipientViewRequest.returnUrl = returnUrl;
    recipientViewRequest.userName = signerName;
    recipientViewRequest.email = signerEmail;

    // Отримання URL для вбудованого підписання
    const envelopesApi = new EnvelopesApi(dsApi);
    const results = await envelopesApi.createRecipientView(
      DOCUSIGN_ACCOUNT_ID,
      envelopeId,
      { recipientViewRequest }
    );

    return results.url;
  } catch (error) {
    console.error('Помилка отримання URL для вбудованого підписання:', error);
    throw error;
  }
}

// Перевірка статусу конверта
export const checkEnvelopeStatus = async (envelopeId: string) => {
  try {
    const apiClient = await getDocuSignClient();
    const envelopesApi = new EnvelopesApi(apiClient);
    
    const envelope = await envelopesApi.getEnvelope(config.userId, envelopeId);
    return envelope.status;
  } catch (error) {
    console.error('Помилка перевірки статусу конверта:', error);
    throw error;
  }
}; 