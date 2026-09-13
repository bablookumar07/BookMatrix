import { useCallback, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import IntroAnimation from "./components/common/IntroAnimation";

import Login from "./pages/auth/Login";
import LoginPortal from "./pages/auth/LoginPortal";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./pages/auth/ProtectedRoute";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Books from "./pages/student/Books";
import BookDetails from "./pages/student/BookDetails";
import MyBooks from "./pages/student/MyBooks";
import Profile from "./pages/student/Profile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BooksManagement from "./pages/admin/BooksManagement";
import AddBook from "./pages/admin/AddBook";
import EditBook from "./pages/admin/EditBook";
import BorrowsManagement from "./pages/admin/BorrowsManagement";
import UsersManagement from "./pages/admin/UsersManagement";


function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <BrowserRouter>
      {showIntro && (
        <IntroAnimation
          onComplete={handleIntroComplete}
        />
      )}

      <div
        className={
          showIntro
            ? "app-hidden"
            : "app-visible"
        }
      >
        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
          ===================================================== */}

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<LoginPortal />}
          />

          <Route
            path="/login/student"
            element={<Login />}
          />

          <Route
            path="/login/admin"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />


          {/* =====================================================
              STUDENT PROTECTED ROUTES
          ===================================================== */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["student"]}
              />
            }
          >
            <Route element={<StudentLayout />}>

              <Route
                path="/student/dashboard"
                element={<StudentDashboard />}
              />

              <Route
                path="/student/books"
                element={<Books />}
              />

              <Route
                path="/student/books/:id"
                element={<BookDetails />}
              />

              <Route
                path="/student/my-books"
                element={<MyBooks />}
              />

              <Route
                path="/student/profile"
                element={<Profile />}
              />

            </Route>
          </Route>


          {/* =====================================================
              ADMIN PROTECTED ROUTES
          ===================================================== */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              />
            }
          >
            <Route element={<AdminLayout />}>

              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/books"
                element={<BooksManagement />}
              />

              <Route
                path="/admin/books/add"
                element={<AddBook />}
              />

              <Route
                path="/admin/books/edit/:id"
                element={<EditBook />}
              />

              <Route
                path="/admin/borrows"
                element={<BorrowsManagement />}
              />

              <Route
                path="/admin/users"
                element={<UsersManagement />}
              />

            </Route>
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;