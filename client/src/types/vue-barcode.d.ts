declare module "vue-barcode" {
  import { VueConstructor } from "vue";

  interface BarcodeOptions {
    format?: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    text?: string;
    fontOptions?: string;
    font?: string;
    textAlign?: string;
    textPosition?: string;
    textMargin?: number;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    valid?: (valid: boolean) => void;
  }

  interface VueBarcodeProps {
    value: string;
    options?: BarcodeOptions;
    tag?: string;
  }

  const VueBarcode: VueConstructor<Vue & VueBarcodeProps>;

  export default VueBarcode;
}
