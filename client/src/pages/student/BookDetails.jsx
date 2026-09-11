
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";

const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    description:
      "Atomic Habits provides a practical framework for building good habits, breaking bad ones, and making small changes that lead to remarkable results.",
    totalCopies: 8,
    availableCopies: 5,
    publishedYear: "2018",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    description:
      "An exploration of the unusual ways people think about money, wealth, risk, and financial decisions through timeless stories and practical lessons.",
    totalCopies: 6,
    availableCopies: 3,
    publishedYear: "2020",
    cover:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    description:
      "A practical guide to writing clean, readable, maintainable code and developing better software engineering habits.",
    totalCopies: 5,
    availableCopies: 0,
    publishedYear: "2008",
    cover:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    description:
      "Deep Work explores the value of focused, distraction-free work and presents strategies for developing concentration in a distracted world.",
    totalCopies: 7,
    availableCopies: 4,
    publishedYear: "2016",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=85",
  },
];

function BookDetails() {
  const { id } = useParams();

  const book = books.find(
    (item) => item.id === Number(id)
  );

  const [showBorrowPanel, setShowBorrowPanel] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [borrowed, setBorrowed] = useState(false);

  if (!book) {
    return (
      <section className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
          <BookOpen size={20} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Book not found
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          The book you're looking for doesn't exist.
        </p>

        <Link
          to="/student/books"
          className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-cyan-700"
        >
          <ArrowLeft size={14} />
          Back to books
        </Link>
      </section>
    );
  }

  const isAvailable = book.availableCopies > 0;

  const handleBorrow = () => {
    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    setError("");

    /*
      Backend integration later:

      POST /api/borrows

      {
        bookId,
        dueDate
      }
    */

    setBorrowed(true);
    setShowBorrowPanel(false);
  };

  if (borrowed) {
    return (
      <section className="mx-auto max-w-2xl border border-slate-200 bg-white px-6 py-12 text-center sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={27} />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Borrowing confirmed
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {book.title} is now yours.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Your book has been added to your current borrowing
          list. Please return it by your selected due date.
        </p>

        <div className="mx-auto mt-6 max-w-sm border border-slate-200 bg-slate-50 p-4 text-left">
          <div className="flex items-center gap-3">
            <CalendarDays
              size={17}
              className="text-cyan-700"
            />

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Due date
              </p>

              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {new Date(dueDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/student/my-books"
            className="inline-flex items-center justify-center bg-[#102022] px-5 py-3 text-xs font-semibold text-white hover:bg-cyan-800"
          >
            Go to My Books
          </Link>

          <Link
            to="/student/books"
            className="inline-flex items-center justify-center border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-700 hover:border-slate-300"
          >
            Browse more books
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">

      {/* BACK */}
      <Link
        to="/student/books"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-cyan-700"
      >
        <ArrowLeft size={15} />
        Back to library
      </Link>

      {/* DETAILS */}
      <section className="border border-slate-200 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">

          {/* COVER */}
          <div className="bg-slate-100 p-5 sm:p-8 lg:p-10">
            <div className="mx-auto aspect-[3/4] max-w-[270px] overflow-hidden shadow-sm">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* INFORMATION */}
          <div className="flex flex-col p-6 sm:p-8 lg:p-10">

            <div>
              <span className="inline-flex bg-cyan-50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-700">
                {book.category}
              </span>

              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {book.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <UserRound size={16} />
                {book.author}
              </div>
            </div>

            <div className="my-7 h-px bg-slate-100" />

            {/* DESCRIPTION */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                About this book
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {book.description}
              </p>
            </div>

            {/* META */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="border border-slate-200 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Published
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {book.publishedYear}
                </p>
              </div>

              <div className="border border-slate-200 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total copies
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {book.totalCopies}
                </p>
              </div>

              <div className="col-span-2 border border-slate-200 p-4 sm:col-span-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Availability
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    isAvailable
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  {isAvailable
                    ? `${book.availableCopies} available`
                    : "Currently unavailable"}
                </p>
              </div>
            </div>

            {/* BORROW ACTION */}
            <div className="mt-8 border-t border-slate-100 pt-6">

              {!showBorrowPanel ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 size={15} />
                    Maximum 3 active borrowed books
                  </div>

                 {isAvailable ? (
  <button
    type="button"
    onClick={() => {
      setShowBorrowPanel(true);
      setError("");
    }}
    className="px-3.5 py-2 text-xs font-semibold bg-[#102022] text-white transition hover:bg-cyan-800"
  >
    Borrow this book
  </button>
) : (
  <button
    type="button"
    disabled
    className="cursor-not-allowed bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-400"
  >
    Unavailable
  </button>
)}
                </div>
              ) : (
                <div className="border border-cyan-100 bg-cyan-50/50 p-5">

                  <div className="flex items-start gap-3">
                    <CalendarDays
                      size={18}
                      className="mt-0.5 shrink-0 text-cyan-700"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Select your due date
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Choose the date when you plan to return
                        this book.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 max-w-sm">
                    <label
                      htmlFor="dueDate"
                      className="mb-1.5 block text-xs font-medium text-slate-700"
                    >
                      Due date
                    </label>

                    <input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(event) => {
                        setDueDate(event.target.value);
                        setError("");
                      }}
                      className="h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-600"
                    />

                    {error && (
                      <p className="mt-2 text-xs text-red-600">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleBorrow}
                      className="bg-[#102022] px-5 py-2.5 text-xs font-semibold text-white hover:bg-cyan-800"
                    >
                      Confirm borrow
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowBorrowPanel(false);
                        setError("");
                      }}
                      className="border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:border-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookDetails;