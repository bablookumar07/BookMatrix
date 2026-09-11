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

const stats = [
  {
    label: "Currently Borrowed",
    value: "2",
    note: "of 3 allowed",
    icon: BookOpen,
  },
  {
    label: "Returned Books",
    value: "14",
    note: "All time",
    icon: RotateCcw,
  },
  {
    label: "Overdue Books",
    value: "1",
    note: "Needs attention",
    icon: Clock3,
  },
  {
    label: "Available Books",
    value: "128",
    note: "In library",
    icon: Library,
  },
];

const currentBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    dueDate: "18 Sep 2026",
    status: "Due soon",
    daysLeft: "6 days left",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    dueDate: "26 Sep 2026",
    status: "On track",
    daysLeft: "14 days left",
    cover:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&q=80",
  },
];

const recentActivity = [
  {
    title: "Returned",
    book: "Clean Code",
    date: "10 Sep 2026",
    icon: CheckCircle2,
  },
  {
    title: "Borrowed",
    book: "Atomic Habits",
    date: "12 Sep 2026",
    icon: BookOpen,
  },
  {
    title: "Borrowed",
    book: "The Psychology of Money",
    date: "12 Sep 2026",
    icon: BookOpen,
  },
  {
    title: "Returned",
    book: "Deep Work",
    date: "04 Sep 2026",
    icon: CheckCircle2,
  },
];

function StudentDashboard() {
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
            Keep track of your borrowed books, upcoming due
            dates, and recent library activity from one place.
          </p>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-300">
            <CalendarDays size={14} />
            Library account active
          </div>

          <div className="inline-flex items-center gap-2 border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-xs text-cyan-200">
            <TrendingUp size={14} />
            14 books returned
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
                  <Icon size={18} strokeWidth={1.7} />
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
              className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-cyan-700"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {currentBooks.map((book) => (
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
                        {book.author}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 text-slate-300 hover:text-slate-600"
                      aria-label={`More options for ${book.title}`}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        book.status === "Due soon"
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

                  <p className="mt-2 text-[11px] text-slate-400">
                    {book.daysLeft}
                  </p>
                </div>
              </div>
            ))}
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
                  16
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Total books borrowed
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">
                  +12%
                </p>

                <p className="text-[10px] text-slate-400">
                  vs. previous month
                </p>
              </div>
            </div>

            {/* Simple activity bars */}
            <div className="mt-8 flex h-36 items-end gap-2 border-b border-slate-100">
              {[38, 58, 45, 72, 54, 82, 66, 91, 73, 100, 78, 88].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group relative flex h-full flex-1 items-end"
                  >
                    <div
                      className="w-full bg-cyan-700/15 transition group-hover:bg-cyan-700/30"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-slate-400">
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
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
            className="text-xs font-medium text-slate-500 hover:text-cyan-700"
          >
            View history
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div
                key={`${activity.book}-${index}`}
                className="flex items-center gap-4 px-5 py-4 sm:px-6"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500">
                  <Icon size={16} strokeWidth={1.7} />
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
          })}
        </div>
      </section>

    </div>
  );
}

export default StudentDashboard;