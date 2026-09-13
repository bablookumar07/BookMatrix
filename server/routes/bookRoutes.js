import express from "express";

import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Public routes
router.get(
  "/",
  asyncHandler(getBooks)
);

router.get(
  "/:id",
  asyncHandler(getBookById)
);

// Admin routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("coverImage"),
  asyncHandler(createBook)
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("coverImage"),
  asyncHandler(updateBook)
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(deleteBook)
);

export default router;