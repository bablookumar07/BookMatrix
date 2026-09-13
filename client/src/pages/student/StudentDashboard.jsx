import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Library,
  MoreHorizontal,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

import API from "../../services/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [borrowsResponse, booksResponse] =
          await Promise.all([
            API.get("/borrows/my"),
            API.get("/books"),
          ]);

        setBorrows(
          borrowsResponse.data?.borrows || []
        );

        setBooks(
          booksResponse.data?.books || []
        );
      } catch (err) {
        console.error(
          "Failed to load student dashboard:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const now = new Date();

  const normalizedBorrows = useMemo(() => {
    return borrows.map((borrow) => {
      const dueDate = new Date(borrow.dueDate);

      const isOverdue =
        borrow.status === "borrowed" &&
        dueDate < now &&
        !borrow.returnDate;

      return {
        ...borrow,
        displayStatus: isOverdue
          ? "overdue"
          : borrow.status,
      };
    });
  }, [borrows]);

  const currentBorrows = useMemo(() => {
    return normalizedBorrows.filter(
      (borrow) =>
        borrow.displayStatus === "borrowed" ||
        borrow.displayStatus === "overdue"
    );
  }, [normalizedBorrows]);

  const returnedBorrows = useMemo(() => {
    return normalizedBorrows.filter(
      (borrow) => borrow.displayStatus === "returned"
    );
  }, [normalizedBorrows]);

  const overdueBorrows = useMemo(() => {
    return normalizedBorrows.filter(
      (borrow) => borrow.displayStatus === "overdue"
    );
  }, [normalizedBorrows]);

  const availableCopies = useMemo(() => {
    return books.reduce(
      (total, book) =>
        total + Number(book.availableCopies || 0),
      0
    );
  }, [books]);

  const totalBorrowed = normalizedBorrows.length;

  const formatDate = (date) => {
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
  };

  const getDaysDifference = (dueDate) => {
    const due = new Date(dueDate);

    return Math.ceil(
      (due.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const getDaysLeft = (dueDate) => {
    const days = getDaysDifference(dueDate);

    if (days < 0) {
      const overdueDays = Math.abs(days);

      return `${overdueDays} ${
        overdueDays === 1 ? "day" : "days"
      } overdue`;
    }

    if (days === 0) {
      return "Due today";
    }

    return `${days} ${
      days === 1 ? "day" : "days"
    } left`;
  };

  const getBookStatus = (borrow) => {
    if (borrow.displayStatus === "overdue") {
      return "Overdue";
    }

    const days = getDaysDifference(
      borrow.dueDate
    );

    if (days <= 7) {
      return "Due soon";
    }

    return "On track";
  };

  const getBookCover = (borrow) => {
    return (
      borrow.book?.coverImage?.url ||
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80"
    );
  };

  const currentBooks = useMemo(() => {
    return currentBorrows.slice(0, 3).map((borrow) => ({
      id: borrow._id,
      title:
        borrow.book?.title || "Unknown book",
      category:
        borrow.book?.category || "General",
      dueDate: formatDate(borrow.dueDate),
      status: getBookStatus(borrow),
      daysLeft: getDaysLeft(borrow.dueDate),
      cover: getBookCover(borrow),
    }));
  }, [currentBorrows]);

  const recentActivity = useMemo(() => {
    return [...normalizedBorrows]
      .sort((a, b) => {
        const dateA = new Date(
          a.returnDate || a.borrowDate
        ).getTime();

        const dateB = new Date(
          b.returnDate || b.borrowDate
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 4)
      .map((borrow) => {
        const isReturned =
          borrow.displayStatus === "returned";

        return {
          id: borrow._id,
          title: isReturned
            ? "Returned"
            : borrow.displayStatus === "overdue"
            ? "Overdue"
            : "Borrowed",
          book:
            borrow.book?.title ||
            "Unknown book",
          date: formatDate(
            isReturned
              ? borrow.returnDate
              : borrow.borrowDate
          ),
          icon: isReturned
            ? CheckCircle2
            : BookOpen,
        };
      });
  }, [normalizedBorrows]);

  const monthlyActivity = useMemo(() => {
    const months = [];

    for (let index = 11; index >= 0; index -= 1) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - index,
        1
      );

      months.push({
        month: date.toLocaleDateString(
          "en-US",
          {
            month: "short",
          }
        ),
        year: date.getFullYear(),
        count: 0,
      });
    }

    normalizedBorrows.forEach((borrow) => {
      if (!borrow.borrowDate) {
        return;
      }

      const borrowDate = new Date(
        borrow.borrowDate
      );

      const matchingMonth = months.find(
        (item) =>
          item.month ===
            borrowDate.toLocaleDateString(
              "en-US",
              {
                month: "short",
              }
            ) &&
          item.year ===
            borrowDate.getFullYear()
      );

      if (matchingMonth) {
        matchingMonth.count += 1;
      }
    });

    const maxCount = Math.max(
      ...months.map((item) => item.count),
      1
    );

    return months.map((item) => ({
      ...item,
      height:
        item.count > 0
          ? Math.max(
              (item.count / maxCount) * 100,
              8
            )
          : 2,
    }));
  }, [normalizedBorrows]);

  const stats = [
    {
      label: "Currently Borrowed",
      value: currentBorrows.length,
      note: "of 3 allowed",
      icon: BookOpen,
    },
    {
      label: "Returned Books",
      value: returnedBorrows.length,
      note: "All time",
      icon: RotateCcw,
    },
    {
      label: "Overdue Books",
      value: overdueBorrows.length,
      note:
        overdueBorrows.length > 0
          ? "Needs attention"
          : "You're all clear",
      icon: Clock3,
    },
    {
      label: "Available Books",
      value: availableCopies,
      note: "In library",
      icon: Library,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700" />

          <p className="mt-3 text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md border border-red-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center border border-red-200 bg-red-50 text-red-600">
            <Clock3 size={18} />
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            Unable to load dashboard
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* WELCOME */}
      <section className="relative overflow-hidden border border-slate-200 bg-[#102022] px-6 py-7 text-white sm:px-8 sm:py-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-cyan-300/10" />
        <div className="absolute -right-5 -top-9 h-36 w-36 rounded-full border border-cyan-300/10" />

        <div className="relative max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Student Library
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Keep track of your borrowed books,
            upcoming due dates, and recent library
            activity from one place.
          </p>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-300">
            <CalendarDays size={14} />
            Library account active
          </div>

          <div className="inline-flex items-center gap-2 border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-xs text-cyan-200">
            <TrendingUp size={14} />
            {returnedBorrows.length} books returned
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="border border-slate-200 bg-white p-5 transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600">
                  <Icon
                    size={18}
                    strokeWidth={1.7}
                  />
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-slate-300"
                />
              </div>

              <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {stat.label}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.note}
              </p>
            </div>
          );
        })}
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        {/* CURRENT BOOKS */}
        <div className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Reading now
              </p>

              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Current books
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/student/my-books")
              }
              className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-cyan-700"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {currentBooks.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <BookOpen
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-700">
                  No books currently borrowed
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Browse the library and borrow a
                  book to see it here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/student/books")
                  }
                  className="mt-4 border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Browse books
                </button>
              </div>
            ) : (
              currentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex gap-4 px-5 py-5 sm:px-6"
                >
                  <div className="h-[92px] w-[62px] shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="truncate text-sm font-semibold text-slate-900">
                          {book.title}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          {book.category}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="shrink-0 text-slate-300 hover:text-slate-600"
                        aria-label={`More options for ${book.title}`}
                      >
                        <MoreHorizontal
                          size={18}
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          book.status === "Overdue"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : book.status ===
                                "Due soon"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {book.status}
                      </span>

                      <span className="text-xs text-slate-400">
                        Due {book.dueDate}
                      </span>
                    </div>

                    <p
                      className={`mt-2 text-[11px] ${
                        book.status === "Overdue"
                          ? "font-medium text-red-500"
                          : "text-slate-400"
                      }`}
                    >
                      {book.daysLeft}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BORROWING OVERVIEW */}
        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Overview
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Borrowing activity
            </h3>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-slate-900">
                  {totalBorrowed}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Total books borrowed
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">
                  {returnedBorrows.length > 0
                    ? `${Math.round(
                        (returnedBorrows.length /
                          Math.max(
                            totalBorrowed,
                            1
                          )) *
                          100
                      )}%`
                    : "0%"}
                </p>

                <p className="text-[10px] text-slate-400">
                  returned
                </p>
              </div>
            </div>

            {/* Activity bars */}
            <div className="mt-8 flex h-36 items-end gap-2 border-b border-slate-100">
              {monthlyActivity.map(
                (item, index) => (
                  <div
                    key={`${item.month}-${item.year}`}
                    className="group relative flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full bg-cyan-700/15 transition group-hover:bg-cyan-700/30"
                      style={{
                        height: `${item.height}%`,
                      }}
                      title={`${item.month}: ${item.count} ${
                        item.count === 1
                          ? "book"
                          : "books"
                      }`}
                    />

                    <span className="pointer-events-none absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[9px] text-slate-500 group-hover:block">
                      {item.count}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-slate-400">
              {monthlyActivity.map((item) => (
                <span
                  key={`${item.month}-label`}
                >
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
              History
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Recent activity
            </h3>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/student/my-books")
            }
            className="text-xs font-medium text-slate-500 hover:text-cyan-700"
          >
            View history
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity.length === 0 ? (
            <div className="px-5 py-8 text-center sm:px-6">
              <p className="text-sm text-slate-500">
                No borrowing activity yet.
              </p>
            </div>
          ) : (
            recentActivity.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500">
                    <Icon
                      size={16}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-900">
                        {activity.title}
                      </span>{" "}
                      <span className="text-slate-500">
                        {activity.book}
                      </span>
                    </p>
                  </div>

                  <time className="shrink-0 text-xs text-slate-400">
                    {activity.date}
                  </time>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;