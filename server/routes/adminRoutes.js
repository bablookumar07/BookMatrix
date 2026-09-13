import express from "express";

import { getDashboardStats } from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(getDashboardStats)
);

export default router;