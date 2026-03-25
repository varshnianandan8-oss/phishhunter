import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const shieldIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const EyeIcon = ({ show }) =>
  show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://phishhunterai.onrender.com/api/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      alert("Login successfully");
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      setShowPass(false);
      setFocused("");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://phishhunterai.onrender.com/api/logout",
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Logout response:", response.data);

      alert("Logout successfully");
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      setShowPass(false);
      setFocused("");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/api/register");
  };

  const homepage = () => {
    navigate("/");
  };

  return (
    <div className="ph-page">
      <div className="ph-grid-overlay" />

      <div className="ph-blob ph-blob--top-left" />
      <div className="ph-blob ph-blob--bottom-right" />

      <nav className="ph-nav">
        <div className="ph-logo">
          {shieldIcon}
          <span className="ph-logo__text">
            Phish<span className="ph-logo__accent">Hunter</span>
            <span className="ph-logo__ai"> AI</span>
          </span>
        </div>

        <div className="ph-nav__links">
          <a href="#" className="ph-nav__link">Features</a>
          <a href="#" className="ph-nav__link">Pricing</a>
          <a href="#" className="ph-nav__link">Documentation</a>
        </div>

        <div className="ph-nav__actions">
          <button className="ph-btn-outline" onClick={homepage}>Home Page</button>
          {!isLoggedIn && (
            <button className="ph-btn-primary" onClick={handleClick}>Get Started</button>
          )}
          {isLoggedIn && (
            <button className="ph-btn-primary" onClick={handleLogout} disabled={loading}>
              {loading ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>
      </nav>

      <div className="ph-card-wrapper">
        <div className="ph-card">
          <div className="ph-badge">
            <span className="ph-badge__dot">✦</span> Powered by Advanced AI
          </div>

          <div className="ph-icon-ring">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          {!isLoggedIn ? (
            <>
              <h1 className="ph-heading">
                Welcome <span className="ph-accent">Back</span>
              </h1>
              <p className="ph-subtext">Sign in to continue threat protection</p>

              <form className="ph-form" onSubmit={handleSubmit}>
                <div className="ph-field-group">
                  <label className="ph-label">Email Address</label>
                  <div className={`ph-input-wrap${focused === "email" ? " ph-input-wrap--focused" : ""}`}>
                    <svg className="ph-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      className="ph-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      required
                    />
                  </div>
                </div>

                <div className="ph-field-group">
                  <label className="ph-label">Password</label>
                  <div className={`ph-input-wrap${focused === "password" ? " ph-input-wrap--focused" : ""}`}>
                    <svg className="ph-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPass ? "text" : "password"}
                      className="ph-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused("")}
                      required
                    />
                    <button type="button" className="ph-eye-btn" onClick={() => setShowPass(!showPass)}>
                      <EyeIcon show={showPass} />
                    </button>
                  </div>

                  <div className="ph-forgot-row">
                    <a href="#" className="ph-forgot-link">Forgot password?</a>
                  </div>
                </div>

                <button type="submit" className="ph-submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="ph-loading-row">
                      <span className="ph-spinner" /> Authenticating...
                    </span>
                  ) : (
                    <>
                      <svg className="ph-submit-btn__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Sign In Securely
                    </>
                  )}
                </button>
              </form>

              <div className="ph-divider">
                <div className="ph-divider__line" />
                <span className="ph-divider__text">or</span>
                <div className="ph-divider__line" />
              </div>

              <p className="ph-switch-text">
                Don't have an account?{" "}
                <a href="#" className="ph-switch-link" onClick={handleClick}>Create one free →</a>
              </p>
            </>
          ) : (
            <>
              <h1 className="ph-heading">
                Login <span className="ph-accent">Successful</span>
              </h1>
              <p className="ph-subtext">You are signed in and protected now.</p>

              <div className="ph-form">
                <button
                  type="button"
                  className="ph-submit-btn"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="ph-loading-row">
                      <span className="ph-spinner" /> Logging out...
                    </span>
                  ) : (
                    <>
                      <svg
                        className="ph-submit-btn__icon"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </>
                  )}
                </button>
              </div>

              <div className="ph-divider">
                <div className="ph-divider__line" />
                <span className="ph-divider__text">status</span>
                <div className="ph-divider__line" />
              </div>

              <p className="ph-switch-text">
                Session is active. Click logout to clear your secure cookie session.
              </p>
            </>
          )}

          <div className="ph-trust-row">
            {["Real-time Analysis", "AI Powered", "99.9% Accuracy"].map((t) => (
              <span key={t} className="ph-trust-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#00e5a0">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}