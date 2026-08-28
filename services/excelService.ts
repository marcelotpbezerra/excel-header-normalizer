import * as XLSX from 'xlsx';
import { normalizeHeader } from '../utils/stringUtils';
import { ProcessedData, NamingConvention } from '../types';

export const processExcelFile = async (
  file: File,
  convention: NamingConvention = 'snake_case'
): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("Falha ao ler o conteúdo do arquivo.");
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          throw new Error("O arquivo Excel parece estar vazio.");
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          throw new Error("A planilha não contém dados.");
        }

        const originalHeaders = (jsonData[0] || []).map((h) => String(h ?? '').trim());
        const normalizedHeaders = originalHeaders.map((h) => normalizeHeader(h, convention));
        const dataRows = jsonData.slice(1).filter((r) => r && r.some((c) => c !== null && c !== undefined && c !== ''));

        resolve({
          originalHeaders,
          headers: normalizedHeaders,
          rows: dataRows,
          fileName: file.name.replace(/\.[^/.]+$/, ""),
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Erro desconhecido ao processar planilha"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro na leitura do arquivo."));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const generateCsvBlob = (headers: string[], rows: any[][]): Blob => {
  const wsData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  return new Blob(["\uFEFF" + csvOutput], { type: 'text/csv;charset=utf-8;' });
};

export const generateJsonBlob = (headers: string[], rows: any[][]): Blob => {
  const objects = rows.map((row) => {
    const obj: Record<string, any> = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] !== undefined ? row[idx] : null;
    });
    return obj;
  });

  const jsonStr = JSON.stringify(objects, null, 2);
  return new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
};

export const generateSqlScriptBlob = (tableName: string, headers: string[], rows: any[][]): Blob => {
  const cleanTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase() || 'tabela_importada';
  
  // Estimate column types
  const columnDefs = headers.map((header, idx) => {
    let hasText = false;
    let hasFloat = false;
    let hasInt = false;

    for (const row of rows.slice(0, 100)) {
      const val = row[idx];
      if (val === null || val === undefined || val === '') continue;
      if (typeof val === 'number') {
        if (Number.isInteger(val)) hasInt = true;
        else hasFloat = true;
      } else {
        hasText = true;
        break;
      }
    }

    const type = hasText ? 'TEXT' : hasFloat ? 'NUMERIC(15,4)' : hasInt ? 'BIGINT' : 'VARCHAR(255)';
    return `    ${header} ${type}`;
  });

  let sql = `-- Script de Criação e Inserção gerado pelo Excel Header Normalizer\n`;
  sql += `-- Tabela: ${cleanTableName}\n\n`;
  sql += `CREATE TABLE IF NOT EXISTS ${cleanTableName} (\n`;
  sql += `    id BIGSERIAL PRIMARY KEY,\n`;
  sql += columnDefs.join(',\n');
  sql += `\n);\n\n`;

  // Inserts
  if (rows.length > 0) {
    const cols = headers.join(', ');
    sql += `INSERT INTO ${cleanTableName} (${cols})\nVALUES\n`;

    const valueRows = rows.map((row) => {
      const vals = headers.map((_, idx) => {
        const val = row[idx];
        if (val === null || val === undefined || val === '') return 'NULL';
        if (typeof val === 'number') return String(val);
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        const escaped = String(val).replace(/'/g, "''");
        return `'${escaped}'`;
      });
      return `    (${vals.join(', ')})`;
    });

    sql += valueRows.join(',\n') + ';\n';
  }

  return new Blob([sql], { type: 'text/plain;charset=utf-8;' });
};
