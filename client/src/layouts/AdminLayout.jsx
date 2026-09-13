import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/books": "Books",
    "/admin/books/add": "Add Book",
    "/admin/borrows": "Borrow Management",
    "/admin/users": "Users",
  };

  const isEditPage = location.pathname.startsWith("/admin/books/edit/");

  const title = isEditPage
    ? "Edit Book"
    : pageTitles[location.pathname] || "Libryo";

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f8f7f4]">
      {/* FIXED SIDEBAR */}
      <Sidebar
        role="admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* MAIN SCREEN */}
      <div className="flex h-screen min-w-0 flex-col lg:pl-[270px]">
        {/* HEADER */}
        <div className="shrink-0">
          <Header
            title={title}
            role="admin"
            userName={user?.name || "Administrator"}
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        {/* ONLY CONTENT SCROLLS */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;