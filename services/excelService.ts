import * as XLSX from 'xlsx';
import { normalizeHeader } from '../utils/stringUtils';
import { ProcessedData } from '../types';

export const processExcelFile = async (file: File): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("Failed to read file data");
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        
        if (!firstSheetName) {
            throw new Error("The Excel file appears to be empty.");
        }

        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays to easily handle headers
        const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          throw new Error("Sheet contains no data.");
        }

        // Extract and normalize headers
        const originalHeaders = jsonData[0];
        const normalizedHeaders = originalHeaders.map((h) => normalizeHeader(h));

        // Get the rest of the data
        const dataRows = jsonData.slice(1);

        resolve({
          headers: normalizedHeaders,
          rows: dataRows,
          fileName: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        });

      } catch (error) {
        reject(error instanceof Error ? error : new Error("Unknown error processing Excel file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading the file."));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const generateCsvBlob = (headers: string[], rows: any[][]): Blob => {
  // Combine headers and rows back into a single dataset
  const wsData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  return new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
};
