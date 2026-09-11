import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Library,
  LogOut,
  Menu,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const studentNavigation = [
  {
    label: "Dashboard",
    path: "/student/dashboard",
    icon: BarChart3,
  },
  {
    label: "Browse Books",
    path: "/student/books",
    icon: Library,
  },
  {
    label: "My Books",
    path: "/student/my-books",
    icon: BookOpen,
  },
  {
    label: "Profile",
    path: "/student/profile",
    icon: UserRound,
  },
];

const adminNavigation = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    label: "Books",
    path: "/admin/books",
    icon: Library,
  },
  {
    label: "Borrows",
    path: "/admin/borrows",
    icon: ClipboardList,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

function Sidebar({
  role = "student",
  isOpen = false,
  onClose,
  onLogout,
}) {
  const navigation =
    role === "admin" ? adminNavigation : studentNavigation;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[270px] flex-col
          bg-[#102022] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-cyan-400/30 bg-cyan-400/10">
              <Library size={19} className="text-cyan-300" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">
                Libryo
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Library System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {role === "admin" ? "Administration" : "Library"}
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-3 py-2.5
                    text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }
                  `
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Account */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-bold text-cyan-300">
              {role === "admin" ? "A" : "S"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {role === "admin" ? "Administrator" : "Student"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {role === "admin"
                  ? "Library Admin"
                  : "Library Member"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={17} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;