// Barcode type interface
export interface BarcodeType {
  text: string;
  value: string;
  type: string;
  description: string;
  numOnly: boolean;
  limits: {
    min: number;
    max: number;
  };
  intConstraints?: {
    minValue: number | null;
    maxValue: number | null;
  };
  checkDigit: boolean;
  mask?: string;
}

// Available barcode types configuration
export const BARCODE_TYPES: BarcodeType[] = [
  {
    text: "CODE128",
    value: "CODE128",
    type: "CODE128",
    description: "Most versatile - supports all ASCII characters",
    numOnly: false,
    limits: { min: 1, max: 80 },
    checkDigit: false,
  },
  {
    text: "EAN-13",
    value: "EAN13",
    type: "EAN13",
    description: "European Article Number - 13 digits",
    numOnly: true,
    limits: { min: 12, max: 12 },
    checkDigit: true,
  },
  {
    text: "EAN-8",
    value: "EAN8",
    type: "EAN8",
    description: "Compact version of EAN - 8 digits",
    numOnly: true,
    limits: { min: 7, max: 7 },
    checkDigit: true,
  },
  {
    text: "UPC-A",
    value: "UPC",
    type: "UPC",
    description: "Universal Product Code - 12 digits",
    numOnly: true,
    limits: { min: 11, max: 11 },
    checkDigit: true,
  },
  {
    text: "CODE39",
    value: "CODE39",
    type: "CODE39",
    description: "Alphanumeric - uppercase letters and numbers",
    numOnly: false,
    limits: { min: 1, max: 40 },
    checkDigit: false,
  },
  {
    text: "ITF-14",
    value: "ITF14",
    type: "ITF14",
    description: "Interleaved 2 of 5 - 14 digits for shipping",
    numOnly: true,
    limits: { min: 13, max: 13 },
    checkDigit: true,
  },
  {
    text: "MSI",
    value: "MSI",
    type: "MSI",
    description: "Modified Plessey - numeric only",
    numOnly: true,
    limits: { min: 1, max: 12 },
    checkDigit: false,
  },
  {
    text: "Pharmacode",
    value: "pharmacode",
    type: "pharmacode",
    description: "Pharmaceutical industry - numeric (3 to 131070)",
    numOnly: true,
    limits: { min: 1, max: 6 },
    intConstraints: { minValue: 3, maxValue: 131070 },
    checkDigit: false,
  },
];

// Helper function to get barcode type by value
export const getBarcodeType = (value: string): BarcodeType | undefined => {
  return BARCODE_TYPES.find((type) => type.value === value);
};

// Helper function to get barcode width for rendering
export const getBarcodeWidth = (type: string): number => {
  switch (type) {
    case "CODE128":
    case "CODE39":
      return 2;
    case "EAN13":
    case "UPC":
      return 3;
    case "pharmacode":
      return 4;
    default:
      return 2;
  }
};

// Default barcode options for vue-barcode
export const getDefaultBarcodeOptions = (type = "CODE128") => ({
  format: type,
  width: getBarcodeWidth(type),
  height: 100,
  displayValue: true,
  fontSize: 16,
  font: "Roboto",
  textMargin: 5,
  background: "#ffffff",
  lineColor: "#000000",
});
