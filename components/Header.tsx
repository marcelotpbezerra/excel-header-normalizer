import React from 'react';
import { FileSpreadsheet, ArrowLeft, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <a
              href="/tools/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl border border-slate-300 transition-all group"
              title="Voltar à Central de Ferramentas"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Hub de Ferramentas</span>
              <span className="sm:hidden">Hub</span>
            </a>

            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl shadow-sm">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  Excel & CSV Normalizer
                </h1>
                <span className="text-xs font-medium text-indigo-600">
                  Padronizador de Dados & ERP
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              100% Client-Side
            </span>

            <a
              href="https://github.com/marcelotpbezerra/excel-header-normalizer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors"
              title="Ver no GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};