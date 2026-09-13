import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RotateCcw,
  AlertTriangle,
  History,
} from "lucide-react";

import API from "../../services/api";

const tabs = [
  {
    id: "current",
    label: "Current",
    icon: Clock3,
  },
  {
    id: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
  },
  {
    id: "returned",
    label: "Returned",
    icon: History,
  },
];

function MyBooks() {
  const [activeTab, setActiveTab] = useState("current");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState("");
  const [returnError, setReturnError] = useState("");

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/borrows/my");

        const borrows = response.data?.borrows || [];

        const formattedBooks = borrows.map((borrow) => {
          const isOverdue =
            borrow.status === "overdue" ||
            (
              borrow.status === "borrowed" &&
              new Date(borrow.dueDate) < new Date() &&
              !borrow.returnDate
            );

          let status = "current";

          if (borrow.status === "returned") {
            status = "returned";
          } else if (isOverdue) {
            status = "overdue";
          }

          return {
            id: borrow._id,
            title:
              borrow.book?.title ||
              "Unknown Book",
            category:
              borrow.book?.category ||
              "General",
            cover:
              borrow.book?.coverImage?.url ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
            borrowedDate: formatDate(
              borrow.borrowDate
            ),
            dueDate: formatDate(
              borrow.dueDate
            ),
            returnedDate: borrow.returnDate
              ? formatDate(borrow.returnDate)
              : null,
            status,
          };
        });

        setBooks(formattedBooks);
      } catch (err) {
        console.error(
          "Failed to load my books:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load your books"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, []);

  const counts = useMemo(
    () => ({
      current: books.filter(
        (book) => book.status === "current"
      ).length,

      overdue: books.filter(
        (book) => book.status === "overdue"
      ).length,

      returned: books.filter(
        (book) => book.status === "returned"
      ).length,
    }),
    [books]
  );

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) => book.status === activeTab
      ),
    [books, activeTab]
  );

  const handleReturn = async (bookId) => {
    try {
      setReturningId(bookId);
      setReturnError("");

      const response = await API.put(
        `/borrows/${bookId}/return`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to return book"
        );
      }

      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book.id === bookId
            ? {
                ...book,
                status: "returned",
                returnedDate: formatDate(
                  new Date()
                ),
              }
            : book
        )
      );

      setActiveTab("returned");
    } catch (err) {
      console.error(
        "Failed to return book:",
        err
      );

      setReturnError(
        err.response?.data?.message ||
          err.message ||
          "Failed to return the book"
      );
    } finally {
      setReturningId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-5 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700" />

            <p className="mt-3 text-sm text-slate-500">
              Loading your books...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-5 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md border border-red-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#102022]">
              Unable to load your books
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f7f7f4]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                <BookOpen size={14} />
                Your Library
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#102022] sm:text-4xl">
                My Books
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Keep track of the books you have
                borrowed, their due dates, and your
                borrowing history.
              </p>
            </div>

            <div className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-3">
              <BookOpen
                size={18}
                className="text-cyan-700"
              />

              <div>
                <p className="text-xs text-slate-400">
                  Total activity
                </p>

                <p className="text-sm font-bold text-[#102022]">
                  {books.length}{" "}
                  {books.length === 1
                    ? "book"
                    : "books"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Error */}
        {returnError && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
            <AlertTriangle
              size={17}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-xs font-bold text-red-800">
                Return failed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                {returnError}
              </p>
            </div>
          </div>
        )}

        {/* Summary */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Clock3}
            label="Currently Borrowed"
            value={counts.current}
            description="Books with you"
          />

          <SummaryCard
            icon={AlertTriangle}
            label="Overdue"
            value={counts.overdue}
            description="Need your attention"
            warning
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Returned"
            value={counts.returned}
            description="Completed borrows"
          />
        </section>

        {/* Tabs */}
        <section className="mb-6 border-b border-slate-200">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`relative flex shrink-0 items-center gap-2 pb-4 text-sm font-semibold transition ${
                    isActive
                      ? "text-[#102022]"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />

                  {tab.label}

                  <span
                    className={`min-w-6 px-1.5 py-0.5 text-[11px] font-bold ${
                      isActive
                        ? "bg-[#102022] text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {counts[tab.id]}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-cyan-700" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Books */}
        {filteredBooks.length > 0 ? (
          <section className="space-y-4">
            {filteredBooks.map((book) => (
              <BookRow
                key={book.id}
                book={book}
                onReturn={handleReturn}
                returningId={returningId}
              />
            ))}
          </section>
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  warning = false,
}) {
  return (
    <div
      className={`border bg-white p-5 ${
        warning && value > 0
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#102022]">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center ${
            warning && value > 0
              ? "bg-amber-50 text-amber-600"
              : "bg-cyan-50 text-cyan-700"
          }`}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function BookRow({
  book,
  onReturn,
  returningId,
}) {
  const isReturned =
    book.status === "returned";

  const isOverdue =
    book.status === "overdue";

  const isReturning =
    returningId === book.id;

  return (
    <article
      className={`border bg-white p-4 sm:p-5 ${
        isOverdue
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Cover */}
        <div className="h-40 w-28 shrink-0 overflow-hidden bg-slate-100">
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src =
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80";
            }}
          />
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {book.category}
              </span>

              <h2 className="mt-2 text-xl font-bold text-[#102022]">
                {book.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Library Collection
              </p>
            </div>

            <StatusBadge
              status={book.status}
            />
          </div>

          {/* Dates */}
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <DateInfo
              icon={CalendarDays}
              label="Borrowed"
              value={book.borrowedDate}
            />

            <DateInfo
              icon={CalendarDays}
              label={
                isReturned
                  ? "Due date"
                  : "Due"
              }
              value={book.dueDate}
              warning={isOverdue}
            />

            {isReturned && (
              <DateInfo
                icon={CheckCircle2}
                label="Returned"
                value={book.returnedDate}
              />
            )}
          </div>

          {/* Overdue warning */}
          {isOverdue && (
            <div className="mt-4 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle
                size={17}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <p className="text-xs font-bold text-amber-800">
                  This book is overdue
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Please return this book as
                  soon as possible to avoid
                  further overdue issues.
                </p>
              </div>
            </div>
          )}

          {/* Action */}
          {!isReturned && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onReturn(book.id)
                }
                disabled={isReturning}
                className="inline-flex items-center gap-2 bg-[#102022] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw
                  size={15}
                  className={
                    isReturning
                      ? "animate-spin"
                      : ""
                  }
                />

                {isReturning
                  ? "Returning..."
                  : "Return Book"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function DateInfo({
  icon: Icon,
  label,
  value,
  warning = false,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center ${
          warning
            ? "bg-amber-50 text-amber-600"
            : "bg-slate-50 text-slate-500"
        }`}
      >
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p
          className={`mt-0.5 text-sm font-semibold ${
            warning
              ? "text-amber-700"
              : "text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    current: {
      label: "Currently Borrowed",
      className:
        "bg-cyan-50 text-cyan-700",
      icon: Clock3,
    },

    overdue: {
      label: "Overdue",
      className:
        "bg-amber-50 text-amber-700",
      icon: AlertTriangle,
    },

    returned: {
      label: "Returned",
      className:
        "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
  };

  const item =
    config[status] || config.current;

  const Icon = item.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide ${item.className}`}
    >
      <Icon size={13} />
      {item.label}
    </span>
  );
}

function EmptyState({ activeTab }) {
  const messages = {
    current: {
      title: "No books currently borrowed",
      description:
        "Books you borrow will appear here along with their due dates.",
    },

    overdue: {
      title: "No overdue books",
      description:
        "Great! You have no overdue books that need your attention.",
    },

    returned: {
      title: "No returned books yet",
      description:
        "Your completed borrowing history will appear here.",
    },
  };

  const message = messages[activeTab];

  return (
    <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center bg-slate-50 text-slate-400">
        <BookOpen size={21} />
      </div>

      <h2 className="mt-4 text-base font-bold text-[#102022]">
        {message.title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {message.description}
      </p>
    </div>
  );
}

export default MyBooks;