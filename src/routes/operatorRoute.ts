import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import upload from "../services/multerService";
import { OPERATOR_FIELDS } from "../validator/uploadsValidator";
import {
  createOperator,
  deleteOperator,
  getOperators,
  getOperatorById,
  updateOperator,
  getOperatorEquipmentHistory,
} from "../controller/operatorController";

export const operatorRouter = express.Router();



// Base routes - GET with queries/pagination
operatorRouter.get("/", authMiddleware, getOperators);
operatorRouter.post("/", authMiddleware, upload.fields(OPERATOR_FIELDS), createOperator);


// Equipment history for specific operator (must be before /:id to avoid route conflicts)
operatorRouter.get("/:id/equipment-history", authMiddleware, getOperatorEquipmentHistory);

// Specific operator routes
operatorRouter.get("/:id", authMiddleware, getOperatorById);
operatorRouter.put("/:id", authMiddleware, upload.fields(OPERATOR_FIELDS), updateOperator);
// operatorRouter.delete("/:id", authMiddleware, deleteOperator);