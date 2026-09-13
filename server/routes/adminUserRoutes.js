import express from "express";

import {
  getAllUsers,
  deleteUser,
} from "../controllers/adminUserController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Admin: get all users
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(getAllUsers)
);

// Admin: delete a user
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(deleteUser)
);

export default router;