import React, { useCallback } from 'react';
import { UploadCloud, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isLoading, error }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isLoading) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        validateAndPass(files[0]);
      }
    },
    [onFileSelect, isLoading]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndPass(files[0]);
    }
  };

  const validateAndPass = (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel" // xls
    ];
    
    // Basic MIME check
    const isExcel = validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      onFileSelect(file);
    } else {
      alert("Por favor, envie apenas arquivos Excel (.xlsx ou .xls)");
    }
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed rounded-xl transition-all duration-300 group
          ${isLoading ? 'bg-slate-50 border-slate-200 cursor-wait opacity-75' : 'bg-slate-50/50 border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer'}
          ${error ? 'border-red-300 bg-red-50/50' : ''}
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait z-10"
          onChange={handleFileInput}
          accept=".xlsx, .xls"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
          {isLoading ? (
             <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
             </div>
          ) : (
            <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className={`w-8 h-8 ${error ? 'text-red-500' : 'text-blue-600'}`} />
            </div>
          )}
          
          <p className="mb-2 text-lg text-slate-700 font-semibold">
            {isLoading ? 'Processando...' : 'Clique ou arraste sua planilha'}
          </p>
          <p className="text-sm text-slate-500">
            Suporta arquivos .XLSX ou .XLS
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">Falha no processamento</h3>
            <p className="text-sm text-red-700 mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};