
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./auth.css";

function LoginLogo() {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="authCyan" x1="15" y1="15" x2="85" y2="85">
          <stop offset="0%" stopColor="#e5ffff" />
          <stop offset="45%" stopColor="#58e4fc" />
          <stop offset="100%" stopColor="#1488a8" />
        </linearGradient>

        <linearGradient id="authMetal" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#b5d6e3" />
          <stop offset="70%" stopColor="#f8ffff" />
          <stop offset="100%" stopColor="#719faf" />
        </linearGradient>

        <filter id="authGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer hexagon */}
      <path
        d="M50 5L87 27V73L50 95L13 73V27L50 5Z"
        stroke="url(#authCyan)"
        strokeWidth="2"
        filter="url(#authGlow)"
      />

      <path
        d="M50 14L79 31V69L50 86L21 69V31L50 14Z"
        stroke="#42d9f5"
        strokeWidth="1"
        opacity=".55"
      />

      {/* Inner architecture */}
      <path
        d="M50 20L72 33L50 46L28 33L50 20Z"
        fill="#103a4b"
        stroke="#7defff"
        strokeWidth="1.5"
      />

      <path
        d="M28 33L50 46V78L28 65V33Z"
        fill="#082532"
        stroke="#54dff7"
        strokeWidth="1.3"
      />

      <path
        d="M50 46L72 33V65L50 78V46Z"
        fill="#061a25"
        stroke="#32cce9"
        strokeWidth="1.3"
      />

      {/* Book */}
      <path
        d="M32 53L43 47L49 50V70L42 67L32 71V53Z"
        fill="url(#authMetal)"
        stroke="#e9ffff"
        strokeWidth="1.5"
      />

      <path
        d="M51 50L57 47L68 53V71L58 67L51 70V50Z"
        fill="url(#authMetal)"
        stroke="#e9ffff"
        strokeWidth="1.5"
      />

      <path
        d="M50 49V71"
        stroke="#ffffff"
        strokeWidth="2"
      />

      {/* Digital core */}
      <circle cx="50" cy="28" r="2" fill="#ffffff" />
      <circle cx="43" cy="32" r="1.5" fill="#62ebff" />
      <circle cx="57" cy="34" r="1.5" fill="#62ebff" />

      <path
        d="M50 28L43 32L50 36L57 34L50 28Z"
        stroke="#53e7ff"
        strokeWidth="1"
      />
    </svg>
  );
}

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      form: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      Backend integration will be connected later.

      Planned API:
      POST /api/auth/login

      Body:
      {
        email,
        password
      }

      The same login flow will handle both
      student and admin users.
    */

    setErrors({
      form: "Login interface is ready. Authentication will be connected in the integration phase.",
    });
  };

  return (
    <div className="auth-page">

      {/* Background architecture */}
      <div className="auth-background-grid" />
      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />

      <div className="auth-floating-node auth-node-one" />
      <div className="auth-floating-node auth-node-two" />
      <div className="auth-floating-node auth-node-three" />

      <main className="auth-container">

        {/* Left side */}
        <section className="auth-intro">

          <Link to="/" className="auth-brand">
            <LoginLogo />

            <div>
              <strong>LIBRYO</strong>

              <span>
                DIGITAL LIBRARY
              </span>
            </div>
          </Link>

          <div className="auth-intro-content">

            <div className="auth-kicker">
              <span />
              CAMPUS LIBRARY ACCESS
            </div>

            <h1>
              Welcome
              <span>back.</span>
            </h1>

            <p>
              Continue your library journey. Discover books,
              manage your borrowing and stay connected with
              your campus library.
            </p>

          </div>

          <div className="auth-intro-footer">
            <ShieldCheck size={15} />
            <span>
              Secure access for students and administrators
            </span>
          </div>

        </section>


        {/* Right side */}
        <section className="auth-card-wrapper">

          <div className="auth-card">

            <div className="auth-card-header">

              <div className="auth-card-icon">
                <LockKeyhole size={19} />
              </div>

              <div>
                <span className="auth-card-label">
                  ACCOUNT ACCESS
                </span>

                <h2>
                  Sign in to Libryo
                </h2>
              </div>

            </div>


            <p className="auth-card-description">
              Use your registered email and password to
              access your library account.
            </p>


            <form
              className="auth-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* Email */}

              <div className="auth-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div
                  className={`auth-input-wrapper ${
                    errors.email ? "has-error" : ""
                  }`}
                >
                  <Mail size={17} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <span className="auth-error">
                    {errors.email}
                  </span>
                )}

              </div>


              {/* Password */}

              <div className="auth-field">

                <div className="auth-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>

                </div>

                <div
                  className={`auth-input-wrapper ${
                    errors.password ? "has-error" : ""
                  }`}
                >
                  <LockKeyhole size={17} />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <span className="auth-error">
                    {errors.password}
                  </span>
                )}

              </div>


              {/* Form error */}

              {errors.form && (
                <div className="auth-form-message">
                  {errors.form}
                </div>
              )}


              {/* Submit */}

              <button
                type="submit"
                className="auth-submit"
              >
                Sign in
                <ArrowRight size={17} />
              </button>

            </form>


            {/* Register */}

            <div className="auth-register">

              <span>
                Don't have an account?
              </span>

              <Link to="/signup">
                Create an account
              </Link>

            </div>

            <div className="auth-role-note">
              <span className="auth-role-dot" />
              One secure login for students & administrators
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Login;