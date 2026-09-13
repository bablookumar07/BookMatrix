import mongoose from "mongoose";

import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

// GET ALL BOOKS
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get books error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching books",
    });
  }
};

// GET SINGLE BOOK
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get book error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the book",
    });
  }
};

// CREATE BOOK
export const createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      totalCopies,
      availableCopies,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      totalCopies === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category and total copies are required",
      });
    }

    const parsedTotalCopies = Number(totalCopies);

    if (
      !Number.isInteger(parsedTotalCopies) ||
      parsedTotalCopies < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Total copies must be a positive integer",
      });
    }

    const parsedAvailableCopies =
      availableCopies === undefined || availableCopies === ""
        ? parsedTotalCopies
        : Number(availableCopies);

    if (
      !Number.isInteger(parsedAvailableCopies) ||
      parsedAvailableCopies < 0 ||
      parsedAvailableCopies > parsedTotalCopies
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Available copies must be between 0 and total copies",
      });
    }

    let coverImage = {
      url: "",
      publicId: "",
    };

    // Upload cover image if provided
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer
      );

      coverImage = uploadedImage;
    }

    const book = await Book.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      totalCopies: parsedTotalCopies,
      availableCopies: parsedAvailableCopies,
      coverImage,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the book",
    });
  }
};

// UPDATE BOOK
// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const {
      title,
      description,
      category,
      totalCopies,
      availableCopies,
    } = req.body;

    // ------------------------------------------
    // Basic fields
    // ------------------------------------------
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Book title cannot be empty",
        });
      }

      book.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Book description cannot be empty",
        });
      }

      book.description = description.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Book category cannot be empty",
        });
      }

      book.category = category.trim();
    }

    // ------------------------------------------
    // Copy calculations
    // ------------------------------------------
    const currentBorrowedCopies =
      book.totalCopies - book.availableCopies;

    let newTotalCopies = book.totalCopies;
    let newAvailableCopies = book.availableCopies;

    if (totalCopies !== undefined && totalCopies !== "") {
      newTotalCopies = Number(totalCopies);

      if (
        !Number.isInteger(newTotalCopies) ||
        newTotalCopies < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Total copies must be a positive integer",
        });
      }

      if (newTotalCopies < currentBorrowedCopies) {
        return res.status(400).json({
          success: false,
          message:
            "Total copies cannot be less than currently borrowed copies",
        });
      }

      if (
        availableCopies === undefined ||
        availableCopies === ""
      ) {
        newAvailableCopies =
          newTotalCopies - currentBorrowedCopies;
      }
    }

    if (availableCopies !== undefined && availableCopies !== "") {
      newAvailableCopies = Number(availableCopies);

      if (
        !Number.isInteger(newAvailableCopies) ||
        newAvailableCopies < 0 ||
        newAvailableCopies > newTotalCopies
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Available copies must be between 0 and total copies",
        });
      }

      const newBorrowedCopies =
        newTotalCopies - newAvailableCopies;

      if (newBorrowedCopies < currentBorrowedCopies) {
        return res.status(400).json({
          success: false,
          message:
            "Available copies cannot conflict with active borrowed copies",
        });
      }
    }

    book.totalCopies = newTotalCopies;
    book.availableCopies = newAvailableCopies;

    // ------------------------------------------
    // Replace cover image
    // ------------------------------------------
    let oldPublicId = null;
    let newPublicId = null;

    if (req.file) {
      oldPublicId = book.coverImage?.publicId || null;

      const uploadedImage = await uploadToCloudinary(
        req.file.buffer
      );

      newPublicId = uploadedImage.publicId;
      book.coverImage = uploadedImage;
    }

    // ------------------------------------------
    // Save MongoDB document
    // ------------------------------------------
    try {
      await book.save();
    } catch (saveError) {
      // MongoDB failed after Cloudinary upload.
      // Remove newly uploaded image to avoid orphaned files.
      if (newPublicId) {
        await deleteFromCloudinary(newPublicId);
      }

      throw saveError;
    }

    // ------------------------------------------
    // Delete old Cloudinary image
    // ------------------------------------------
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the book",
    });
  }
};
// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const activeBorrowExists = await Borrow.exists({
      book: book._id,
      status: {
        $in: ["borrowed", "overdue"],
      },
    });

    if (activeBorrowExists) {
      return res.status(400).json({
        success: false,
        message:
          "This book cannot be deleted because it is currently borrowed",
      });
    }

    if (book.coverImage?.publicId) {
  await deleteFromCloudinary(book.coverImage.publicId);
}

await book.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the book",
    });
  }
};