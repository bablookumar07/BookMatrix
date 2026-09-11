import {
  BookOpen,
  Users,
  ArrowLeftRight,
  AlertTriangle,
  Plus,
  UserPlus,
  Library,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const recentBorrows = [
  {
    id: 1,
    student: "Alex Sharma",
    book: "The Great Gatsby",
    date: "Today, 10:24 AM",
    status: "Borrowed",
  },
  {
    id: 2,
    student: "Priya Verma",
    book: "Atomic Habits",
    date: "Today, 09:15 AM",
    status: "Returned",
  },
  {
    id: 3,
    student: "Rahul Singh",
    book: "Clean Code",
    date: "Yesterday, 04:42 PM",
    status: "Overdue",
  },
  {
    id: 4,
    student: "Ananya Gupta",
    book: "The Psychology of Money",
    date: "Yesterday, 01:18 PM",
    status: "Borrowed",
  },
];

const popularBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    borrowed: 42,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    borrowed: 36,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    borrowed: 29,
  },
];

function AdminDashboard() {
  return (
    <div className="min-h-full bg-[#f7f7f4]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                <Activity size={14} />
                Library Overview
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#102022] sm:text-4xl">
                Good morning, Admin.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Here's what's happening across your library today.
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

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="Total Books"
            value="156"
            detail="+8 this month"
          />

          <StatCard
            icon={Users}
            label="Total Students"
            value="284"
            detail="+21 this month"
          />

          <StatCard
            icon={ArrowLeftRight}
            label="Active Borrows"
            value="67"
            detail="Currently borrowed"
          />

          <StatCard
            icon={AlertTriangle}
            label="Overdue"
            value="12"
            detail="Needs attention"
            warning
          />
        </section>

        {/* Main grid */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.85fr]">

          {/* Recent activity */}
          <div className="border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-[#102022]">
                  Recent Borrow Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest borrowing and return activity.
                </p>
              </div>

              <Link
                to="/admin/borrows"
                className="hidden items-center gap-1 text-xs font-bold text-cyan-700 transition hover:text-cyan-900 sm:flex"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentBorrows.map((borrow) => (
                <BorrowRow key={borrow.id} borrow={borrow} />
              ))}
            </div>

            <div className="border-t border-slate-100 p-4 sm:hidden">
              <Link
                to="/admin/borrows"
                className="flex items-center justify-center gap-1 text-xs font-bold text-cyan-700"
              >
                View all activity
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Popular books */}
          <div className="border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-base font-bold text-[#102022]">
                Popular Books
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Most borrowed books in the library.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {popularBooks.map((book, index) => (
                <div
                  key={book.title}
                  className="flex items-center gap-4 px-5 py-5 sm:px-6"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#102022] text-xs font-bold text-cyan-300">
                    0{index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#102022]">
                      {book.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {book.author}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#102022]">
                      {book.borrowed}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      borrows
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 p-5">
              <Link
                to="/admin/books"
                className="flex items-center justify-center gap-1 text-xs font-bold text-cyan-700 transition hover:text-cyan-900"
              >
                Manage library
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-6 border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-base font-bold text-[#102022]">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Frequently used library management actions.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <QuickAction
              to="/admin/books/add"
              icon={Plus}
              title="Add Book"
              description="Add a new title to the library"
            />

            <QuickAction
              to="/admin/borrows"
              icon={ArrowLeftRight}
              title="Manage Borrows"
              description="Review active and overdue books"
            />

            <QuickAction
              to="/admin/users"
              icon={UserPlus}
              title="Manage Students"
              description="View and manage library members"
            />
          </div>
        </section>

        {/* Library status */}
        <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="border border-slate-200 bg-[#102022] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Library Capacity
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  82% Available
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/45">
                  128 books are currently available for students.
                </p>
              </div>

              <Library size={22} className="text-cyan-300" />
            </div>

            <div className="mt-6 h-1.5 bg-white/10">
              <div className="h-full w-[82%] bg-cyan-400" />
            </div>
          </div>

          <div className="border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                  Attention Required
                </p>

                <h2 className="mt-3 text-2xl font-bold text-amber-900">
                  12 Overdue Books
                </h2>

                <p className="mt-2 text-xs leading-5 text-amber-700/70">
                  Review overdue borrows and follow up with students.
                </p>
              </div>

              <AlertTriangle
                size={22}
                className="text-amber-600"
              />
            </div>

            <Link
              to="/admin/borrows"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950"
            >
              Review overdue books
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  warning = false,
}) {
  return (
    <div
      className={`border bg-white p-5 ${
        warning && value !== "0"
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-[#102022]">
            {value}
          </p>

          <p
            className={`mt-1 text-[11px] ${
              warning ? "text-amber-600" : "text-slate-400"
            }`}
          >
            {detail}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center ${
            warning
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

function BorrowRow({ borrow }) {
  const statusConfig = {
    Borrowed: "bg-cyan-50 text-cyan-700",
    Returned: "bg-emerald-50 text-emerald-700",
    Overdue: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-xs font-bold text-[#102022]">
        {borrow.student
          .split(" ")
          .map((name) => name[0])
          .join("")
          .slice(0, 2)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#102022]">
          {borrow.student}
        </p>

        <p className="mt-1 truncate text-xs text-slate-400">
          {borrow.book}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
        <p className="text-[10px] text-slate-400">
          {borrow.date}
        </p>

        <span
          className={`mt-1 inline-flex px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${statusConfig[borrow.status]}`}
        >
          {borrow.status}
        </span>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 p-5 transition hover:bg-slate-50 sm:p-6"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-50 text-cyan-700 transition group-hover:bg-cyan-50">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#102022]">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="shrink-0 text-slate-300 transition group-hover:text-cyan-700"
      />
    </Link>
  );
}

export default AdminDashboard;