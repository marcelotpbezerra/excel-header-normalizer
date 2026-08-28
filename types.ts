export type NamingConvention = 'snake_case' | 'camelCase' | 'PascalCase' | 'kebab-case' | 'UPPER_SNAKE';

export interface ProcessedData {
  originalHeaders: string[];
  headers: string[];
  rows: any[][];
  fileName: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ProcessingError {
  message: string;
  details?: string;
}
