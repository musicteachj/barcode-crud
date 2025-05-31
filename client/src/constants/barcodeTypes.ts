export interface BarcodeType {
  text: string;
  type: string;
  numOnly: boolean;
  value: {
    min: number;
    max: number;
  };
  intConstraints?: {
    minValue: number | null;
    maxValue: number | null;
  };
  checkDigit: boolean;
}

export const barcodeTypes: BarcodeType[] = [
  {
    text: "CODE128",
    type: "CODE128",
    numOnly: false,
    value: { min: 1, max: 13 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: false,
  },
  {
    text: "EAN-13",
    type: "EAN13",
    numOnly: true,
    value: { min: 12, max: 12 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: true,
  },
  {
    text: "EAN-8",
    type: "EAN8",
    numOnly: true,
    value: { min: 7, max: 7 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: true,
  },
  {
    text: "EAN-5",
    type: "EAN5",
    numOnly: true,
    value: { min: 5, max: 5 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: false,
  },
  {
    text: "EAN-2",
    type: "EAN2",
    numOnly: true,
    value: { min: 2, max: 2 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: false,
  },
  {
    text: "UPC (A)",
    type: "UPC",
    numOnly: true,
    value: { min: 11, max: 11 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: true,
  },
  {
    text: "CODE39",
    type: "CODE39",
    numOnly: false,
    value: { min: 1, max: 13 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: false,
  },
  {
    text: "ITF-14",
    type: "ITF14",
    numOnly: true,
    value: { min: 13, max: 13 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: true,
  },
  {
    text: "MSI",
    type: "MSI",
    numOnly: true,
    value: { min: 1, max: 12 },
    intConstraints: { minValue: null, maxValue: null },
    checkDigit: false,
  },
  {
    text: "Pharmacode",
    type: "pharmacode",
    numOnly: true,
    value: { min: 1, max: 6 },
    intConstraints: { minValue: 3, maxValue: 131070 },
    checkDigit: false,
  },
];
