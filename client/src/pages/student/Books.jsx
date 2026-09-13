import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import BookCard from "../../components/books/BookCard";
import API from "../../services/api";

const DEFAULT_CATEGORIES = [
  "All Categories",
  "Technology",
  "Finance",
  "Productivity",
  "Self Development",
];

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All Categories");
  const [availability, setAvailability] =
    useState("All");
  const [showFilters, setShowFilters] =
    useState(false);

  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/books");

        const apiBooks =
          response.data?.books || [];

        const normalizedBooks = apiBooks.map(
          (book) => ({
            id: book._id,
            title: book.title,
            description: book.description,
            category: book.category,
            totalCopies: Number(
              book.totalCopies || 0
            ),
            availableCopies: Number(
              book.availableCopies || 0
            ),
            author: book.author || "—",
            cover:
              book.coverImage?.url || "",
          })
        );

        setBooks(normalizedBooks);
      } catch (err) {
        console.error(
          "Failed to fetch books:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load books"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const categories = useMemo(() => {
    const apiCategories = books
      .map((book) => book.category)
      .filter(Boolean);

    const uniqueCategories = [
      ...new Set(apiCategories),
    ];

    const mergedCategories = [
      ...DEFAULT_CATEGORIES.filter(
        (item) => item !== "All Categories"
      ),
      ...uniqueCategories,
    ];

    return [
      "All Categories",
      ...new Set(mergedCategories),
    ];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title
          ?.toLowerCase()
          .includes(query) ||
        book.author
          ?.toLowerCase()
          .includes(query) ||
        book.category
          ?.toLowerCase()
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

  const activeFilterCount =
    (category !== "All Categories" ? 1 : 0) +
    (availability !== "All" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setAvailability("All");
  };

  if (loading) {
    return (
      <div className="space-y-7">
        <section className="border-b border-slate-200 pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Library Catalog
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Find your next book.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Search through the library collection and
            discover books available for borrowing.
          </p>
        </section>

        <section className="flex min-h-[420px] items-center justify-center border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-700" />

            <p className="mt-3 text-sm text-slate-500">
              Loading books...
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-7">
        <section className="border-b border-slate-200 pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Library Catalog
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Find your next book.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Search through the library collection and
            discover books available for borrowing.
          </p>
        </section>

        <section className="border border-red-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-red-200 bg-red-50 text-red-500">
            <BookOpen size={20} />
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-800">
            Unable to load books
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* PAGE INTRO */}
      <section className="border-b border-slate-200 pb-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Library Catalog
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Find your next book.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Search through the library collection and
              discover books available for borrowing.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BookOpen size={15} />
            <span>
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1
                ? "book"
                : "books"}{" "}
              found
            </span>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by title, author or category..."
              className="h-12 w-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:bg-white"
            />
          </div>

          {/* MOBILE FILTER BUTTON */}
          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (previous) => !previous
              )
            }
            className="flex h-12 items-center justify-center gap-2 border border-slate-200 px-4 text-sm font-medium text-slate-700 lg:hidden"
          >
            <SlidersHorizontal size={17} />

            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-700 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* DESKTOP FILTERS */}
          <div className="hidden gap-3 lg:flex">
            {/* CATEGORY */}
            <div className="relative">
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="h-12 min-w-[190px] appearance-none border border-slate-200 bg-white pl-4 pr-10 text-sm text-slate-700 outline-none focus:border-cyan-600"
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

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* AVAILABILITY */}
            <div className="relative">
              <select
                value={availability}
                onChange={(event) =>
                  setAvailability(
                    event.target.value
                  )
                }
                className="h-12 min-w-[155px] appearance-none border border-slate-200 bg-white pl-4 pr-10 text-sm text-slate-700 outline-none focus:border-cyan-600"
              >
                <option value="All">
                  All Books
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* MOBILE FILTER PANEL */}
        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 lg:hidden">
            <label className="text-xs font-medium text-slate-600">
              Category

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="mt-1.5 h-11 w-full border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-600"
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
            </label>

            <label className="text-xs font-medium text-slate-600">
              Availability

              <select
                value={availability}
                onChange={(event) =>
                  setAvailability(
                    event.target.value
                  )
                }
                className="mt-1.5 h-11 w-full border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-600"
              >
                <option value="All">
                  All Books
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>
              </select>
            </label>
          </div>
        )}
      </section>

      {/* ACTIVE FILTERS */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter
            size={14}
            className="text-slate-400"
          />

          {category !== "All Categories" && (
            <button
              type="button"
              onClick={() =>
                setCategory("All Categories")
              }
              className="flex items-center gap-1.5 border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs text-cyan-700"
            >
              {category}
              <span>×</span>
            </button>
          )}

          {availability !== "All" && (
            <button
              type="button"
              onClick={() =>
                setAvailability("All")
              }
              className="flex items-center gap-1.5 border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs text-cyan-700"
            >
              {availability}
              <span>×</span>
            </button>
          )}

          <button
            type="button"
            onClick={clearFilters}
            className="ml-1 text-xs font-semibold text-slate-400 hover:text-cyan-700"
          >
            Clear all
          </button>
        </div>
      )}

      {/* BOOK GRID */}
      {filteredBooks.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </section>
      ) : (
        /* EMPTY STATE */
        <section className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
            <Search size={20} />
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-800">
            No books found
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
            Try a different title, author, category,
            or availability filter.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 text-xs font-semibold text-cyan-700 hover:text-cyan-800"
          >
            Clear all filters
          </button>
        </section>
      )}
    </div>
  );
}

export default Books;