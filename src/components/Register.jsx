import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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

const FieldIcon = ({ type }) => {
  const base = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "#00e5a0", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "ph-input-icon" };
  if (type === "name") return (
    <svg {...base}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  if (type === "email") return (
    <svg {...base}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
  if (type === "phone") return (
    <svg {...base}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
  return (
    <svg {...base}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
};

const STRENGTH_LEVELS = [
  { label: "Weak",   modifier: "weak" },
  { label: "Fair",   modifier: "fair" },
  { label: "Good",   modifier: "good" },
  { label: "Strong", modifier: "strong" },
];

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STEPS = ["Account", "Verify", "Protect"];

const FIELDS = [
  { name: "name",  label: "Full Name",     type: "text",  placeholder: "Name",               icon: "name"  },
  { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com",    icon: "email" },
  { name: "phone", label: "Phone Number",  type: "tel",   placeholder: "+1 (555) 000-0000",  icon: "phone" },
];

export default function Register() {

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/api/auth');
  };

  const homepage = () => {
    navigate('/');
  };

  const strength = form.password ? getStrength(form.password) : 0;
  const strengthInfo = strength > 0 ? STRENGTH_LEVELS[strength - 1] : null;

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(
      "https://phishhunterai.onrender.com/api/register",
      {
        name: form.name,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
      }
    );

    console.log("Registration success:", response.data);

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    setAgreed(false);
    setShowPass(false);
    setFocused("");
  } catch (error) {
    console.error(
      "Registration error:",
      error.response?.data || error.message
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="ph-page">
      {/* Background grid */}
      <div className="ph-grid-overlay" />

      {/* Glow blobs */}
      <div className="ph-blob ph-blob--top-right" />
      <div className="ph-blob ph-blob--bottom-left" />

      {/* ── Navbar ── */}
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
          <button className="ph-btn-outline" onClick={handleClick}>Sign In</button>
          <button className="ph-btn-primary" onClick={homepage}>Home Page</button>
        </div>
      </nav>

      {/* ── Card ── */}
      <div className="ph-card-wrapper ph-card-wrapper--register">
        <div className="ph-card ph-card--register">

          {/* Badge */}
          <div className="ph-badge ph-badge--register">
            <span className="ph-badge__dot">✦</span> Powered by Advanced AI
          </div>

          {/* Shield icon ring */}
          <div className="ph-icon-ring ph-icon-ring--register">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>

          <h1 className="ph-heading ph-heading--register">
            Create Your <span className="ph-accent">Account</span>
          </h1>
          <p className="ph-subtext ph-subtext--register">
            Start protecting yourself from phishing attacks
          </p>

          {/* Steps progress */}
          <div className="ph-steps">
            {STEPS.map((step, i) => (
              <div key={step} className="ph-step-item">
                <div className={`ph-step-dot${i === 0 ? " ph-step-dot--active" : ""}`}>
                  {i + 1}
                </div>
                <span className={`ph-step-label${i === 0 ? " ph-step-label--active" : ""}`}>
                  {step}
                </span>
                {i < STEPS.length - 1 && <div className="ph-step-line" />}
              </div>
            ))}
          </div>

          {/* ── Form ── */}
          <form className="ph-form ph-form--register" onSubmit={handleSubmit}>

            {/* Text / email / phone fields */}
            {FIELDS.map(({ name, label, type, placeholder, icon }) => (
              <div key={name} className="ph-field-group ph-field-group--tight">
                <label className="ph-label">{label}</label>
                <div className={`ph-input-wrap${focused === name ? " ph-input-wrap--focused" : ""}`}>
                  <FieldIcon type={icon} />
                  <input
                    type={type}
                    name={name}
                    className="ph-input"
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    onFocus={() => setFocused(name)}
                    onBlur={() => setFocused("")}
                    required
                  />
                  {form[name] && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#00e5a0">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" stroke="#020d0a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            ))}

            {/* Password */}
            <div className="ph-field-group ph-field-group--tight">
              <label className="ph-label">Password</label>
              <div className={`ph-input-wrap${focused === "password" ? " ph-input-wrap--focused" : ""}`}>
                <FieldIcon type="password" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="ph-input"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required
                />
                <button type="button" className="ph-eye-btn" onClick={() => setShowPass(!showPass)}>
                  <EyeIcon show={showPass} />
                </button>
              </div>

              {/* Strength meter */}
              {form.password && strengthInfo && (
                <div className="ph-strength-wrap">
                  <div className="ph-strength-bar">
                    <div className={`ph-strength-fill ph-strength-fill--${strengthInfo.modifier}`} />
                  </div>
                  <span className={`ph-strength-label ph-strength-label--${strengthInfo.modifier}`}>
                    {strengthInfo.label}
                  </span>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="ph-terms-row">
              <div
                className={`ph-checkbox${agreed ? " ph-checkbox--checked" : ""}`}
                onClick={() => setAgreed(!agreed)}
                role="checkbox"
                aria-checked={agreed}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " && setAgreed(!agreed)}
              >
                {agreed && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#020d0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="ph-terms-text">
                I agree to the{" "}
                <a href="#" className="ph-terms-link">Terms of Service</a> and{" "}
                <a href="#" className="ph-terms-link">Privacy Policy</a>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="ph-submit-btn ph-submit-btn--register"
              disabled={loading || !agreed}
            >
              {loading ? (
                <span className="ph-loading-row">
                  <span className="ph-spinner" /> Creating Account...
                </span>
              ) : (
                <>
                  <svg className="ph-submit-btn__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Start Protection — It's Free
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="ph-divider ph-divider--register">
            <div className="ph-divider__line" />
            <span className="ph-divider__text">or</span>
            <div className="ph-divider__line" />
          </div>

          {/* Login link */}
          <p className="ph-switch-text ph-switch-text--register">
            Already have an account?{" "}
            <a href="#" className="ph-switch-link" onClick={handleClick}>Sign in →</a>
          </p>

          {/* Trust badges */}
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