import mongoose, { Document, Schema } from "mongoose";
import { Barcode as IBarcode, BarcodeType } from "../types";

export interface BarcodeDocument extends IBarcode, Document {
  _id: string;
}

const BarcodeSchema = new Schema<BarcodeDocument>(
  {
    value: {
      type: String,
      required: [true, "Barcode value is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Barcode type is required"],
      enum: Object.values(BarcodeType),
      default: BarcodeType.CODE128,
    },
    name: {
      type: String,
      required: [true, "Barcode name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: "saved-barcodes", // Specify the collection name
  }
);

// Create indexes for better query performance
BarcodeSchema.index({ value: 1 });
BarcodeSchema.index({ type: 1 });
BarcodeSchema.index({ createdAt: -1 });

// Virtual for ID transformation
BarcodeSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret._id = ret._id.toString();
    return ret;
  },
});

export const BarcodeModel = mongoose.model<BarcodeDocument>(
  "Barcode",
  BarcodeSchema
);
