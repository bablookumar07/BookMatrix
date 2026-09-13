import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserRound,
  AlertTriangle,
} from "lucide-react";

import API from "../../services/api";

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [showBorrowPanel, setShowBorrowPanel] =
    useState(false);

  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const [borrowed, setBorrowed] = useState(false);
  const [borrowing, setBorrowing] =
    useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const response = await API.get(
          `/books/${id}`
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Book not found"
          );
        }

        const apiBook =
          response.data.book ||
          response.data.data;

        if (!apiBook) {
          throw new Error("Book not found");
        }

        setBook({
          id: apiBook._id,
          title: apiBook.title,
          description:
            apiBook.description || "",
          category:
            apiBook.category || "General",
          totalCopies: Number(
            apiBook.totalCopies || 0
          ),
          availableCopies: Number(
            apiBook.availableCopies || 0
          ),
          cover:
            apiBook.coverImage?.url || "",
          publishedYear:
            apiBook.publishedYear || "—",
          author: apiBook.author || "—",
        });
      } catch (err) {
        console.error(
          "Failed to fetch book:",
          err
        );

        setFetchError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load book"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const isAvailable =
    book && book.availableCopies > 0;

  const handleBorrow = async () => {
    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    const selectedDate = new Date(
      `${dueDate}T23:59:59`
    );

    if (selectedDate <= new Date()) {
      setError(
        "Due date must be in the future."
      );
      return;
    }

    try {
      setBorrowing(true);
      setError("");

      const response = await API.post(
        "/borrows",
        {
          bookId: book.id,
          dueDate,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to borrow book"
        );
      }

      setBorrowed(true);
      setShowBorrowPanel(false);

      setBook((currentBook) => {
        if (!currentBook) {
          return currentBook;
        }

        return {
          ...currentBook,
          availableCopies: Math.max(
            currentBook.availableCopies - 1,
            0
          ),
        };
      });
    } catch (err) {
      console.error(
        "Failed to borrow book:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to borrow this book"
      );
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700" />

          <p className="mt-3 text-sm text-slate-500">
            Loading book details...
          </p>
        </div>
      </section>
    );
  }

  if (fetchError || !book) {
    return (
      <section className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
          <BookOpen size={20} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Book not found
        </h2>

        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
          {fetchError ||
            "The book you're looking for doesn't exist."}
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
          Your book has been added to your current
          borrowing list. Please return it by your
          selected due date.
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
                {new Date(
                  `${dueDate}T00:00:00`
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
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
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                  <BookOpen size={36} />
                </div>
              )}
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
                {book.description ||
                  "No description is available for this book."}
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
                      className="bg-[#102022] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-800"
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
                        Choose the date when you plan
                        to return this book.
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
                      min={today}
                      onChange={(event) => {
                        setDueDate(
                          event.target.value
                        );
                        setError("");
                      }}
                      className="h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-600"
                    />

                    {error && (
                      <div className="mt-2 flex items-start gap-2">
                        <AlertTriangle
                          size={14}
                          className="mt-0.5 shrink-0 text-red-600"
                        />

                        <p className="text-xs text-red-600">
                          {error}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleBorrow}
                      disabled={borrowing}
                      className="inline-flex items-center justify-center gap-2 bg-[#102022] px-5 py-2.5 text-xs font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {borrowing && (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      )}

                      {borrowing
                        ? "Confirming..."
                        : "Confirm borrow"}
                    </button>

                    <button
                      type="button"
                      disabled={borrowing}
                      onClick={() => {
                        setShowBorrowPanel(false);
                        setDueDate("");
                        setError("");
                      }}
                      className="border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
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