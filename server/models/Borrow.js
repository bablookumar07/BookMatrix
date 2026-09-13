import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },

    borrowDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

   dueDate: {
  type: Date,
  required: [true, "Due date is required"],
  validate: {
    validator: function (value) {
      return value > this.borrowDate;
    },
    message: "Due date must be after borrow date",
  },
},

    returnDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
  },
  {
    timestamps: true,
  }
);

borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ book: 1, status: 1 });
borrowSchema.index({ dueDate: 1, status: 1 });

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;