import mongoose from "mongoose";

import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import withTransaction from "../utils/withTransaction.js";

// ==========================================
// BORROW BOOK
// POST /api/borrows
// STUDENT ONLY
// ==========================================
export const borrowBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;
    const userId = req.user.userId;

    // ------------------------------------------
    // Validate input
    // ------------------------------------------
    if (!bookId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Book ID and due date are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const parsedDueDate = new Date(dueDate);

    if (Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    if (parsedDueDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date must be in the future",
      });
    }

    // ------------------------------------------
    // Transaction
    // ------------------------------------------
    const borrow = await withTransaction(async (session) => {
      // Maximum 3 active borrows
      const activeBorrowCount = await Borrow.countDocuments({
        user: userId,
        status: { $in: ["borrowed", "overdue"] },
      }).session(session);

      if (activeBorrowCount >= 3) {
        const error = new Error(
          "You can borrow a maximum of 3 books at a time"
        );

        error.statusCode = 400;

        throw error;
      }

      // Check for duplicate active borrow
      const existingBorrow = await Borrow.findOne({
        user: userId,
        book: bookId,
        status: { $in: ["borrowed", "overdue"] },
      }).session(session);

      if (existingBorrow) {
        const error = new Error(
          "You have already borrowed this book"
        );

        error.statusCode = 400;

        throw error;
      }

      // Find book
      const book = await Book.findById(bookId).session(session);

      if (!book) {
        const error = new Error("Book not found");

        error.statusCode = 404;

        throw error;
      }

      // Check availability
      if (book.availableCopies <= 0) {
        const error = new Error(
          "This book is currently unavailable"
        );

        error.statusCode = 400;

        throw error;
      }

      // Decrease available copies
      book.availableCopies -= 1;

      await book.save({ session });

      // Create borrow record
      const [newBorrow] = await Borrow.create(
        [
          {
            user: userId,
            book: bookId,
            borrowDate: new Date(),
            dueDate: parsedDueDate,
            returnDate: null,
            status: "borrowed",
          },
        ],
        { session }
      );

      return newBorrow;
    });

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate("book", "title category coverImage")
      .populate("user", "name email");

    return res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      borrow: populatedBorrow,
    });
  } catch (error) {
    console.error("Borrow book error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Something went wrong while borrowing the book",
    });
  }
};

// ==========================================
// GET MY BORROWED BOOKS
// GET /api/borrows/my
// STUDENT ONLY
// ==========================================
export const getMyBorrows = async (req, res) => {
  try {
    const userId = req.user.userId;

    const borrows = await Borrow.find({
      user: userId,
    })
      .populate(
        "book",
        "title description category coverImage"
      )
      .sort({ borrowDate: -1 });

    // Update overdue status dynamically
    const now = new Date();

    const updatedBorrows = borrows.map((borrow) => {
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

    return res.status(200).json({
      success: true,
      count: updatedBorrows.length,
      borrows: updatedBorrows,
    });
  } catch (error) {
    console.error("Get my borrows error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your borrowed books",
    });
  }
};

// ==========================================
// RETURN BOOK
// PUT /api/borrows/:id/return
// STUDENT ONLY
// ==========================================
export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrow ID",
      });
    }

    const returnedBorrow = await withTransaction(async (session) => {
      const borrow = await Borrow.findById(id).session(session);

      if (!borrow) {
        const error = new Error("Borrow record not found");
        error.statusCode = 404;
        throw error;
      }

      if (borrow.user.toString() !== userId.toString()) {
        const error = new Error(
          "You are not allowed to return this book"
        );
        error.statusCode = 403;
        throw error;
      }

      if (borrow.status === "returned" || borrow.returnDate) {
        const error = new Error(
          "This book has already been returned"
        );
        error.statusCode = 400;
        throw error;
      }

      const book = await Book.findById(borrow.book).session(session);

      if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
      }

      borrow.returnDate = new Date();
      borrow.status = "returned";

      book.availableCopies = Math.min(
        book.availableCopies + 1,
        book.totalCopies
      );

      await borrow.save({ session });
      await book.save({ session });

      return borrow;
    });

    const populatedBorrow = await Borrow.findById(
      returnedBorrow._id
    )
      .populate("book", "title category coverImage")
      .populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
      borrow: populatedBorrow,
    });
  } catch (error) {
    console.error("Return book error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Something went wrong while returning the book",
    });
  }
};

// ==========================================
// GET ALL BORROWS
// GET /api/borrows
// ADMIN ONLY
// ==========================================
export const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("user", "name email")
      .populate("book", "title category coverImage")
      .sort({ borrowDate: -1 });

    const now = new Date();

    const updatedBorrows = borrows.map((borrow) => {
      const borrowData = borrow.toObject();

      if (
        borrow.status === "borrowed" &&
        borrow.dueDate < now &&
        !borrow.returnDate
      ) {
        borrowData.status = "overdue";
      }

      return borrowData;
    });

    return res.status(200).json({
      success: true,
      count: updatedBorrows.length,
      borrows: updatedBorrows,
    });
  } catch (error) {
    console.error("Get all borrows error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrow records",
    });
  }
};

// ==========================================
// ADMIN RETURN BOOK
// PUT /api/borrows/:id/return
// ADMIN ONLY
// ==========================================
export const adminReturnBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrow ID",
      });
    }

    const returnedBorrow = await withTransaction(async (session) => {
      const borrow = await Borrow.findById(id).session(session);

      if (!borrow) {
        const error = new Error("Borrow record not found");
        error.statusCode = 404;
        throw error;
      }

      if (borrow.status === "returned" || borrow.returnDate) {
        const error = new Error(
          "This book has already been returned"
        );
        error.statusCode = 400;
        throw error;
      }

      const book = await Book.findById(borrow.book).session(session);

      if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
      }

      borrow.returnDate = new Date();
      borrow.status = "returned";

      book.availableCopies = Math.min(
        book.availableCopies + 1,
        book.totalCopies
      );

      await borrow.save({ session });
      await book.save({ session });

      return borrow;
    });

    const populatedBorrow = await Borrow.findById(
      returnedBorrow._id
    )
      .populate("book", "title category coverImage")
      .populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
      borrow: populatedBorrow,
    });
  } catch (error) {
    console.error("Admin return book error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Something went wrong while returning the book",
    });
  }
};