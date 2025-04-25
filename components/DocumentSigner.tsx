import React, { useRef, useState, useEffect } from 'react';

interface DocumentSignerProps {
  documentTitle: string;
  documentContent: React.ReactNode;
  onSignComplete: (signatureData: string) => void;
}

const DocumentSigner: React.FC<DocumentSignerProps> = ({
  documentTitle,
  documentContent,
  onSignComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDocumentAccepted, setIsDocumentAccepted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Ініціалізація canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        setCtx(context);
      }
    }

    // Визначення, чи пристрій мобільний
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Обробка початку малювання
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDocumentAccepted) return;
    
    setIsDrawing(true);
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Подія від дотику
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        clientX = touch.clientX - rect.left;
        clientY = touch.clientY - rect.top;
      } else {
        return;
      }
    } else {
      // Подія від миші
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        clientX = e.clientX - rect.left;
        clientY = e.clientY - rect.top;
      } else {
        return;
      }
    }
    
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(clientX, clientY);
    }
  };

  // Обробка малювання
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;
    
    e.preventDefault(); // Запобігти скролінгу на мобільних пристроях
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Подія від дотику
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        clientX = touch.clientX - rect.left;
        clientY = touch.clientY - rect.top;
      } else {
        return;
      }
    } else {
      // Подія від миші
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        clientX = e.clientX - rect.left;
        clientY = e.clientY - rect.top;
      } else {
        return;
      }
    }
    
    ctx.lineTo(clientX, clientY);
    ctx.stroke();
    setHasSignature(true);
  };

  // Обробка завершення малювання
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Очистити підпис
  const clearSignature = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasSignature(false);
    }
  };

  // Збереження підпису
  const saveSignature = () => {
    if (canvasRef.current && hasSignature) {
      const signatureData = canvasRef.current.toDataURL('image/png');
      onSignComplete(signatureData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{documentTitle}</h2>
      </div>
      
      {/* Контент документу */}
      <div className="p-6 max-h-96 overflow-y-auto bg-gray-50 border-b">
        {documentContent}
      </div>
      
      {/* Прийняття умов */}
      <div className="p-4 border-b">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isDocumentAccepted}
            onChange={(e) => setIsDocumentAccepted(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            I have read and accept the terms and conditions of this document
          </span>
        </label>
      </div>
      
      {/* Область підпису */}
      <div className={`p-6 ${!isDocumentAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
        <p className="text-sm text-gray-600 mb-2">
          {isMobile ? 'Sign with your finger below:' : 'Sign with your mouse below:'}
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-md p-2">
          <canvas
            ref={canvasRef}
            width={isMobile ? 300 : 500}
            height={150}
            className="w-full bg-white touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={clearSignature}
            disabled={!hasSignature || !isDocumentAccepted}
            className={`px-4 py-2 text-sm rounded-md ${
              !hasSignature || !isDocumentAccepted
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            Clear
          </button>
          
          <button
            type="button"
            onClick={saveSignature}
            disabled={!hasSignature || !isDocumentAccepted}
            className={`px-4 py-2 text-sm rounded-md ${
              !hasSignature || !isDocumentAccepted
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
          >
            Complete Signing
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentSigner; 