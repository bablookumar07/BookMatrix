import express from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/register",
  authRateLimiter,
  asyncHandler(register)
);

router.post(
  "/login",
  authRateLimiter,
  asyncHandler(login)
);

router.post(
  "/logout",
  authMiddleware,
  asyncHandler(logout)
);

router.get(
  "/me",
  authMiddleware,
  asyncHandler(getCurrentUser)
);

router.post(
  "/forgot-password",
  authRateLimiter,
  asyncHandler(forgotPassword)
);

router.post(
  "/reset-password",
  authRateLimiter,
  asyncHandler(resetPassword)
);

export default router;