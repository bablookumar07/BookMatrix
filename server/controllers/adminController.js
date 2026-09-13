import User from "../models/User.js";
import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";

// ==========================================
// GET ADMIN DASHBOARD
// GET /api/admin/dashboard
// ADMIN ONLY
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // ------------------------------------------
    // Basic counts
    // ------------------------------------------
    const [
      totalBooks,
      totalStudents,
      totalUsers,
      activeBorrows,
      overdueBorrows,
    ] = await Promise.all([
      Book.countDocuments(),

      User.countDocuments({
        role: "student",
      }),

      User.countDocuments(),

      Borrow.countDocuments({
        status: { $in: ["borrowed", "overdue"] },
      }),

      Borrow.countDocuments({
        status: { $in: ["borrowed", "overdue"] },
        dueDate: { $lt: now },
        returnDate: null,
      }),
    ]);

    // ------------------------------------------
    // Total physical copies
    // ------------------------------------------
    const copyStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalCopies: {
            $sum: "$totalCopies",
          },
          availableCopies: {
            $sum: "$availableCopies",
          },
        },
      },
    ]);

    const totalCopies = copyStats[0]?.totalCopies || 0;
    const availableCopies = copyStats[0]?.availableCopies || 0;

    const borrowedCopies = Math.max(
      totalCopies - availableCopies,
      0
    );

    // ------------------------------------------
    // Recent borrow activity
    // ------------------------------------------
    const recentBorrows = await Borrow.find()
      .populate("user", "name email")
      .populate("book", "title category")
      .sort({ createdAt: -1 })
      .limit(10);

    // Convert stale borrowed records to overdue
    const recentActivity = recentBorrows.map((borrow) => {
      const borrowData = borrow.toObject();

      if (
        borrowData.status === "borrowed" &&
        borrowData.dueDate < now &&
        !borrowData.returnDate
      ) {
        borrowData.status = "overdue";
      }

      return borrowData;
    });

    // ------------------------------------------
    // Popular books
    // ------------------------------------------
    const popularBooks = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          borrowCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          borrowCount: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: {
          path: "$book",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          borrowCount: 1,
          title: "$book.title",
          category: "$book.category",
          coverImage: "$book.coverImage",
        },
      },
    ]);

    // ------------------------------------------
    // Category distribution
    // ------------------------------------------
    const categoryStats = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          bookCount: {
            $sum: 1,
          },
          totalCopies: {
            $sum: "$totalCopies",
          },
          availableCopies: {
            $sum: "$availableCopies",
          },
        },
      },
      {
        $sort: {
          bookCount: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalBooks,
        totalStudents,
        totalUsers,
        activeBorrows,
        overdueBorrows,
        totalCopies,
        availableCopies,
        borrowedCopies,
      },

      recentActivity,

      popularBooks,

      categoryStats,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};