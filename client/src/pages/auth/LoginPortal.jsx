import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const portals = [
  {
    type: "student",
    title: "Student Portal",
    description:
      "Browse the library, borrow books, manage your reading activity and track due dates.",
    icon: BookOpen,
    href: "/login/student",
  },
  {
    type: "admin",
    title: "Admin Portal",
    description:
      "Manage books, students, borrow records and the overall library operation.",
    icon: ShieldCheck,
    href: "/login/admin",
  },
];

export default function LoginPortal() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#102022]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 lg:px-8">
        <div className="grid w-full overflow-hidden border border-slate-200 bg-white lg:grid-cols-[0.85fr_1.15fr]">

          {/* Brand panel */}
          <section className="relative overflow-hidden bg-[#102022] px-8 py-10 text-white sm:px-12 lg:px-10 lg:py-14">
            <div className="relative z-10 flex h-full flex-col justify-between">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center border border-cyan-400/30 bg-cyan-400/10">
                  <BookOpen size={21} className="text-cyan-300" />
                </span>

                <span className="text-xl font-bold tracking-tight">
                  Libryo
                </span>
              </Link>

              <div className="mt-16 lg:mt-0">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Library Management System
                </p>

                <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Choose how you want to access Libryo.
                </h1>

                <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                  A dedicated library experience for students and the
                  administrators who keep it running.
                </p>
              </div>

              <p className="mt-16 text-xs text-slate-500 lg:mt-0">
                © {new Date().getFullYear()} Libryo
              </p>
            </div>

            <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full border border-cyan-400/10" />
            <div className="absolute -bottom-16 -right-12 h-40 w-40 rounded-full border border-cyan-400/10" />
          </section>

          {/* Portal selection */}
          <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="w-full">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Welcome back
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  Select your portal
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose the account type you use to access the library.
                </p>
              </div>

              <div className="space-y-4">
                {portals.map((portal) => {
                  const Icon = portal.icon;

                  return (
                    <Link
                      key={portal.type}
                      to={portal.href}
                      className="group block border border-slate-200 bg-white p-5 transition hover:border-cyan-700 hover:bg-slate-50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-[#102022] transition group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-800">
                          <Icon size={20} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-semibold text-slate-900">
                              {portal.title}
                            </h3>

                            <ArrowRight
                              size={18}
                              className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-cyan-700"
                            />
                          </div>

                          <p className="mt-1.5 text-sm leading-6 text-slate-500">
                            {portal.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-center text-sm text-slate-500">
                  New student?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-cyan-800 hover:text-cyan-950"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}