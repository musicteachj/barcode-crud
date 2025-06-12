// Root state interface
export interface RootState {
  appName: string;
  version: string;
}

// Barcode interfaces
export interface Barcode {
  _id?: string;
  value: string;
  type: BarcodeType;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BarcodeState {
  barcodes: Barcode[];
  loading: boolean;
  error: string | null;
  currentBarcode: Barcode | null;
}

export enum BarcodeType {
  CODE128 = "CODE128",
  CODE39 = "CODE39",
  EAN13 = "EAN13",
  EAN8 = "EAN8",
  UPC = "UPC",
  ITF = "ITF",
  MSI = "MSI",
  PHARMACODE = "pharmacode",
  CODABAR = "codabar",
}

// Form interfaces
export interface BarcodeFormData {
  value: string;
  type: BarcodeType;
  name: string;
  description?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
