import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react";

function ResetPassword() {
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Please enter a new password.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your new password.";
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

    if (!validateForm()) return;

    /*
      Backend integration will be added later.

      Planned API:

      POST /api/auth/reset-password

      Expected data will include:
      - token
      - password
    */

    console.log("Reset token:", token);

    setSubmitted(true);
  };

  return (
    <main className="auth-page">
      <div className="auth-background-grid" />

      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />

      <span className="auth-floating-node auth-node-one" />
      <span className="auth-floating-node auth-node-two" />
      <span className="auth-floating-node auth-node-three" />

      <div className="auth-container">

        {/* LEFT SIDE */}
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
              SECURE ACCOUNT ACCESS
            </div>

            <h1>
              Create a new
              <span>password.</span>
            </h1>

            <p>
              Choose a strong password for your Libryo
              account. Once updated, you can use it to
              securely access your library.
            </p>
          </div>

          <div className="auth-intro-footer">
            <LockKeyhole size={14} />
            Your account security matters
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-card-wrapper">
          <div className="auth-card">

            {!submitted ? (
              <>
                <div className="auth-card-header">
                  <div className="auth-card-icon">
                    <KeyRound size={21} />
                  </div>

                  <div>
                    <span className="auth-card-label">
                      PASSWORD RESET
                    </span>

                    <h2>
                      Set a new password
                    </h2>
                  </div>
                </div>

                <p className="auth-card-description">
                  Create a new password for your Libryo
                  account. Make sure both passwords match.
                </p>

                <form
                  className="auth-form"
                  onSubmit={handleSubmit}
                  noValidate
                >

                  {/* PASSWORD */}
                  <div className="auth-field">
                    <label htmlFor="password">
                      New password
                    </label>

                    <div
                      className={`auth-input-wrapper ${
                        errors.password
                          ? "has-error"
                          : ""
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
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="auth-password-toggle"
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

                  {/* CONFIRM PASSWORD */}
                  <div className="auth-field">
                    <label htmlFor="confirmPassword">
                      Confirm new password
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
                        value={
                          formData.confirmPassword
                        }
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
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

                  {/* PASSWORD REQUIREMENT */}
                  <div className="auth-form-message">
                    <strong>Password requirement</strong>
                    <br />
                    Use at least 8 characters and avoid
                    easily guessable passwords.
                  </div>

                  <button
                    type="submit"
                    className="auth-submit"
                  >
                    Update password
                    <ArrowRight size={17} />
                  </button>
                </form>

                <div className="auth-register">
                  <span>Remember your password?</span>
                  <Link to="/login">
                    Sign in
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* SUCCESS STATE */}
                <div className="auth-success-icon">
                  <CheckCircle2 size={25} />
                </div>

                <div className="auth-success-content">
                  <span className="auth-card-label">
                    PASSWORD UPDATED
                  </span>

                  <h2>
                    You're all set.
                  </h2>

                  <p>
                    Your Libryo password has been
                    successfully updated. You can now
                    sign in using your new password.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="auth-submit"
                >
                  Continue to sign in
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/"
                  className="auth-back-link"
                >
                  <ArrowLeft size={16} />
                  Back to Libryo
                </Link>
              </>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

export default ResetPassword;