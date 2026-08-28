import React, { useState, useMemo } from 'react';
import { Download, FileJson, Database, Table, Check, Edit2, Sparkles, RefreshCw } from 'lucide-react';
import { ProcessedData, NamingConvention } from '../types';
import { normalizeHeader } from '../utils/stringUtils';
import { generateCsvBlob, generateJsonBlob, generateSqlScriptBlob } from '../services/excelService';

interface DataPreviewProps {
  data: ProcessedData;
  onReset: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, onReset }) => {
  const { originalHeaders, rows, fileName } = data;
  const [convention, setConvention] = useState<NamingConvention>('snake_case');
  const [customHeaders, setCustomHeaders] = useState<string[]>(data.headers);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [tempHeader, setTempHeader] = useState('');

  // Handle format change
  const handleConventionChange = (newConv: NamingConvention) => {
    setConvention(newConv);
    const updated = originalHeaders.map((h) => normalizeHeader(h, newConv));
    setCustomHeaders(updated);
  };

  // Handle inline header edit
  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setTempHeader(customHeaders[idx] || '');
  };

  const saveEdit = (idx: number) => {
    const updated = [...customHeaders];
    updated[idx] = tempHeader.trim() || `col_${idx + 1}`;
    setCustomHeaders(updated);
    setEditingIdx(null);
  };

  // Preview rows
  const previewRows = useMemo(() => rows.slice(0, 10), [rows]);
  const totalRows = rows.length;

  const downloadFile = (blob: Blob, ext: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${convention}_normalized.${ext}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDownloadCsv = () => {
    const blob = generateCsvBlob(customHeaders, rows);
    downloadFile(blob, 'csv');
  };

  const handleDownloadJson = () => {
    const blob = generateJsonBlob(customHeaders, rows);
    downloadFile(blob, 'json');
  };

  const handleDownloadSql = () => {
    const blob = generateSqlScriptBlob(fileName, customHeaders, rows);
    downloadFile(blob, 'sql');
  };

  const conventions: { id: NamingConvention; label: string; example: string }[] = [
    { id: 'snake_case', label: 'snake_case', example: 'preco_unitario' },
    { id: 'camelCase', label: 'camelCase', example: 'precoUnitario' },
    { id: 'PascalCase', label: 'PascalCase', example: 'PrecoUnitario' },
    { id: 'kebab-case', label: 'kebab-case', example: 'preco-unitario' },
    { id: 'UPPER_SNAKE', label: 'UPPER_CASE', example: 'PRECO_UNITARIO' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* Convention Selector Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Sparkles className="w-5 h-5 text-blue-600" /> Padrão de Nomenclatura das Colunas
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Escolha a convenção desejada para transformar os títulos automaticamente:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {conventions.map((c) => (
              <button
                key={c.id}
                onClick={() => handleConventionChange(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                  convention === c.id
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.label} <span className="opacity-70 font-sans">({c.example})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-800">Visualização Prévia dos Dados</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Exibindo 10 de {totalRows} linhas • {customHeaders.length} colunas normalizadas
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Nova Planilha
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
              title="Baixar planilha normalizada no formato CSV"
            >
              <Download className="w-3.5 h-3.5" /> Baixar CSV
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-xl transition-colors"
              title="Exportar dados como array de objetos JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-600" /> Exportar JSON
            </button>

            <button
              onClick={handleDownloadSql}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-xl transition-colors"
              title="Gerar script SQL completo com CREATE TABLE e INSERTs"
            >
              <Database className="w-3.5 h-3.5 text-purple-600" /> Script SQL
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200">
              <tr>
                {customHeaders.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-5 py-3 text-xs font-mono font-semibold text-blue-900 bg-blue-50/80 border-r border-blue-100/60 whitespace-nowrap group relative"
                  >
                    {editingIdx === idx ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tempHeader}
                          onChange={(e) => setTempHeader(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                          className="px-2 py-1 text-xs border border-blue-500 rounded bg-white font-mono focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(idx)}
                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div>{header}</div>
                          {originalHeaders[idx] && originalHeaders[idx] !== header && (
                            <div className="text-[10px] text-slate-400 font-sans font-normal truncate max-w-[120px]">
                              De: {originalHeaders[idx]}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => startEdit(idx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-opacity"
                          title="Editar nome da coluna"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {previewRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                  {customHeaders.map((_, cIdx) => (
                    <td key={cIdx} className="px-5 py-2.5 text-xs text-slate-600 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis border-r border-slate-100">
                      {row[cIdx] !== undefined && row[cIdx] !== null ? String(row[cIdx]) : <span className="text-slate-300 italic">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalRows > 10 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
            ... e mais {totalRows - 10} linhas ocultas na pré-visualização (todas serão incluídas no arquivo exportado).
          </div>
        )}
      </div>
    </div>
  );
};
