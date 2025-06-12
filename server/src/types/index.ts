export enum BarcodeType {
  CODE128 = "CODE128",
  EAN13 = "EAN13",
  EAN8 = "EAN8",
  CODE39 = "CODE39",
  CODE93 = "CODE93",
  UPCA = "UPCA",
  UPCE = "UPCE",
  ITF14 = "ITF14",
  ITF = "ITF",
  MSI = "MSI",
  pharmacode = "pharmacode",
  codabar = "codabar",
}

export interface Barcode {
  _id?: string;
  value: string;
  type: BarcodeType;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BarcodeFormData {
  value: string;
  type: BarcodeType;
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CheckBarcodeResponse {
  exists: boolean;
  barcode?: Barcode;
}
