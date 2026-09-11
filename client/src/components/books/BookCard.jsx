import { BookOpen, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

function BookCard({
  book,
  showBorrowButton = true,
  showViewButton = true,
}) {
  const isAvailable = book.availableCopies > 0;

  return (
    <article className="group overflow-hidden border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-md">
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        {book.cover ? (
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
            <BookOpen size={38} strokeWidth={1.4} />
            <span className="mt-2 text-xs">No cover</span>
          </div>
        )}

        {/* Availability */}
        <span
          className={`
            absolute right-3 top-3 border px-2.5 py-1
            text-[11px] font-semibold
            ${
              isAvailable
                ? "border-emerald-200 bg-white/95 text-emerald-700"
                : "border-red-200 bg-white/95 text-red-700"
            }
          `}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
          {book.category}
        </span>

        <h3 className="mt-1.5 line-clamp-2 min-h-[44px] text-base font-bold leading-5 text-[#102022]">
          {book.title}
        </h3>

        {book.author && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <UserRound size={14} />
            <span className="truncate">{book.author}</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-500">
            {book.availableCopies} of {book.totalCopies} copies
          </span>

          <div className="flex items-center gap-2">
            {showViewButton && (
              <Link
                to={`/student/books/${book.id}`}
                className="px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#102022]"
              >
                View
              </Link>
            )}

            {showBorrowButton &&
              (isAvailable ? (
                <Link
                  to={`/student/books/${book.id}`}
                  className="bg-[#102022] px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-900"
                >
                  Borrow
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400"
                >
                  Unavailable
                </button>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default BookCard;