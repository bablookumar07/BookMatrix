import {
  LayoutDashboard,
  LibraryBig,
  BookOpenCheck,
  UserRound,
  Users,
  ClipboardList,
  Plus,
  LogOut,
  X,
  BookMarked,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({
  role = "student",
  isOpen = false,
  onClose,
  onLogout,
}) {
  const isAdmin = role === "admin";

  const studentLinks = [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Browse Books",
      path: "/student/books",
      icon: LibraryBig,
    },
    {
      label: "My Books",
      path: "/student/my-books",
      icon: BookOpenCheck,
    },
    {
      label: "Profile",
      path: "/student/profile",
      icon: UserRound,
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Books",
      path: "/admin/books",
      icon: LibraryBig,
    },
    {
      label: "Add Book",
      path: "/admin/books/add",
      icon: Plus,
    },
    {
      label: "Borrow Management",
      path: "/admin/borrows",
      icon: ClipboardList,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const handleNavClick = () => {
    // Close mobile drawer after navigation.
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
  className={`
    fixed inset-y-0 left-0 z-50
    flex h-screen w-[270px] flex-col
    bg-[#0d2426] text-white
    transition-transform duration-300 ease-in-out
    ${
      isOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
>
      
        {/* BRAND */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <NavLink
            to={isAdmin ? "/admin/dashboard" : "/student/dashboard"}
            onClick={handleNavClick}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center bg-cyan-700 text-white">
              <BookMarked size={20} />
            </div>

            <div>
              <p className="text-[18px] font-bold tracking-tight">
                Libryo
              </p>

              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                {isAdmin ? "Administration" : "Library Portal"}
              </p>
            </div>
          </NavLink>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION AREA
            Only this area can scroll.
            Sidebar and logout remain fixed. */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 px-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {isAdmin ? "Management" : "Library"}
            </p>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `
                      group flex items-center gap-3 px-3 py-3
                      text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-cyan-800/60 text-white shadow-sm"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          flex h-8 w-8 shrink-0 items-center justify-center
                          ${
                            isActive
                              ? "bg-cyan-700 text-white"
                              : "bg-transparent text-slate-500 group-hover:text-cyan-300"
                          }
                        `}
                      >
                        <Icon size={17} />
                      </span>

                      <span className="truncate">{link.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* FIXED BOTTOM SECTION
            This never scrolls with dashboard content. */}
        <div className="shrink-0 border-t border-white/10 p-3">
          {/* USER AREA */}
          <div className="mb-3 flex items-center gap-3 bg-white/[0.04] px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-xs font-bold text-white">
              {isAdmin ? "A" : "S"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {isAdmin ? "Administrator" : "Student"}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">
                {isAdmin ? "Library Admin" : "Library Member"}
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
              <LogOut size={17} />
            </span>

            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;