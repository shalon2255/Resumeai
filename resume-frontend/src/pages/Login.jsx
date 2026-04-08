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
  }

  html, body { height: 100%; }

  .lc-root {
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
  .lc-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba(201,147,58,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 80% 20%, rgba(201,147,58,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
  .lc-corner {
    position: fixed;
    width: 80px;
    height: 80px;
    pointer-events: none;
    opacity: 0.35;
  }
  .lc-corner--tl { top: 24px; left: 24px; border-top: 1px solid var(--amber); border-left: 1px solid var(--amber); }
  .lc-corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid var(--amber); border-right: 1px solid var(--amber); }
  .lc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 400px;
    padding: 48px 44px 44px;
    position: relative;
    animation: lc-fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .lc-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
  }
  @keyframes lc-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lc-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .lc-brand-gem {
    width: 20px; height: 20px;
    background: var(--amber);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    flex-shrink: 0;
    animation: lc-spin 8s linear infinite;
  }
  @keyframes lc-spin { to { transform: rotate(360deg); } }
  .lc-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400;
    letter-spacing: 0.12em; color: var(--text); text-transform: uppercase;
  }
  .lc-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 300;
    color: var(--text); letter-spacing: 0.02em; margin-bottom: 6px; line-height: 1.1;
  }
  .lc-sub { font-size: 13px; color: var(--muted); margin-bottom: 32px; font-weight: 300; letter-spacing: 0.02em; }
  .lc-field { position: relative; margin-bottom: 16px; }
  .lc-label {
    display: block; font-size: 11px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 8px; font-weight: 500; transition: color 0.2s;
  }
  .lc-field:focus-within .lc-label { color: var(--amber); }
  .lc-input {
    width: 100%; background: var(--input-bg); border: 1px solid var(--border);
    color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 300; padding: 13px 16px; outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    -webkit-appearance: none; border-radius: 0;
  }
  .lc-input::placeholder { color: var(--muted); }
  .lc-input:focus { border-color: var(--amber-dim); box-shadow: 0 0 0 3px rgba(201,147,58,0.08); }
  .lc-forgot-row { display: flex; justify-content: flex-end; margin-top: -8px; margin-bottom: 28px; }
  .lc-forgot {
    font-size: 12px; color: var(--muted); text-decoration: none;
    letter-spacing: 0.03em; transition: color 0.2s; cursor: pointer;
    background: none; border: none; padding: 0; font-family: inherit;
  }
  .lc-forgot:hover { color: var(--amber); }
  .lc-btn {
    width: 100%; padding: 14px; background: var(--amber); color: #0c0b09;
    border: none; font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden;
    transition: background 0.25s, transform 0.15s; border-radius: 0;
  }
  .lc-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .lc-btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0); transition: background 0.2s; }
  .lc-btn:hover:not(:disabled) { background: #d9a44a; }
  .lc-btn:active { transform: scale(0.99); }
  .lc-error {
    background: rgba(201,58,58,0.1); border: 1px solid rgba(201,58,58,0.3);
    color: #e08080; border-radius: 4px; padding: 10px 14px;
    font-size: 13px; margin-bottom: 16px; letter-spacing: 0.02em;
  }
  .lc-footer { margin-top: 28px; text-align: center; font-size: 12px; color: var(--muted); letter-spacing: 0.03em; }
  .lc-footer a { color: var(--amber); text-decoration: none; transition: opacity 0.2s; }
  .lc-footer a:hover { opacity: 0.8; }
`;

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    localStorage.removeItem("resumeai_analyzer_result"); 
    axios.defaults.headers.common["Authorization"] = `Token ${res.data.token}`;
    navigate("/analyzer");
  } catch (err) {
    setError("Invalid email or password. Please try again.");
  }
  setLoading(false);
};

  return (
    <>
      <style>{styles}</style>
      <div className="lc-root">
        <div className="lc-corner lc-corner--tl" />
        <div className="lc-corner lc-corner--br" />

        <div className="lc-card">
          <div className="lc-brand">
            <div className="lc-brand-gem" />
            <span className="lc-brand-name">ResumeAI</span>
          </div>

          <h1 className="lc-heading">Welcome back</h1>
          <p className="lc-sub">Sign in to continue to your account</p>

          {error && <div className="lc-error">{error}</div>}

          <div className="lc-field">
            <label className="lc-label">Email address</label>
            <input
              className="lc-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="lc-field">
            <label className="lc-label">Password</label>
            <input
              className="lc-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="lc-forgot-row">
            <button className="lc-forgot">Forgot password?</button>
          </div>

          <button className="lc-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="lc-footer">
            Don't have an account? <a href="/register">Create one</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;