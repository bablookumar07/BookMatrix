import {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../validators/authValidator.js";

import User from "../models/User.js";
import { sendPasswordResetEmail } from "../services/emailService.js";
import cookieOptions from "../utils/cookieOptions.js";
import generateToken from "../utils/generateToken.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/passwordUtils.js";

import {
  generateResetToken,
  hashResetToken,
} from "../utils/passwordReset.js";

// ==========================================
// REGISTER STUDENT
// POST /api/auth/register
// ==========================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationError = validateRegisterInput({
  name,
  email,
  password,
});

if (validationError) {
  return res.status(400).json({
    success: false,
    message: validationError,
  });
}



    // Normalize input
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create student account
    // Role is deliberately NOT taken from req.body
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "Student account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account",
    });
  }
};

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

 const validationError = validateLoginInput({
  email,
  password,
});

if (validationError) {
  return res.status(400).json({
    success: false,
    message: validationError,
  });
}

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Password is select:false in User model,
    // so explicitly include it for authentication.
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    // Use the same message for both cases
    // to avoid revealing whether an email exists.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await comparePassword(
  password,
  user.password
);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Make sure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Create JWT
    const token = generateToken(user._id, user.role);

    // Store token in HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

// ==========================================
// GET CURRENT USER
// GET /api/auth/me
// ==========================================
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user",
    });
  }
};

// ==========================================
// LOGOUT
// POST /api/auth/logout
// ==========================================
export const logout = async (req, res) => {
  try {
    
res.clearCookie("token", cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging out",
    });
  }
};
// ==========================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ==========================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
     
    const validationError = validateForgotPasswordInput({
  email,
});

if (validationError) {
  return res.status(400).json({
    success: false,
    message: validationError,
  });
}

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+resetPasswordToken +resetPasswordExpire");

    // Don't reveal whether an account exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent",
      });
    }

    // Generate secure reset token
    const resetToken = generateResetToken();
const hashedToken = hashResetToken(resetToken);

    user.resetPasswordToken = hashedToken;

    // Token expires in 15 minutes
    user.resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save({ validateBeforeSave: false });

    // Create frontend reset URL
    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (emailError) {
      console.error("Password reset email error:", emailError);

      // Remove token if email could not be sent
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Unable to send password reset email",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing the request",
    });
  }
};

// ==========================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ==========================================
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

const validationError = validateResetPasswordInput({
  token,
  password,
});

if (validationError) {
  return res.status(400).json({
    success: false,
    message: validationError,
  });
}

    // Hash token received from frontend
    const hashedToken = hashResetToken(token);

    // Find user with valid, non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: new Date(),
      },
    }).select(
      "+resetPasswordToken +resetPasswordExpire +password"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired",
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    // Invalidate reset token immediately
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting your password",
    });
  }
};