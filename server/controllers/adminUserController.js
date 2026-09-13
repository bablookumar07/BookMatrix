import mongoose from "mongoose";

import User from "../models/User.js";
import Borrow from "../models/Borrow.js";

// ==========================================
// GET ALL USERS
// GET /api/admin/users
// ADMIN ONLY
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .sort({ createdAt: -1 })
      .lean();

    // Get active borrow count for every user
    const activeBorrowCounts = await Borrow.aggregate([
      {
        $match: {
          status: { $in: ["borrowed", "overdue"] },
        },
      },
      {
        $group: {
          _id: "$user",
          activeBorrows: {
            $sum: 1,
          },
        },
      },
    ]);

    const borrowCountMap = new Map(
      activeBorrowCounts.map((item) => [
        item._id.toString(),
        item.activeBorrows,
      ])
    );

    const usersWithStats = users.map((user) => ({
      ...user,
      activeBorrows: borrowCountMap.get(user._id.toString()) || 0,
    }));

    return res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ==========================================
// DELETE USER
// DELETE /api/admin/users/:id
// ADMIN ONLY
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Prevent admin from deleting themselves
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Never allow deletion of an admin through this endpoint
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted",
      });
    }

    // Check active borrows
    const activeBorrowCount = await Borrow.countDocuments({
      user: user._id,
      status: { $in: ["borrowed", "overdue"] },
    });

    if (activeBorrowCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete a student with active borrowed books",
      });
    }

    // Delete student
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};