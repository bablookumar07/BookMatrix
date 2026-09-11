import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setFormMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      newErrors.name = "Please enter your full name.";
    } else if (name.length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (!email) {
      newErrors.email = "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please create a password.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
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
      Backend integration will be added later.

      Planned API:
      POST /api/auth/register
    */

    setFormMessage(
      "Registration form is ready. Account creation will be connected to the backend during integration."
    );
  };

  return (
    <main className="auth-page">
      {/* Background */}
      <div className="auth-background-grid" />

      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />

      <span className="auth-floating-node auth-node-one" />
      <span className="auth-floating-node auth-node-two" />
      <span className="auth-floating-node auth-node-three" />

      <div className="auth-container">

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="auth-intro">

          <Link to="/" className="auth-brand">
            <div>
              <strong>LIBRYO</strong>
              <span>DIGITAL LIBRARY</span>
            </div>
          </Link>

          <div className="auth-intro-content">
            <div className="auth-kicker">
              <span />
              STUDENT REGISTRATION
            </div>

            <h1>
              Your library
              <span>starts here.</span>
            </h1>

            <p>
              Create your Libryo account to discover books,
              manage your borrowing, and stay connected with
              your campus library.
            </p>
          </div>

          <div className="auth-intro-footer">
            <ArrowRight size={14} />
            One account for your complete library experience
          </div>

        </section>

        {/* =====================================================
            SIGNUP CARD
        ===================================================== */}

        <section className="auth-card-wrapper">
          <div className="auth-card">

            <div className="auth-card-header">
              <div className="auth-card-icon">
                <UserRound size={21} />
              </div>

              <div>
                <span className="auth-card-label">
                  NEW ACCOUNT
                </span>

                <h2>Create your Libryo account</h2>
              </div>
            </div>

            <p className="auth-card-description">
              Register as a student using your name,
              email address, and a secure password.
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* Full Name */}

              <div className="auth-field">
                <label htmlFor="name">
                  Full name
                </label>

                <div
                  className={`auth-input-wrapper ${
                    errors.name ? "has-error" : ""
                  }`}
                >
                  <UserRound size={18} />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>

                {errors.name && (
                  <span className="auth-error">
                    {errors.name}
                  </span>
                )}
              </div>

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
                  <Mail size={18} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
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
                <label htmlFor="password">
                  Password
                </label>

                <div
                  className={`auth-input-wrapper ${
                    errors.password ? "has-error" : ""
                  }`}
                >
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <span className="auth-error">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}

              <div className="auth-field">
                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div
                  className={`auth-input-wrapper ${
                    errors.confirmPassword
                      ? "has-error"
                      : ""
                  }`}
                >
                  <LockKeyhole size={18} />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span className="auth-error">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Message */}

              {formMessage && (
                <div className="auth-form-message">
                  {formMessage}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                className="auth-submit"
              >
                Create account
                <ArrowRight size={17} />
              </button>

            </form>

            {/* Login */}

            <div className="auth-register">
              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>
            </div>

            {/* Role note */}

            <div className="auth-role-note">
              <span className="auth-role-dot" />
              Student accounts are created through registration
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Signup;