export interface ProcessedData {
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
