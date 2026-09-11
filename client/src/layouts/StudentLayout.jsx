import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitles = {
    "/student/dashboard": "Dashboard",
    "/student/books": "Browse Books",
    "/student/my-books": "My Books",
    "/student/profile": "Profile",
  };

  const title = pageTitles[location.pathname] || "Libryo";

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Sidebar
        role="student"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => {
          // Backend logout will be connected later.
        }}
      />

      <div className="min-h-screen lg:pl-[270px]">
        <Header
          title={title}
          role="student"
          userName="Student"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;