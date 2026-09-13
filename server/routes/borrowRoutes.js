import express from "express";

import {
  borrowBook,
  getMyBorrows,
  returnBook,
  getAllBorrows,
  adminReturnBook,
} from "../controllers/borrowController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

// Student: borrow a book
router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  asyncHandler(borrowBook)
);

// Student: get own borrowing history
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  asyncHandler(getMyBorrows)
);

// Admin: get all borrowing records
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(getAllBorrows)
);

// Student/Admin: return a book
router.put(
  "/:id/return",
  authMiddleware,
  roleMiddleware("student", "admin"),
  asyncHandler(async (req, res, next) => {
    if (req.user.role === "admin") {
      return adminReturnBook(req, res, next);
    }

    return returnBook(req, res, next);
  })
);

export default router;