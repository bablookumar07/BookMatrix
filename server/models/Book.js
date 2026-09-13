import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [1, "Book title cannot be empty"],
      maxlength: [200, "Book title is too long"],
    },

    description: {
      type: String,
      required: [true, "Book description is required"],
      trim: true,
      minlength: [1, "Book description cannot be empty"],
      maxlength: [5000, "Book description is too long"],
    },

    category: {
      type: String,
      required: [true, "Book category is required"],
      trim: true,
      minlength: [1, "Book category cannot be empty"],
      maxlength: [100, "Book category is too long"],
    },

    totalCopies: {
      type: Number,
      required: [true, "Total copies are required"],
      min: [1, "Total copies must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Total copies must be a whole number",
      },
    },

    availableCopies: {
      type: Number,
      required: [true, "Available copies are required"],
      min: [0, "Available copies cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Available copies must be a whole number",
      },
    },

    coverImage: {
      url: {
        type: String,
        default: "",
        trim: true,
      },

      publicId: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Make sure available copies never exceed total copies.
bookSchema.path("availableCopies").validate(function (value) {
  return value <= this.totalCopies;
}, "Available copies cannot exceed total copies");

// Make sure total copies remain valid relative to available copies.
bookSchema.path("totalCopies").validate(function (value) {
  return value >= this.availableCopies;
}, "Total copies cannot be less than available copies");

const Book = mongoose.model("Book", bookSchema);

export default Book;