import { Router } from "express";
import { BarcodeController } from "../controllers/barcodeController";

const router = Router();

// GET /api/barcodes - Get all barcodes
router.get("/", BarcodeController.getAllBarcodes);

// GET /api/barcodes/check/:value - Check if barcode exists by value (must come before /:id)
router.get("/check/:value", BarcodeController.checkBarcodeExists);

// GET /api/barcodes/:id - Get barcode by ID
router.get("/:id", BarcodeController.getBarcodeById);

// POST /api/barcodes - Create new barcode
router.post("/", BarcodeController.createBarcode);

// PUT /api/barcodes/:id - Update barcode
router.put("/:id", BarcodeController.updateBarcode);

// DELETE /api/barcodes/:id - Delete barcode
router.delete("/:id", BarcodeController.deleteBarcode);

export default router;
