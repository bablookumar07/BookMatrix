import { Bell, Menu, Search } from "lucide-react";

function Header({
  title = "Dashboard",
  onMenuClick,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  userName = "User",
  role = "student",
}) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-[#f8f7f4]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-600 transition hover:bg-slate-200 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-lg font-bold tracking-tight text-[#102022] sm:text-xl">
            {title}
          </p>

          <p className="hidden text-xs text-slate-500 sm:block">
            {role === "admin"
              ? "Manage your library operations"
              : "Manage your library activity"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        {showSearch && (
          <div className="hidden items-center border border-slate-300 bg-white sm:flex">
            <Search
              size={16}
              className="ml-3 text-slate-400"
            />

            <input
              type="search"
              value={searchValue}
              onChange={(event) =>
                onSearchChange?.(event.target.value)
              }
              placeholder="Search..."
              className="w-36 bg-transparent px-2.5 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 lg:w-52"
            />
          </div>
        )}

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-200 hover:text-[#102022]"
        >
          <Bell size={18} strokeWidth={1.8} />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-600" />
        </button>

        {/* User */}
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#102022] text-xs font-bold text-cyan-300">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden min-w-0 lg:block">
            <p className="max-w-32 truncate text-sm font-semibold text-[#102022]">
              {userName}
            </p>

            <p className="text-[11px] capitalize text-slate-500">
              {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;