import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Mail,
} from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    /*
      Backend integration will be added later.

      Planned API:
      POST /api/auth/forgot-password
    */

    setSubmitted(true);
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
            LEFT INTRO
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
              ACCOUNT RECOVERY
            </div>

            <h1>
              Lost your
              <span>access?</span>
            </h1>

            <p>
              No problem. Enter the email address connected
              to your Libryo account and we'll help you get
              back into your library.
            </p>

          </div>

          <div className="auth-intro-footer">
            <KeyRound size={14} />
            Secure password recovery
          </div>

        </section>

        {/* =====================================================
            FORGOT PASSWORD CARD
        ===================================================== */}

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
                      Forgot your password?
                    </h2>
                  </div>

                </div>

                <p className="auth-card-description">
                  Enter your registered email address and
                  we'll send you instructions to reset your
                  password.
                </p>

                <form
                  className="auth-form"
                  onSubmit={handleSubmit}
                  noValidate
                >

                  <div className="auth-field">

                    <label htmlFor="email">
                      Email address
                    </label>

                    <div
                      className={`auth-input-wrapper ${
                        error ? "has-error" : ""
                      }`}
                    >
                      <Mail size={18} />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError("");
                        }}
                        placeholder="Enter your email address"
                        autoComplete="email"
                      />
                    </div>

                    {error && (
                      <span className="auth-error">
                        {error}
                      </span>
                    )}

                  </div>

                  <button
                    type="submit"
                    className="auth-submit"
                  >
                    Send reset link
                    <ArrowRight size={17} />
                  </button>

                </form>

                <div className="auth-register">
                  <span>
                    Remember your password?
                  </span>

                  <Link to="/login">
                    Sign in
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="auth-success-icon">
                  <Mail size={24} />
                </div>

                <div className="auth-success-content">

                  <span className="auth-card-label">
                    CHECK YOUR INBOX
                  </span>

                  <h2>
                    Reset link requested
                  </h2>

                  <p>
                    If an account exists for{" "}
                    <strong>{email}</strong>, password
                    reset instructions will be sent to
                    that address.
                  </p>

                </div>

                <div className="auth-form-message">
                  The email-sending service will be connected
                  during backend integration.
                </div>

                <Link
                  to="/login"
                  className="auth-back-link"
                >
                  <ArrowLeft size={16} />
                  Back to sign in
                </Link>

              </>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default ForgotPassword;