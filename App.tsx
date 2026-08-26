import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { DataPreview } from './components/DataPreview';
import { processExcelFile } from './services/excelService';
import { ProcessedData, ProcessingStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus(ProcessingStatus.PROCESSING);
    setErrorMessage(null);

    try {
      // Artificial delay for better UX perception
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = await processExcelFile(file);
      setProcessedData(data);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido ao processar o arquivo.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const handleReset = () => {
    setProcessedData(null);
    setStatus(ProcessingStatus.IDLE);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow flex flex-col p-6">
        <div className="w-full max-w-7xl mx-auto my-auto">
          
          {status === ProcessingStatus.IDLE && (
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Padronize suas Planilhas
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Transforme títulos de colunas em formatos compatíveis com banco de dados (snake_case).
                <span className="block mt-2 text-sm font-medium text-slate-500">
                  Ideal para importação em SQL, Python e sistemas de gestão.
                </span>
              </p>
            </div>
          )}

          <div className="w-full transition-all duration-500 ease-in-out">
            {status === ProcessingStatus.SUCCESS && processedData ? (
              <DataPreview data={processedData} onReset={handleReset} />
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
                  <FileUploader 
                    onFileSelect={handleFileSelect} 
                    isLoading={status === ProcessingStatus.PROCESSING}
                    error={errorMessage}
                  />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <p className="text-slate-900 font-semibold text-sm">
            Powered by Marcelo Bezerra
          </p>
          <p className="text-slate-400 text-xs">
            Processamento 100% local. Seus dados não saem do seu dispositivo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;