import React, { useState } from 'react';
import { uploadDocument } from '../lib/userDataService';

interface DocumentUploaderProps {
  userId: string;
  docType: string;
  label: string;
  description?: string;
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: any) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  userId,
  docType,
  label,
  description,
  onUploadSuccess,
  onUploadError
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Спочатку виберіть файл для завантаження');
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');

    try {
      const result = await uploadDocument(userId, docType, file);
      
      if (result.success) {
        setUploadStatus('success');
        if (onUploadSuccess) onUploadSuccess(result.data);
      } else {
        setUploadStatus('error');
        setErrorMessage('Помилка при завантаженні документа');
        if (onUploadError) onUploadError(result.error);
      }
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Неочікувана помилка при завантаженні');
      if (onUploadError) onUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4">
      <div className="mb-3">
        <h3 className="font-medium text-gray-700">{label}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <div className="flex items-center mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-600
            hover:file:bg-blue-100"
          disabled={isUploading}
        />
      </div>

      {file && (
        <div className="flex items-center justify-between mb-3 bg-gray-50 p-2 rounded">
          <span className="text-sm truncate">{file.name}</span>
          <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          {uploadStatus === 'error' && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
          {uploadStatus === 'success' && (
            <p className="text-sm text-green-600">Документ успішно завантажено!</p>
          )}
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`ml-3 py-2 px-4 rounded-md text-sm font-medium 
            ${!file || isUploading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {isUploading ? 'Завантаження...' : 'Завантажити'}
        </button>
      </div>
    </div>
  );
};

export default DocumentUploader; 