declare module "quagga" {
  export interface QuaggaConfig {
    inputStream?: {
      type?: string;
      target?: Element | null;
      constraints?:
        | MediaStreamConstraints
        | {
            width?: number | { min?: number; max?: number };
            height?: number | { min?: number; max?: number };
            facingMode?: string;
            aspectRatio?: number | { min?: number; max?: number };
            deviceId?: string;
          };
      area?: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
      };
      singleChannel?: boolean;
    };
    locator?: {
      patchSize?: "x-small" | "small" | "medium" | "large" | "x-large";
      halfSample?: boolean;
      debug?: {
        showCanvas?: boolean;
        showPatches?: boolean;
        showFoundPatches?: boolean;
        showSkeleton?: boolean;
        showLabels?: boolean;
        showPatchLabels?: boolean;
        showRemainingPatchLabels?: boolean;
        boxFromPatches?: {
          showTransformed?: boolean;
          showTransformedBox?: boolean;
          showBB?: boolean;
        };
      };
    };
    numOfWorkers?: number;
    frequency?: number;
    decoder?: {
      readers?: Array<
        | "code_128_reader"
        | "ean_reader"
        | "ean_8_reader"
        | "code_39_reader"
        | "code_39_vin_reader"
        | "codabar_reader"
        | "upc_reader"
        | "upc_e_reader"
        | "i2of5_reader"
        | "2of5_reader"
        | "code_93_reader"
      >;
      debug?: {
        drawBoundingBox?: boolean;
        showFrequency?: boolean;
        drawScanline?: boolean;
        showPattern?: boolean;
      };
      multiple?: boolean;
    };
    locate?: boolean;
    debug?: boolean;
  }

  export interface QuaggaPoint {
    x: number;
    y: number;
  }

  export interface QuaggaResultObject {
    codeResult?: {
      code?: string;
      format?: string;
      start?: number;
      end?: number;
      codeset?: string;
      startInfo?: {
        error?: number;
        code?: number;
        start?: number;
        end?: number;
      };
      decodedCodes?: Array<{
        error?: number;
        code?: number;
        start?: number;
        end?: number;
      }>;
      endInfo?: {
        error?: number;
        code?: number;
        start?: number;
        end?: number;
      };
      direction?: number;
    };
    line?: Array<QuaggaPoint>;
    pattern?: Array<number>;
    box?: Array<QuaggaPoint>;
    boxes?: Array<Array<QuaggaPoint>>;
  }

  export interface QuaggaCanvas {
    ctx: {
      image: CanvasRenderingContext2D;
      overlay: CanvasRenderingContext2D;
    };
    dom: {
      image: HTMLCanvasElement;
      overlay: HTMLCanvasElement;
    };
  }

  export interface QuaggaImageDebug {
    drawPath: (
      path: QuaggaPoint[] | { x: number | string; y: number | string }[],
      def: { x: number | string; y: number | string },
      ctx: CanvasRenderingContext2D,
      style: {
        color?: string;
        lineWidth?: number;
      }
    ) => void;
    drawRect: (
      pos: QuaggaPoint,
      size: { x: number; y: number },
      ctx: CanvasRenderingContext2D,
      style: {
        color?: string;
        lineWidth?: number;
      }
    ) => void;
  }

  const Quagga: {
    init: (config: QuaggaConfig, callback?: (err?: Error) => void) => void;
    start: () => void;
    stop: () => void;
    pause: () => void;
    onDetected: (callback: (result: QuaggaResultObject) => void) => void;
    offDetected: (callback?: (result: QuaggaResultObject) => void) => void;
    onProcessed: (callback: (result: QuaggaResultObject) => void) => void;
    offProcessed: (callback?: (result: QuaggaResultObject) => void) => void;
    registerReader: (name: string, reader: any) => void;
    setReaders: (readers: string[]) => void;
    registerResultCollector: (resultCollector: any) => void;
    canvas: QuaggaCanvas;
    ImageDebug: QuaggaImageDebug;
    ResultCollector: any;
    CameraAccess: {
      request: (
        video: HTMLVideoElement,
        constraints?: MediaStreamConstraints
      ) => Promise<void>;
      release: () => void;
      enumerateVideoDevices: () => Promise<MediaDeviceInfo[]>;
      getActiveStreamLabel: () => string;
    };
    decodeSingle: (
      config: QuaggaConfig,
      callback: (result: QuaggaResultObject) => void
    ) => void;
  };

  export default Quagga;
}
