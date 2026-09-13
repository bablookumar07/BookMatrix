import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Filter,
  MoreVertical,
  Library,
  AlertTriangle,
} from "lucide-react";

import API from "../../services/api";

function BooksManagement() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All Categories");
  const [availability, setAvailability] =
    useState("All");
  const [menuOpen, setMenuOpen] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] =
    useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/books");

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to fetch books"
          );
        }

        const apiBooks =
          response.data?.books || [];

        const normalizedBooks = apiBooks.map(
          (book) => ({
            id: book._id,
            title: book.title || "Untitled Book",
            author: book.author || "—",
            category:
              book.category || "General",
            totalCopies: Number(
              book.totalCopies || 0
            ),
            availableCopies: Number(
              book.availableCopies || 0
            ),
            cover:
              book.coverImage?.url || "",
          })
        );

        setBooks(normalizedBooks);
      } catch (err) {
        console.error(
          "Failed to fetch admin books:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load books"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        books
          .map((book) => book.category)
          .filter(Boolean)
      ),
    ];

    return [
      "All Categories",
      ...uniqueCategories,
    ];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title
          .toLowerCase()
          .includes(query) ||
        book.author
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All Categories" ||
        book.category === category;

      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" &&
          book.availableCopies > 0) ||
        (availability === "Unavailable" &&
          book.availableCopies === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    books,
    search,
    category,
    availability,
  ]);

  const totalCopies = useMemo(
    () =>
      books.reduce(
        (total, book) =>
          total + book.totalCopies,
        0
      ),
    [books]
  );

  const availableCopies = useMemo(
    () =>
      books.reduce(
        (total, book) =>
          total + book.availableCopies,
        0
      ),
    [books]
  );

  const unavailableBooks = useMemo(
    () =>
      books.filter(
        (book) => book.availableCopies === 0
      ).length,
    [books]
  );

  const handleDelete = async (bookId) => {
    const book = books.find(
      (item) => item.id === bookId
    );

    if (!book) {
      return;
    }

    setDeleteError("");

    const confirmed = window.confirm(
      `Delete "${book.title}" from the library?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(bookId);

      const response = await API.delete(
        `/books/${bookId}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to delete book"
        );
      }

      setBooks((currentBooks) =>
        currentBooks.filter(
          (item) => item.id !== bookId
        )
      );

      setMenuOpen(null);
    } catch (err) {
      console.error(
        "Failed to delete book:",
        err
      );

      setDeleteError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete book"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700" />

            <p className="mt-3 text-sm text-slate-500">
              Loading library collection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-[#f7f7f4]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md border border-red-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#102022]">
              Unable to load books
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
        <section className="mb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                <Library size={14} />
                Library Inventory
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#102022] sm:text-4xl">
                Books
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your library collection,
                copies, and availability.
              </p>
            </div>

            <Link
              to="/admin/books/add"
              className="inline-flex w-fit items-center gap-2 bg-[#102022] px-4 py-3 text-xs font-bold text-white transition hover:bg-cyan-800"
            >
              <Plus size={16} />
              Add New Book
            </Link>
          </div>
        </section>

        {/* Delete Error */}
        {deleteError && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3">
            <AlertTriangle
              size={17}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="min-w-0">
              <p className="text-xs font-bold text-red-800">
                Action failed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                {deleteError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDeleteError("")}
              className="ml-auto text-xs font-semibold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Overview */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InventoryStat
            label="Titles"
            value={books.length}
          />

          <InventoryStat
            label="Total Copies"
            value={totalCopies}
          />

          <InventoryStat
            label="Available"
            value={availableCopies}
          />

          <InventoryStat
            label="Unavailable"
            value={unavailableBooks}
            warning
          />
        </section>

        {/* Filters */}
        <section className="mb-6 border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Filter
              size={15}
              className="text-cyan-700"
            />

            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Search & Filter
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_180px]">
            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by title or author..."
                className="h-11 w-full border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-700"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="h-11 border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-cyan-700"
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            {/* Availability */}
            <select
              value={availability}
              onChange={(event) =>
                setAvailability(
                  event.target.value
                )
              }
              className="h-11 border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-cyan-700"
            >
              <option value="All">
                All Availability
              </option>

              <option value="Available">
                Available
              </option>

              <option value="Unavailable">
                Unavailable
              </option>
            </select>
          </div>
        </section>

        {/* Results */}
        <section className="border border-slate-200 bg-white">
          {/* Table header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-[#102022]">
                Library Collection
              </h2>

              <p className="mt-1 text-[11px] text-slate-400">
                Showing {filteredBooks.length} of{" "}
                {books.length} titles
              </p>
            </div>
          </div>

          {filteredBooks.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <TableHead>
                        Book
                      </TableHead>

                      <TableHead>
                        Category
                      </TableHead>

                      <TableHead>
                        Copies
                      </TableHead>

                      <TableHead>
                        Availability
                      </TableHead>

                      <TableHead align="right">
                        Actions
                      </TableHead>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBooks.map(
                      (book) => (
                        <BookTableRow
                          key={book.id}
                          book={book}
                          menuOpen={menuOpen}
                          setMenuOpen={
                            setMenuOpen
                          }
                          onDelete={
                            handleDelete
                          }
                          deletingId={
                            deletingId
                          }
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredBooks.map(
                  (book) => (
                    <MobileBookCard
                      key={book.id}
                      book={book}
                      menuOpen={menuOpen}
                      setMenuOpen={
                        setMenuOpen
                      }
                      onDelete={handleDelete}
                      deletingId={
                        deletingId
                      }
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <EmptyState
              hasFilters={
                Boolean(search.trim()) ||
                category !==
                  "All Categories" ||
                availability !== "All"
              }
              onClear={() => {
                setSearch("");
                setCategory(
                  "All Categories"
                );
                setAvailability("All");
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function InventoryStat({
  label,
  value,
  warning = false,
}) {
  return (
    <div
      className={`border bg-white p-4 ${
        warning && value > 0
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          warning && value > 0
            ? "text-amber-700"
            : "text-[#102022]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TableHead({
  children,
  align = "left",
}) {
  return (
    <th
      className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function BookTableRow({
  book,
  menuOpen,
  setMenuOpen,
  onDelete,
  deletingId,
}) {
  const isAvailable =
    book.availableCopies > 0;

  const isDeleting =
    deletingId === book.id;

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-10 shrink-0 overflow-hidden bg-slate-100">
            <BookCover
              src={book.cover}
              title={book.title}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#102022]">
              {book.title}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {book.author}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
          {book.category}
        </span>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-700">
          {book.availableCopies}
          <span className="font-normal text-slate-400">
            {" "}
            / {book.totalCopies}
          </span>
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          available
        </p>
      </td>

      <td className="px-5 py-4">
        <AvailabilityBadge
          available={isAvailable}
        />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end">
          <ActionMenu
            book={book}
            isOpen={
              menuOpen === book.id
            }
            isDeleting={isDeleting}
            onToggle={() =>
              setMenuOpen(
                menuOpen === book.id
                  ? null
                  : book.id
              )
            }
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}

function MobileBookCard({
  book,
  menuOpen,
  setMenuOpen,
  onDelete,
  deletingId,
}) {
  const isAvailable =
    book.availableCopies > 0;

  const isDeleting =
    deletingId === book.id;

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <div className="h-24 w-16 shrink-0 overflow-hidden bg-slate-100">
          <BookCover
            src={book.cover}
            title={book.title}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[#102022]">
                {book.title}
              </h3>

              <p className="mt-1 truncate text-xs text-slate-400">
                {book.author}
              </p>
            </div>

            <ActionMenu
              book={book}
              isOpen={
                menuOpen === book.id
              }
              isDeleting={isDeleting}
              onToggle={() =>
                setMenuOpen(
                  menuOpen === book.id
                    ? null
                    : book.id
                )
              }
              onDelete={onDelete}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
              {book.category}
            </span>

            <AvailabilityBadge
              available={isAvailable}
            />

            <span className="text-[10px] font-medium text-slate-400">
              {book.availableCopies} /{" "}
              {book.totalCopies} copies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookCover({ src, title }) {
  const fallback =
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80";

  return (
    <img
      src={src || fallback}
      alt={`${title} cover`}
      className="h-full w-full object-cover"
      onError={(event) => {
        if (
          event.currentTarget.src !== fallback
        ) {
          event.currentTarget.src =
            fallback;
        }
      }}
    />
  );
}

function AvailabilityBadge({
  available,
}) {
  return (
    <span
      className={`inline-flex px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
        available
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      {available
        ? "Available"
        : "Unavailable"}
    </span>
  );
}

function ActionMenu({
  book,
  isOpen,
  isDeleting,
  onToggle,
  onDelete,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={isDeleting}
        className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Actions for ${book.title}`}
      >
        <MoreVertical size={17} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-20 w-40 border border-slate-200 bg-white py-1 shadow-lg">
          <Link
            to={`/admin/books/edit/${book.id}`}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-cyan-700"
            onClick={onToggle}
          >
            <Pencil size={14} />
            Edit Book
          </Link>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() =>
              onDelete(book.id)
            }
            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={14} />

            {isDeleting
              ? "Deleting..."
              : "Delete Book"}
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center bg-slate-50 text-slate-400">
        <BookOpen size={21} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#102022]">
        No books found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-400">
        {hasFilters
          ? "Try changing your search or filters to find books in the collection."
          : "There are no books in the library collection yet."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 text-xs font-semibold text-cyan-700 hover:text-cyan-800"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

export default BooksManagement;