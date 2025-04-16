import React, { useState, useRef } from 'react';

interface DocumentUploaderProps {
  onUpload: (files: Array<{name: string, url: string}>) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  maxFiles = 5,
  acceptedFileTypes = '.pdf,.jpg,.jpeg,.png'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Обробка перетягування файлів
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Обробка файлів, перетягнутих у зону
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Обробка вибору файлів через діалог
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Відкриття діалогу вибору файлів
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Загальна обробка файлів (і для перетягування, і для діалогу)
  const handleFiles = (files: FileList) => {
    // Беремо лише дозволену кількість файлів
    const newFiles = Array.from(files).slice(0, maxFiles - selectedFiles.length);
    
    // Перевіряємо допустимі типи файлів
    const validFiles = newFiles.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedFileTypes.includes(fileExtension);
    });
    
    // Оновлюємо стан вибраних файлів
    const updatedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(updatedFiles);
    
    // Конвертуємо в url для передачі назад через callbacks
    const uploadedFiles = validFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    
    // Викликаємо callback з новими файлами
    onUpload(uploadedFiles);
  };

  // Видалення файлу
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    URL.revokeObjectURL(URL.createObjectURL(newFiles[index])); // Звільняємо URL
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  return (
    <div className="w-full">
      {/* Дропзона */}
      <div
        className={`border-2 ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-dashed border-gray-300'
        } rounded-lg p-6 text-center cursor-pointer transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedFileTypes}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="mb-2 text-sm font-semibold text-gray-700">
            {dragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}
          </p>
          <p className="text-xs text-gray-500">
            Accepted file types: PDF, JPG, JPEG, PNG (Max. {maxFiles} files)
          </p>
        </div>
      </div>

      {/* Список вибраних файлів */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-3 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className="text-gray-700">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader; 