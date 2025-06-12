import { Request, Response } from "express";
import { BarcodeModel } from "../models/Barcode";
import { BarcodeFormData, ApiResponse, CheckBarcodeResponse } from "../types";
import mongoose from "mongoose";

export class BarcodeController {
  // GET /api/barcodes - Get all barcodes
  static async getAllBarcodes(req: Request, res: Response): Promise<void> {
    try {
      const barcodes = await BarcodeModel.find()
        .sort({ createdAt: -1 }) // Most recent first
        .lean(); // Return plain objects instead of Mongoose documents

      res.json(barcodes);
    } catch (error) {
      console.error("Error fetching barcodes:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch barcodes",
        message: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<null>);
    }
  }

  // GET /api/barcodes/:id - Get barcode by ID
  static async getBarcodeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid barcode ID format",
        } as ApiResponse<null>);
        return;
      }

      const barcode = await BarcodeModel.findById(id).lean();

      if (!barcode) {
        res.status(404).json({
          success: false,
          error: "Barcode not found",
        } as ApiResponse<null>);
        return;
      }

      res.json(barcode);
    } catch (error) {
      console.error("Error fetching barcode:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch barcode",
        message: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<null>);
    }
  }

  // POST /api/barcodes - Create new barcode
  static async createBarcode(req: Request, res: Response): Promise<void> {
    try {
      const { barcode: barcodeData }: { barcode: BarcodeFormData } = req.body;

      if (!barcodeData) {
        res.status(400).json({
          success: false,
          error: "Barcode data is required",
        } as ApiResponse<null>);
        return;
      }

      // Validate required fields
      const { value, type, name } = barcodeData;
      if (!value || !type || !name) {
        res.status(400).json({
          success: false,
          error: "Value, type, and name are required fields",
        } as ApiResponse<null>);
        return;
      }

      // Check if barcode with same value already exists
      const existingBarcode = await BarcodeModel.findOne({ value });
      if (existingBarcode) {
        res.status(409).json({
          success: false,
          error: "A barcode with this value already exists",
        } as ApiResponse<null>);
        return;
      }

      const newBarcode = new BarcodeModel(barcodeData);
      const savedBarcode = await newBarcode.save();

      res.status(201).json({
        success: true,
        data: savedBarcode.toJSON(),
        message: "Barcode created successfully",
      } as ApiResponse<typeof savedBarcode>);
    } catch (error) {
      console.error("Error creating barcode:", error);

      // Handle validation errors
      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        res.status(400).json({
          success: false,
          error: "Validation failed",
          message: validationErrors.join(", "),
        } as ApiResponse<null>);
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to create barcode",
        message: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<null>);
    }
  }

  // PUT /api/barcodes/:id - Update barcode
  static async updateBarcode(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: Partial<BarcodeFormData> = req.body;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid barcode ID format",
        } as ApiResponse<null>);
        return;
      }

      // If updating value, check for duplicates
      if (updateData.value) {
        const existingBarcode = await BarcodeModel.findOne({
          value: updateData.value,
          _id: { $ne: id }, // Exclude current barcode
        });

        if (existingBarcode) {
          res.status(409).json({
            success: false,
            error: "A barcode with this value already exists",
          } as ApiResponse<null>);
          return;
        }
      }

      const updatedBarcode = await BarcodeModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedBarcode) {
        res.status(404).json({
          success: false,
          error: "Barcode not found",
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        data: updatedBarcode,
        message: "Barcode updated successfully",
      } as ApiResponse<typeof updatedBarcode>);
    } catch (error) {
      console.error("Error updating barcode:", error);

      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        res.status(400).json({
          success: false,
          error: "Validation failed",
          message: validationErrors.join(", "),
        } as ApiResponse<null>);
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to update barcode",
        message: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<null>);
    }
  }

  // DELETE /api/barcodes/:id - Delete barcode
  static async deleteBarcode(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid barcode ID format",
        } as ApiResponse<null>);
        return;
      }

      const deletedBarcode = await BarcodeModel.findByIdAndDelete(id).lean();

      if (!deletedBarcode) {
        res.status(404).json({
          success: false,
          error: "Barcode not found",
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: "Barcode deleted successfully",
      } as ApiResponse<null>);
    } catch (error) {
      console.error("Error deleting barcode:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete barcode",
        message: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<null>);
    }
  }

  // GET /api/barcodes/check/:value - Check if barcode exists by value
  static async checkBarcodeExists(req: Request, res: Response): Promise<void> {
    try {
      const { value } = req.params;

      if (!value) {
        res.status(400).json({
          success: false,
          error: "Barcode value is required",
        } as ApiResponse<null>);
        return;
      }

      const barcode = await BarcodeModel.findOne({ value }).lean();

      const response: CheckBarcodeResponse = {
        exists: !!barcode,
        ...(barcode && { barcode }),
      };

      res.json(response);
    } catch (error) {
      console.error("Error checking barcode:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check barcode",
        message: error instanceof Error ? error.message : "Unknown error",
      } as ApiResponse<null>);
    }
  }
}
