import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-sm">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Normalizador
              </h1>
              <span className="text-xs font-medium text-blue-600">
                Ferramenta de Dados
              </span>
            </div>
          </div>
          <div className="hidden md:block">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                v1.0.0
             </span>
          </div>
        </div>
      </div>
    </nav>
  );
};