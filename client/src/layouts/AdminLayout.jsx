import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/books": "Books",
    "/admin/books/add": "Add Book",
    "/admin/borrows": "Borrow Management",
    "/admin/users": "Users",
  };

  const isEditPage = location.pathname.startsWith(
    "/admin/books/edit/"
  );

  const title = isEditPage
    ? "Edit Book"
    : pageTitles[location.pathname] || "Libryo";

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Sidebar
        role="admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => {
          // Backend logout will be connected later.
        }}
      />

      <div className="min-h-screen lg:pl-[270px]">
        <Header
          title={title}
          role="admin"
          userName="Administrator"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;