import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0c0b09;
    --surface:   #141210;
    --border:    #2a2520;
    --amber:     #c9933a;
    --amber-dim: #a07428;
    --text:      #e8e0d4;
    --muted:     #6b6259;
    --input-bg:  #181510;
    --error:     #c0503a;
    --success:   #5a9e6f;
  }

  html, body { height: 100%; }

  .rc-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .rc-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 80% 20%, rgba(201,147,58,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 20% 80%, rgba(201,147,58,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
  .rc-corner {
    position: fixed;
    width: 80px;
    height: 80px;
    pointer-events: none;
    opacity: 0.35;
  }
  .rc-corner--tl { top: 24px; left: 24px; border-top: 1px solid var(--amber); border-left: 1px solid var(--amber); }
  .rc-corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid var(--amber); border-right: 1px solid var(--amber); }
  .rc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 440px;
    padding: 48px 44px 44px;
    position: relative;
    animation: rc-fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .rc-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
  }
  @keyframes rc-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rc-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .rc-brand-gem {
    width: 20px; height: 20px;
    background: var(--amber);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    flex-shrink: 0;
    animation: rc-spin 8s linear infinite;
  }
  @keyframes rc-spin { to { transform: rotate(360deg); } }
  .rc-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400;
    letter-spacing: 0.12em; color: var(--text); text-transform: uppercase;
  }
  .rc-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 300;
    color: var(--text); letter-spacing: 0.02em; margin-bottom: 6px; line-height: 1.1;
  }
  .rc-sub { font-size: 13px; color: var(--muted); margin-bottom: 32px; font-weight: 300; letter-spacing: 0.02em; }
  .rc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .rc-field { position: relative; margin-bottom: 16px; }
  .rc-label {
    display: block; font-size: 11px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 8px; font-weight: 500; transition: color 0.2s;
  }
  .rc-field:focus-within .rc-label { color: var(--amber); }
  .rc-input {
    width: 100%; background: var(--input-bg); border: 1px solid var(--border);
    color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 300; padding: 13px 16px; outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    -webkit-appearance: none; border-radius: 0;
  }
  .rc-input::placeholder { color: var(--muted); }
  .rc-input:focus { border-color: var(--amber-dim); box-shadow: 0 0 0 3px rgba(201,147,58,0.08); }
  .rc-input.error { border-color: var(--error); box-shadow: 0 0 0 3px rgba(192,80,58,0.08); }
  .rc-input.success { border-color: var(--success); }
  .rc-error-msg { font-size: 11px; color: var(--error); margin-top: 5px; letter-spacing: 0.03em; }
  .rc-strength { margin-top: 8px; display: flex; gap: 4px; align-items: center; }
  .rc-strength-bar { flex: 1; height: 2px; background: var(--border); transition: background 0.3s; border-radius: 2px; }
  .rc-strength-bar.active-weak   { background: var(--error); }
  .rc-strength-bar.active-fair   { background: #c9933a; }
  .rc-strength-bar.active-strong { background: var(--success); }
  .rc-strength-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); min-width: 44px; text-align: right; }
  .rc-terms { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 24px; margin-top: 4px; }
  .rc-checkbox {
    width: 15px; height: 15px; border: 1px solid var(--border);
    background: var(--input-bg); flex-shrink: 0; margin-top: 1px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, background 0.2s;
  }
  .rc-checkbox.checked { border-color: var(--amber); background: rgba(201,147,58,0.15); }
  .rc-checkbox svg { display: none; }
  .rc-checkbox.checked svg { display: block; }
  .rc-terms-text { font-size: 12px; color: var(--muted); line-height: 1.6; letter-spacing: 0.02em; }
  .rc-terms-text a { color: var(--amber); text-decoration: none; transition: opacity 0.2s; }
  .rc-terms-text a:hover { opacity: 0.8; }
  .rc-btn {
    width: 100%; padding: 14px; background: var(--amber); color: #0c0b09;
    border: none; font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden;
    transition: background 0.25s, transform 0.15s, opacity 0.2s; border-radius: 0;
  }
  .rc-btn:hover { background: #d9a44a; }
  .rc-btn:active { transform: scale(0.99); }
  .rc-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .rc-api-error {
    background: rgba(192,80,58,0.1); border: 1px solid rgba(192,80,58,0.3);
    color: #e08080; border-radius: 4px; padding: 10px 14px;
    font-size: 13px; margin-bottom: 16px; letter-spacing: 0.02em;
  }
  .rc-footer { margin-top: 28px; text-align: center; font-size: 12px; color: var(--muted); letter-spacing: 0.03em; }
  .rc-footer a { color: var(--amber); text-decoration: none; transition: opacity 0.2s; }
  .rc-footer a:hover { opacity: 0.8; }
`;

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function strengthLabel(score) {
  if (score === 0) return "";
  if (score <= 1) return "Weak";
  if (score <= 2) return "Fair";
  return "Strong";
}

function strengthClass(score, bar) {
  if (score === 0) return "";
  if (score <= 1 && bar === 1) return "active-weak";
  if (score === 2 && bar <= 2) return "active-fair";
  if (score >= 3 && bar <= score) return "active-strong";
  return "";
}

function Register() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "",
  });
  const [agreed, setAgreed]     = useState(false);
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState("");   // ✅ Add
  const [loading, setLoading]   = useState(false); // ✅ Add
  const [submitted, setSubmitted] = useState(false);
  const navigate                = useNavigate();   // ✅ Add

  const strength = getStrength(form.password);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    if (!agreed) e.terms = "You must accept the terms";
    return e;
  };

  // ✅ Replaced empty handleSubmit with real registration
  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setApiError("");
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", {
        username: form.email,   // use email as username
        email:    form.email,
        password: form.password,
        first_name: form.firstName,
        last_name:  form.lastName,
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const canSubmit = agreed && !loading;

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="rc-root">
          <div className="rc-corner rc-corner--tl" />
          <div className="rc-corner rc-corner--br" />
          <div className="rc-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 24 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: "0 auto 16px" }}>
                <circle cx="24" cy="24" r="23" stroke="#c9933a" strokeWidth="1" />
                <path d="M14 24l7 7 13-14" stroke="#c9933a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="rc-heading">Account created</h1>
            <p className="rc-sub" style={{ marginBottom: 32 }}>
              Welcome, {form.firstName}. You can now sign in.
            </p>
            <a href="/login" style={{ color: "var(--amber)", fontSize: 13, letterSpacing: "0.06em", textDecoration: "none" }}>
              Continue to login →
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="rc-root">
        <div className="rc-corner rc-corner--tl" />
        <div className="rc-corner rc-corner--br" />

        <div className="rc-card">
          <div className="rc-brand">
            <div className="rc-brand-gem" />
            <span className="rc-brand-name">ResumeAI</span>
          </div>

          <h1 className="rc-heading">Create account</h1>
          <p className="rc-sub">Join us — it only takes a moment</p>

          {/* ✅ API error */}
          {apiError && <div className="rc-api-error">{apiError}</div>}

          <div className="rc-row">
            <div className="rc-field">
              <label className="rc-label">First name</label>
              <input
                className={`rc-input${errors.firstName ? " error" : form.firstName ? " success" : ""}`}
                type="text" placeholder="Jane"
                value={form.firstName} onChange={set("firstName")}
              />
              {errors.firstName && <div className="rc-error-msg">{errors.firstName}</div>}
            </div>
            <div className="rc-field">
              <label className="rc-label">Last name</label>
              <input
                className={`rc-input${errors.lastName ? " error" : form.lastName ? " success" : ""}`}
                type="text" placeholder="Doe"
                value={form.lastName} onChange={set("lastName")}
              />
              {errors.lastName && <div className="rc-error-msg">{errors.lastName}</div>}
            </div>
          </div>

          <div className="rc-field">
            <label className="rc-label">Email address</label>
            <input
              className={`rc-input${errors.email ? " error" : form.email ? " success" : ""}`}
              type="email" placeholder="you@example.com"
              value={form.email} onChange={set("email")}
            />
            {errors.email && <div className="rc-error-msg">{errors.email}</div>}
          </div>

          <div className="rc-field">
            <label className="rc-label">Password</label>
            <input
              className={`rc-input${errors.password ? " error" : ""}`}
              type="password" placeholder="Min. 8 characters"
              value={form.password} onChange={set("password")}
            />
            {form.password && (
              <div className="rc-strength">
                {[1, 2, 3, 4].map((bar) => (
                  <div key={bar} className={`rc-strength-bar ${strengthClass(strength, bar)}`} />
                ))}
                <span className="rc-strength-label">{strengthLabel(strength)}</span>
              </div>
            )}
            {errors.password && <div className="rc-error-msg">{errors.password}</div>}
          </div>

          <div className="rc-field">
            <label className="rc-label">Confirm password</label>
            <input
              className={`rc-input${errors.confirm ? " error" : form.confirm && form.confirm === form.password ? " success" : ""}`}
              type="password" placeholder="Repeat password"
              value={form.confirm} onChange={set("confirm")}
            />
            {errors.confirm && <div className="rc-error-msg">{errors.confirm}</div>}
          </div>

          <div className="rc-terms">
            <div
              className={`rc-checkbox${agreed ? " checked" : ""}`}
              onClick={() => setAgreed((v) => !v)}
              role="checkbox" aria-checked={agreed} tabIndex={0}
              onKeyDown={(e) => e.key === " " && setAgreed((v) => !v)}
            >
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5l2.5 2.5L8 1" stroke="#c9933a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="rc-terms-text">
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </span>
          </div>
          {errors.terms && (
            <div className="rc-error-msg" style={{ marginTop: -10, marginBottom: 16 }}>
              {errors.terms}
            </div>
          )}

          <button className="rc-btn" onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="rc-footer">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;