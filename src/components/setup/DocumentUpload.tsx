import React, { useState } from 'react';
import './DocumentUpload.css';

export interface Document {
  id: string;
  name: string;
  type: string;
  file: File;
  uploadProgress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface DocumentUploadProps {
  onSubmit: (documents: Document[]) => void;
  onBack: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onSubmit, onBack }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newDocuments: Document[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`Файл ${file.name} занадто великий. Максимальний розмір - 5MB.`);
        continue;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError(`Файл ${file.name} має непідтримуваний формат. Дозволені формати: PDF, JPEG, PNG.`);
        continue;
      }
      
      newDocuments.push({
        id: `doc_${Date.now()}_${i}`,
        name: file.name,
        type: file.type,
        file: file,
        status: 'pending'
      });
    }
    
    setDocuments(prev => [...prev, ...newDocuments]);
    
    // Reset file input
    e.target.value = '';
  };
  
  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };
  
  const handleSubmit = () => {
    if (documents.length === 0) {
      setError('Будь ласка, завантажте хоча б один документ.');
      return;
    }
    
    onSubmit(documents);
  };
  
  return (
    <div className="document-upload">
      <h2>Завантаження документів</h2>
      <p>Завантажте необхідні документи для вашого кемпера</p>
      
      <div className="upload-instructions">
        <h3>Необхідні документи:</h3>
        <ul>
          <li>Свідоцтво про реєстрацію транспортного засобу</li>
          <li>Страховий поліс</li>
          <li>Технічний паспорт</li>
          <li>Інші документи (за наявності)</li>
        </ul>
      </div>
      
      <div className="upload-container">
        <div className="upload-dropzone">
          <input
            type="file"
            id="document-upload"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="file-input"
          />
          <label htmlFor="document-upload" className="dropzone-label">
            <div className="dropzone-icon">📄</div>
            <div className="dropzone-text">
              <strong>Перетягніть файли сюди</strong> або клікніть, щоб вибрати
            </div>
            <div className="dropzone-hint">
              Підтримувані формати: PDF, JPEG, PNG. Максимальний розмір: 5MB.
            </div>
          </label>
        </div>
        
        {error && (
          <div className="upload-error">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}
        
        {documents.length > 0 && (
          <div className="document-list">
            <h3>Завантажені документи:</h3>
            
            {documents.map(doc => (
              <div key={doc.id} className={`document-item document-${doc.status}`}>
                <div className="document-icon">
                  {doc.type.includes('pdf') ? '📄' : '🖼️'}
                </div>
                <div className="document-info">
                  <div className="document-name">{doc.name}</div>
                  <div className="document-meta">
                    {formatFileSize(doc.file.size)} • {formatFileType(doc.type)}
                  </div>
                  
                  {doc.status === 'uploading' && (
                    <div className="document-progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${doc.uploadProgress || 0}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {doc.status === 'error' && (
                    <div className="document-error">{doc.errorMessage}</div>
                  )}
                </div>
                <button 
                  className="document-remove" 
                  onClick={() => removeDocument(doc.id)}
                  title="Видалити"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onBack}>
          Назад
        </button>
        <button 
          type="button" 
          className="button-primary"
          onClick={handleSubmit}
          disabled={documents.length === 0}
        >
          Продовжити
        </button>
      </div>
    </div>
  );
};

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatFileType = (type: string): string => {
  switch (type) {
    case 'application/pdf':
      return 'PDF';
    case 'image/jpeg':
      return 'JPEG';
    case 'image/png':
      return 'PNG';
    default:
      return type.split('/')[1].toUpperCase();
  }
};

export default DocumentUpload;
