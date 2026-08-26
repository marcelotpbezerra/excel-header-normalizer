import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import { ProcessedData } from '../types';
import { generateCsvBlob } from '../services/excelService';

interface DataPreviewProps {
  data: ProcessedData;
  onReset: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, onReset }) => {
  const { headers, rows, fileName } = data;

  // Only show first 10 rows for performance in preview
  const previewRows = useMemo(() => rows.slice(0, 10), [rows]);
  const totalRows = rows.length;

  const handleDownload = () => {
    const blob = generateCsvBlob(headers, rows);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_normalized.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Visualização Prévia</h2>
            <p className="text-sm text-slate-500">
              Exibindo 10 de {totalRows} linhas processadas
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
            >
              Enviar Outro
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Baixar CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-xs font-mono font-semibold text-blue-800 bg-blue-50 border-b border-blue-100 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {previewRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {headers.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis">
                      {row[cIdx] !== undefined && row[cIdx] !== null ? String(row[cIdx]) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalRows > 10 && (
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
                ... e mais {totalRows - 10} linhas ocultas
            </div>
        )}
      </div>
    </div>
  );
};
