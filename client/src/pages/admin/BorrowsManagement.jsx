import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  RotateCcw,
  Search,
  Users,
  X,
} from "lucide-react";

import API from "../../services/api";

const statusOptions = [
  { value: "ALL", label: "All records" },
  { value: "BORROWED", label: "Active" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "RETURNED", label: "Returned" },
];

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const normalizeStatus = (status) => {
  const value = String(
    status || ""
  ).toLowerCase();

  if (value === "returned") {
    return "RETURNED";
  }

  if (value === "overdue") {
    return "OVERDUE";
  }

  return "BORROWED";
};

const getStatusLabel = (status) => {
  switch (status) {
    case "BORROWED":
      return "Active";

    case "OVERDUE":
      return "Overdue";

    case "RETURNED":
      return "Returned";

    default:
      return status;
  }
};

const getStatusClasses = (status) => {
  switch (status) {
    case "BORROWED":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";

    case "OVERDUE":
      return "border-red-200 bg-red-50 text-red-700";

    case "RETURNED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

const getInitials = (name) => {
  if (!name) {
    return "ST";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const normalizeBorrow = (borrow) => {
  return {
    id: borrow._id,

    student: {
      name:
        borrow.user?.name ||
        "Unknown Student",
      email:
        borrow.user?.email ||
        "No email available",
      initials: getInitials(
        borrow.user?.name
      ),
    },

    book: {
      title:
        borrow.book?.title ||
        "Unknown Book",
      category:
        borrow.book?.category ||
        "Library",
      cover:
        borrow.book?.coverImage?.url ||
        "",
    },

    borrowDate: borrow.borrowDate,
    dueDate: borrow.dueDate,
    returnDate: borrow.returnDate,
    status: normalizeStatus(
      borrow.status
    ),
  };
};

function StatusBadge({ status }) {
  const Icon =
    status === "OVERDUE"
      ? AlertTriangle
      : status === "RETURNED"
      ? CheckCircle2
      : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${getStatusClasses(
        status
      )}`}
    >
      <Icon size={12} />
      {getStatusLabel(status)}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-cyan-700">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function ReturnModal({
  borrow,
  onClose,
  onConfirm,
  loading,
}) {
  if (!borrow) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-md border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">
              Return book
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Confirm return
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="flex gap-4 border border-slate-200 bg-slate-50 p-4">
            <div className="h-20 w-14 shrink-0 overflow-hidden bg-slate-200">
              {borrow.book.cover ? (
                <img
                  src={borrow.book.cover}
                  alt={borrow.book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <BookOpen size={18} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-slate-900">
                {borrow.book.title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {borrow.book.category}
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Borrowed by{" "}
                <span className="font-semibold text-slate-800">
                  {borrow.student.name}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 border-l-2 border-amber-400 bg-amber-50 px-4 py-3">
            <p className="text-xs leading-5 text-amber-800">
              Marking this book as returned will
              close the active borrow record. The
              borrowing history will remain
              available.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-[#102022] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <RotateCcw size={14} />
            )}

            {loading
              ? "Returning..."
              : "Confirm return"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BorrowsManagement() {
  const [borrows, setBorrows] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedBorrow, setSelectedBorrow] =
    useState(null);

  const [showStatusMenu, setShowStatusMenu] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [returning, setReturning] =
    useState(false);

  const [error, setError] =
    useState("");

  const [returnError, setReturnError] =
    useState("");

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          "/borrows"
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to fetch borrow records"
          );
        }

        const records =
          response.data?.borrows || [];

        setBorrows(
          records.map(normalizeBorrow)
        );
      } catch (err) {
        console.error(
          "Failed to fetch borrow records:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load borrow records"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  const filteredBorrows = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return borrows.filter((borrow) => {
      const matchesSearch =
        !query ||
        borrow.student.name
          .toLowerCase()
          .includes(query) ||
        borrow.student.email
          .toLowerCase()
          .includes(query) ||
        borrow.book.title
          .toLowerCase()
          .includes(query) ||
        borrow.id
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        borrow.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    borrows,
    search,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: borrows.length,

      active: borrows.filter(
        (item) =>
          item.status === "BORROWED"
      ).length,

      overdue: borrows.filter(
        (item) =>
          item.status === "OVERDUE"
      ).length,

      returned: borrows.filter(
        (item) =>
          item.status === "RETURNED"
      ).length,
    };
  }, [borrows]);

  const selectedStatusLabel =
    statusOptions.find(
      (option) =>
        option.value === statusFilter
    )?.label || "All records";

  const handleReturn = async () => {
    if (!selectedBorrow) {
      return;
    }

    try {
      setReturning(true);
      setReturnError("");

      const response = await API.put(
        `/borrows/${selectedBorrow.id}/return`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to return book"
        );
      }

      const returnedBorrow =
        response.data?.borrow;

      setBorrows((current) =>
        current.map((borrow) =>
          borrow.id === selectedBorrow.id
            ? {
                ...borrow,
                status: "RETURNED",
                returnDate:
                  returnedBorrow?.returnDate ||
                  new Date().toISOString(),
              }
            : borrow
        )
      );

      setSelectedBorrow(null);
    } catch (err) {
      console.error(
        "Failed to return book:",
        err
      );

      setReturnError(
        err.response?.data?.message ||
          err.message ||
          "Failed to return book"
      );
    } finally {
      setReturning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700" />

          <p className="mt-3 text-sm text-slate-500">
            Loading borrow records...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md border border-red-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center bg-red-50 text-red-600">
            <AlertTriangle size={20} />
          </div>

          <h2 className="mt-4 text-base font-bold text-[#102022]">
            Unable to load borrow records
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
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* PAGE INTRO */}
        <section className="border border-slate-200 bg-white px-5 py-6 sm:px-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-cyan-700">
                <BookOpen size={16} />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Circulation
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Borrow management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor active loans, overdue
                books and returned borrowing
                records across the library.
              </p>
            </div>

            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2">
              <Users
                size={16}
                className="text-cyan-700"
              />

              <span className="text-xs font-medium text-slate-600">
                {stats.total} total records
              </span>
            </div>
          </div>
        </section>

        {/* RETURN ERROR */}
        {returnError && (
          <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
            <AlertTriangle
              size={17}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="min-w-0">
              <p className="text-xs font-bold text-red-800">
                Return failed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                {returnError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setReturnError("")}
              className="ml-auto text-xs font-semibold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="All records"
            value={stats.total}
            description="Total borrowing history"
          />

          <StatCard
            icon={Clock3}
            label="Active"
            value={stats.active}
            description="Currently borrowed books"
          />

          <StatCard
            icon={AlertTriangle}
            label="Overdue"
            value={stats.overdue}
            description="Requires attention"
          />

          <StatCard
            icon={CheckCircle2}
            label="Returned"
            value={stats.returned}
            description="Completed borrowings"
          />
        </section>

        {/* FILTER BAR */}
        <section className="border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search student, book or borrow ID..."
                className="h-11 w-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:bg-white"
              />
            </div>

            {/* STATUS FILTER */}
            <div className="relative lg:w-52">
              <button
                type="button"
                onClick={() =>
                  setShowStatusMenu(
                    (current) => !current
                  )
                }
                className="flex h-11 w-full items-center justify-between border border-slate-200 bg-white px-3.5 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <span>
                  {selectedStatusLabel}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition ${
                    showStatusMenu
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full border border-slate-200 bg-white p-1 shadow-lg">
                  {statusOptions.map(
                    (option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(
                            option.value
                          );
                          setShowStatusMenu(
                            false
                          );
                        }}
                        className={`flex w-full items-center px-3 py-2.5 text-left text-xs font-medium transition ${
                          statusFilter ===
                          option.value
                            ? "bg-slate-100 text-cyan-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {(search ||
            statusFilter !== "ALL") && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Active filters
              </span>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                >
                  Search: {search}
                  <X size={12} />
                </button>
              )}

              {statusFilter !== "ALL" && (
                <button
                  type="button"
                  onClick={() =>
                    setStatusFilter("ALL")
                  }
                  className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                >
                  {selectedStatusLabel}
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </section>

        {/* TABLE */}
        <section className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Borrow records
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredBorrows.length}{" "}
                of {borrows.length} records
              </p>
            </div>

            {stats.overdue > 0 && (
              <div className="hidden items-center gap-2 text-xs font-medium text-red-600 sm:flex">
                <AlertTriangle size={14} />
                {stats.overdue} overdue
              </div>
            )}
          </div>

          {filteredBorrows.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
                <Search size={20} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No borrow records found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Try changing your search term or
                removing the selected filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 text-xs font-semibold text-cyan-700 hover:text-cyan-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Student
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Book
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Borrowed
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Due date
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Returned
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBorrows.map(
                      (borrow) => (
                        <tr
                          key={borrow.id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                        >
                          {/* STUDENT */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#102022] text-[10px] font-bold text-cyan-200">
                                {
                                  borrow.student
                                    .initials
                                }
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-slate-800">
                                  {
                                    borrow
                                      .student
                                      .name
                                  }
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                  {
                                    borrow
                                      .student
                                      .email
                                  }
                                </p>

                                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-300">
                                  {borrow.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* BOOK */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-9 shrink-0 overflow-hidden bg-slate-100">
                                {borrow.book
                                  .cover ? (
                                  <img
                                    src={
                                      borrow
                                        .book
                                        .cover
                                    }
                                    alt={
                                      borrow
                                        .book
                                        .title
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <BookOpen
                                      size={15}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[190px] truncate text-xs font-semibold text-slate-800">
                                  {
                                    borrow
                                      .book
                                      .title
                                  }
                                </p>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                  {
                                    borrow
                                      .book
                                      .category
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* BORROW DATE */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <CalendarDays
                                size={14}
                                className="text-slate-400"
                              />

                              {formatDate(
                                borrow.borrowDate
                              )}
                            </div>
                          </td>

                          {/* DUE DATE */}
                          <td className="px-5 py-4">
                            <div
                              className={`flex items-center gap-2 text-xs font-medium ${
                                borrow.status ===
                                "OVERDUE"
                                  ? "text-red-600"
                                  : "text-slate-600"
                              }`}
                            >
                              <CalendarDays
                                size={14}
                              />

                              {formatDate(
                                borrow.dueDate
                              )}
                            </div>
                          </td>

                          {/* RETURN DATE */}
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDate(
                              borrow.returnDate
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                borrow.status
                              }
                            />
                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4 text-right">
                            {borrow.status !==
                            "RETURNED" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedBorrow(
                                    borrow
                                  )
                                }
                                className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                              >
                                <RotateCcw
                                  size={13}
                                />
                                Return
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300">
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET CARDS */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredBorrows.map(
                  (borrow) => (
                    <article
                      key={borrow.id}
                      className="p-4 sm:p-5"
                    >
                      <div className="flex gap-4">
                        <div className="h-24 w-16 shrink-0 overflow-hidden bg-slate-100">
                          {borrow.book
                            .cover ? (
                            <img
                              src={
                                borrow
                                  .book
                                  .cover
                              }
                              alt={
                                borrow
                                  .book
                                  .title
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <BookOpen
                                size={20}
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {
                                  borrow
                                    .book
                                    .title
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  borrow
                                    .book
                                    .category
                                }
                              </p>
                            </div>

                            <StatusBadge
                              status={
                                borrow.status
                              }
                            />
                          </div>

                          <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#102022] text-[9px] font-bold text-cyan-200">
                              {
                                borrow.student
                                  .initials
                              }
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-700">
                                {
                                  borrow
                                    .student
                                    .name
                                }
                              </p>

                              <p className="truncate text-[10px] text-slate-400">
                                {
                                  borrow
                                    .student
                                    .email
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-3">
                        <div className="bg-white p-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Borrowed
                          </p>

                          <p className="mt-1 text-xs font-medium text-slate-700">
                            {formatDate(
                              borrow.borrowDate
                            )}
                          </p>
                        </div>

                        <div className="bg-white p-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Due date
                          </p>

                          <p
                            className={`mt-1 text-xs font-medium ${
                              borrow.status ===
                              "OVERDUE"
                                ? "text-red-600"
                                : "text-slate-700"
                            }`}
                          >
                            {formatDate(
                              borrow.dueDate
                            )}
                          </p>
                        </div>

                        <div className="bg-white p-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Returned
                          </p>

                          <p className="mt-1 text-xs font-medium text-slate-700">
                            {formatDate(
                              borrow.returnDate
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-300">
                          {borrow.id}
                        </p>

                        {borrow.status !==
                          "RETURNED" && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedBorrow(
                                borrow
                              )
                            }
                            className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                          >
                            <RotateCcw
                              size={13}
                            />
                            Mark returned
                          </button>
                        )}
                      </div>
                    </article>
                  )
                )}
              </div>
            </>
          )}
        </section>

        {/* OVERDUE NOTE */}
        {stats.overdue > 0 && (
          <section className="border border-red-200 bg-red-50/70 px-5 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-xs font-semibold text-red-800">
                  Overdue records need attention
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700/80">
                  There are currently{" "}
                  {stats.overdue} overdue{" "}
                  {stats.overdue === 1
                    ? "record"
                    : "records"}.
                  Overdue status is determined by
                  the server based on the due date.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* RETURN CONFIRMATION */}
      <ReturnModal
        borrow={selectedBorrow}
        onClose={() => {
          if (!returning) {
            setSelectedBorrow(null);
          }
        }}
        onConfirm={handleReturn}
        loading={returning}
      />
    </>
  );
}