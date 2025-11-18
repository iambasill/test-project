import express from "express";
import upload from "../services/multerService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UPLOAD_FIELDS } from "../validator/uploadsValidator";
import {
  createEquipment,
  createEquipmentOwnership,
  getEquipment,
  getEquipmentById,
  updateEquipment,
  getEquipmentOwnerships,
  getEquipmentStats,
  updateEquipmentOwnerships,
} from "../controller/equipmentController";
import e from "express";

export const equipmentRouter = express.Router();

// Statistics route (should be before :id route to avoid conflicts)
equipmentRouter.get("/stats", authMiddleware, getEquipmentStats);

// Base routes - GET with queries/pagination
equipmentRouter.get("/", authMiddleware, getEquipment);
equipmentRouter.post("/", authMiddleware, upload.fields(UPLOAD_FIELDS), createEquipment);

// Ownership routes
equipmentRouter.get("/ownership/:id", authMiddleware, getEquipmentOwnerships);
equipmentRouter.post("/create-ownership", authMiddleware, upload.any(), createEquipmentOwnership);
equipmentRouter.put("/ownership/:ownershipId", authMiddleware, upload.any(), updateEquipmentOwnerships);

// Specific equipment routes (must be after other routes with /stats and /ownership to avoid :id conflicts)
equipmentRouter.get("/:id", authMiddleware, getEquipmentById);
equipmentRouter.put("/:id", authMiddleware, upload.fields(UPLOAD_FIELDS), updateEquipment);