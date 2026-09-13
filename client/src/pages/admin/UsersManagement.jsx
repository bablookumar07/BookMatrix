import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  Mail,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import API from "../../services/api";

const roleOptions = [
  {
    value: "ALL",
    label: "All users",
  },
  {
    value: "student",
    label: "Students",
  },
  {
    value: "admin",
    label: "Administrators",
  },
];

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
};

const normalizeUser = (user) => {
  const role = user.role || "student";

  const activeBorrows = Number(
    user.activeBorrowCount ?? user.activeBorrows ?? 0
  );

  return {
    id: user._id || user.id,
    name: user.name || "Unnamed User",
    email: user.email || "—",
    role,
    joinedDate: user.createdAt || user.joinedDate,
    activeBorrows,
    status: user.status || "Active",
    initials: getInitials(user.name),
  };
};

function StatCard({ icon: Icon, label, value, description }) {
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

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-cyan-700">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "admin";

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
        isAdmin
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : "border-cyan-200 bg-cyan-50 text-cyan-700"
      }`}
    >
      {isAdmin ? <ShieldCheck size={12} /> : <User size={12} />}

      {isAdmin ? "Administrator" : "Student"}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {status}
    </span>
  );
}

function DeleteModal({
  user,
  onClose,
  onConfirm,
  deleting = false,
  error = "",
}) {
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const hasActiveBorrows = user.activeBorrows > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-md border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-600">
              Account removal
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Delete user
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#102022] text-xs font-bold text-cyan-200">
              {user.initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user.name}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {user.email}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 border-l-2 border-red-500 bg-red-50 px-4 py-3">
              <p className="text-xs leading-5 text-red-700">{error}</p>
            </div>
          )}

          {isAdmin ? (
            <div className="mt-4 border-l-2 border-red-500 bg-red-50 px-4 py-3">
              <p className="text-xs font-semibold text-red-800">
                Administrator accounts cannot be deleted from this page.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700/80">
                The backend also protects administrator accounts from deletion.
              </p>
            </div>
          ) : hasActiveBorrows ? (
            <div className="mt-4 border-l-2 border-amber-400 bg-amber-50 px-4 py-3">
              <div className="flex gap-2">
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>
                  <p className="text-xs font-semibold text-amber-800">
                    This student has active borrows
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700/80">
                    The account currently has {user.activeBorrows} active{" "}
                    {user.activeBorrows === 1 ? "book" : "books"}. Return those
                    books before deleting the student account.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 border-l-2 border-red-400 bg-red-50 px-4 py-3">
              <p className="text-xs leading-5 text-red-700">
                This action will permanently remove the user from the library
                system. This cannot be undone.
              </p>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isAdmin || hasActiveBorrows || deleting}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Trash2 size={14} />

            {deleting ? "Deleting..." : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/users");

      const apiUsers = response.data?.users || [];

      setUsers(apiUsers.map(normalizeUser));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const students = users.filter((user) => user.role === "student");
    const admins = users.filter((user) => user.role === "admin");

    return {
      total: users.length,
      students: students.length,
      admins: admins.length,
      activeBorrows: students.reduce(
        (total, user) => total + user.activeBorrows,
        0
      ),
    };
  }, [users]);

  const selectedRoleLabel =
    roleOptions.find((option) => option.value === roleFilter)?.label ||
    "All users";

  const openDeleteModal = (user) => {
    setDeleteError("");
    setSelectedUser(user);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setSelectedUser(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    if (selectedUser.role === "admin") {
      return;
    }

    if (selectedUser.activeBorrows > 0) {
      setDeleteError(
        "This student has active borrows and cannot be deleted yet."
      );
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await API.delete(`/admin/users/${selectedUser.id}`);

      setUsers((current) =>
        current.filter((user) => user.id !== selectedUser.id)
      );

      setSelectedUser(null);
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          "Unable to delete this user. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* PAGE INTRO */}
        <section className="border border-slate-200 bg-white px-5 py-6 sm:px-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-cyan-700">
                <Users size={16} />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  User directory
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Users & students
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                View registered library users, monitor active borrowing and
                manage student accounts.
              </p>
            </div>

            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2">
              <Users size={16} className="text-cyan-700" />

              <span className="text-xs font-medium text-slate-600">
                {stats.students} registered students
              </span>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <section className="border-l-2 border-red-500 bg-red-50 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-red-700">{error}</p>

              <button
                type="button"
                onClick={fetchUsers}
                className="self-start text-xs font-semibold text-red-700 underline underline-offset-2 hover:text-red-800 sm:self-auto"
              >
                Retry
              </button>
            </div>
          </section>
        )}

        {/* STATS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total users"
            value={loading ? "—" : stats.total}
            description="All registered accounts"
          />

          <StatCard
            icon={User}
            label="Students"
            value={loading ? "—" : stats.students}
            description="Registered student accounts"
          />

          <StatCard
            icon={ShieldCheck}
            label="Administrators"
            value={loading ? "—" : stats.admins}
            description="Library admin accounts"
          />

          <StatCard
            icon={BookOpen}
            label="Active borrows"
            value={loading ? "—" : stats.activeBorrows}
            description="Books currently with students"
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or user ID..."
                className="h-11 w-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:bg-white"
              />
            </div>

            {/* ROLE FILTER */}
            <div className="relative lg:w-52">
              <button
                type="button"
                onClick={() => setShowRoleMenu((current) => !current)}
                className="flex h-11 w-full items-center justify-between border border-slate-200 bg-white px-3.5 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <span>{selectedRoleLabel}</span>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition ${
                    showRoleMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full border border-slate-200 bg-white p-1 shadow-lg">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setRoleFilter(option.value);
                        setShowRoleMenu(false);
                      }}
                      className={`flex w-full items-center px-3 py-2.5 text-left text-xs font-medium transition ${
                        roleFilter === option.value
                          ? "bg-slate-100 text-cyan-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {(search || roleFilter !== "ALL") && (
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

              {roleFilter !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setRoleFilter("ALL")}
                  className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                >
                  {selectedRoleLabel}
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </section>

        {/* USERS */}
        <section className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Registered users
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {loading
                  ? "Loading users..."
                  : `Showing ${filteredUsers.length} of ${users.length} users`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin border-2 border-slate-200 border-t-cyan-600" />

              <p className="mt-4 text-xs font-medium text-slate-500">
                Loading registered users...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
                <Search size={20} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No users found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Try changing your search term or removing the selected role
                filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("ALL");
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
                <table className="w-full min-w-[950px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        User
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Role
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Joined
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Active borrows
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
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                      >
                        {/* USER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#102022] text-[10px] font-bold text-cyan-200">
                              {user.initials}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-800">
                                {user.name}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5">
                                <Mail
                                  size={11}
                                  className="text-slate-400"
                                />

                                <p className="truncate text-[11px] text-slate-400">
                                  {user.email}
                                </p>
                              </div>

                              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-300">
                                {user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-5 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        {/* JOINED */}
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-600">
                            {formatDate(user.joinedDate)}
                          </p>
                        </td>

                        {/* BORROWS */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <BookOpen
                              size={14}
                              className="text-slate-400"
                            />

                            <span className="text-xs font-medium text-slate-700">
                              {user.activeBorrows}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <StatusBadge status={user.status} />
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">
                          {user.role === "student" ? (
                            <button
                              type="button"
                              onClick={() => openDeleteModal(user)}
                              className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          ) : (
                            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300">
                              Protected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET CARDS */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredUsers.map((user) => (
                  <article key={user.id} className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#102022] text-xs font-bold text-cyan-200">
                        {user.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {user.name}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                              <Mail
                                size={11}
                                className="shrink-0 text-slate-400"
                              />

                              <p className="truncate text-[11px] text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <RoleBadge role={user.role} />
                        </div>

                        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-300">
                          {user.id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-3">
                      <div className="bg-white p-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Joined
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {formatDate(user.joinedDate)}
                        </p>
                      </div>

                      <div className="bg-white p-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Active borrows
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {user.activeBorrows}
                        </p>
                      </div>

                      <div className="bg-white p-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Status
                        </p>

                        <div className="mt-1">
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    </div>

                    {user.role === "student" && (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => openDeleteModal(user)}
                          className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Delete user
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* INFO NOTE */}
        <section className="border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-cyan-700"
            />

            <div>
              <p className="text-xs font-semibold text-slate-800">
                User deletion is protected
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Students with active borrowing records cannot be deleted.
                Administrator accounts are protected by the backend.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* DELETE MODAL */}
      <DeleteModal
        user={selectedUser}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        deleting={deleting}
        error={deleteError}
      />
    </>
  );
}