import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  BookOpen,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  LockKeyhole,
  Eye,
  EyeOff,
  LogOut,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [borrows, setBorrows] = useState([]);
  const [loadingBorrows, setLoadingBorrows] = useState(true);
  const [borrowError, setBorrowError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchBorrowHistory = async () => {
    try {
      setLoadingBorrows(true);
      setBorrowError("");

      const response = await API.get("/borrows/my");

      setBorrows(response.data?.borrows || []);
    } catch (error) {
      setBorrowError(
        error.response?.data?.message ||
          "Unable to load borrowing information."
      );
    } finally {
      setLoadingBorrows(false);
    }
  };

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  const borrowingStats = useMemo(() => {
    let current = 0;
    let overdue = 0;
    let returned = 0;

    borrows.forEach((borrow) => {
      const status = String(borrow.status || "").toLowerCase();

      if (status === "returned") {
        returned += 1;
      } else if (status === "overdue") {
        overdue += 1;
      } else {
        current += 1;
      }
    });

    return {
      current,
      overdue,
      returned,
    };
  }, [borrows]);

  const initials = useMemo(() => {
    const name = user?.name || "Student";

    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U"
    );
  }, [user]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "—";

    const date = new Date(user.createdAt);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  }, [user]);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setMessageType("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage("Please fill in all password fields.");
      setMessageType("error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("New password must contain at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      return;
    }

    /*
      The current backend exposes password reset through:
      /auth/forgot-password
      and /auth/reset-password

      There is currently no authenticated change-password endpoint.
      So we do not send a fake API request here.
    */

    setMessage(
      "Password change is handled through the secure password reset flow. Please use Forgot Password from the login page."
    );
    setMessageType("info");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-full bg-[#f7f7f4]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            <User size={14} />
            Account
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#102022] sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your account information, borrowing overview, and password.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Profile information */}
            <section className="border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="text-base font-bold text-[#102022]">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Your registered library account information.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-[#102022] text-2xl font-bold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-bold text-[#102022]">
                      {user?.name || "Student"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {user?.role === "admin" ? "Administrator" : "Student"}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      <ShieldCheck size={13} />
                      Active Account
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoField
                    icon={User}
                    label="Full Name"
                    value={user?.name || "—"}
                  />

                  <InfoField
                    icon={Mail}
                    label="Email Address"
                    value={user?.email || "—"}
                  />

                  <InfoField
                    icon={ShieldCheck}
                    label="Account Role"
                    value={
                      user?.role
                        ? user.role.charAt(0).toUpperCase() +
                          user.role.slice(1)
                        : "Student"
                    }
                  />

                  <InfoField
                    icon={BookOpen}
                    label="Member Since"
                    value={memberSince}
                  />
                </div>
              </div>
            </section>

            {/* Borrowing overview */}
            <section className="border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="text-base font-bold text-[#102022]">
                  Borrowing Overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  A quick summary of your library activity.
                </p>
              </div>

              {borrowError && (
                <div className="border-b border-red-100 bg-red-50 px-5 py-4 sm:px-6">
                  <p className="text-xs leading-5 text-red-700">
                    {borrowError}
                  </p>

                  <button
                    type="button"
                    onClick={fetchBorrowHistory}
                    className="mt-2 text-xs font-semibold text-red-700 underline underline-offset-2"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <StatItem
                  icon={Clock3}
                  label="Current"
                  value={loadingBorrows ? "—" : borrowingStats.current}
                />

                <StatItem
                  icon={AlertTriangle}
                  label="Overdue"
                  value={loadingBorrows ? "—" : borrowingStats.overdue}
                  warning={borrowingStats.overdue > 0}
                />

                <StatItem
                  icon={CheckCircle2}
                  label="Returned"
                  value={loadingBorrows ? "—" : borrowingStats.returned}
                />
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Security */}
            <section className="border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-cyan-50 text-cyan-700">
                    <LockKeyhole size={17} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#102022]">
                      Security
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Validate your password information.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                <PasswordField
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  showPassword={showPassword}
                  onToggle={() =>
                    setShowPassword((current) => !current)
                  }
                />

                <div className="mt-4">
                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    showPassword={showPassword}
                    onToggle={() =>
                      setShowPassword((current) => !current)
                    }
                  />
                </div>

                <div className="mt-4">
                  <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    showPassword={showPassword}
                    onToggle={() =>
                      setShowPassword((current) => !current)
                    }
                  />
                </div>

                {message && (
                  <div
                    className={`mt-4 border px-4 py-3 text-xs font-medium leading-5 ${
                      messageType === "error"
                        ? "border-red-100 bg-red-50 text-red-700"
                        : "border-cyan-100 bg-cyan-50 text-cyan-800"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#102022] px-4 py-3 text-xs font-bold text-white transition hover:bg-cyan-800"
                >
                  <Save size={15} />
                  Validate Password
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="mt-3 w-full text-center text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                >
                  Use Password Reset Instead
                </button>
              </form>
            </section>

            {/* Account actions */}
            <section className="border border-slate-200 bg-white">
              <div className="p-5 sm:p-6">
                <h2 className="text-base font-bold text-[#102022]">
                  Account Actions
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Sign out of your Libryo account on this device.
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />

        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
  warning = false,
}) {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">
          {label}
        </span>

        <Icon
          size={17}
          className={warning ? "text-amber-600" : "text-cyan-700"}
        />
      </div>

      <p className="mt-3 text-2xl font-bold text-[#102022]">
        {value}
      </p>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  showPassword,
  onToggle,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold text-slate-600"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="h-11 w-full border border-slate-200 bg-white px-3 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-cyan-700"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-slate-400 transition hover:text-slate-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

export default Profile;