import { useState } from "react";
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

function Profile() {
  const [showPassword, setShowPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("New password must contain at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    setMessage("Password update will be connected when backend integration is added.");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
                    AS
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#102022]">
                      Alex Sharma
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Student
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
                    value="Alex Sharma"
                  />

                  <InfoField
                    icon={Mail}
                    label="Email Address"
                    value="alex.sharma@example.com"
                  />

                  <InfoField
                    icon={ShieldCheck}
                    label="Account Role"
                    value="Student"
                  />

                  <InfoField
                    icon={BookOpen}
                    label="Member Since"
                    value="January 2026"
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

              <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <StatItem
                  icon={Clock3}
                  label="Current"
                  value="2"
                />

                <StatItem
                  icon={AlertTriangle}
                  label="Overdue"
                  value="1"
                  warning
                />

                <StatItem
                  icon={CheckCircle2}
                  label="Returned"
                  value="14"
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
                      Update your account password.
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
                  onToggle={() => setShowPassword((current) => !current)}
                />

                <div className="mt-4">
                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword((current) => !current)}
                  />
                </div>

                <div className="mt-4">
                  <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword((current) => !current)}
                  />
                </div>

                {message && (
                  <div className="mt-4 border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-medium leading-5 text-cyan-800">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#102022] px-4 py-3 text-xs font-bold text-white transition hover:bg-cyan-800"
                >
                  <Save size={15} />
                  Update Password
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