import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const font = "'Sora', 'Plus Jakarta Sans', sans-serif";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const linkStyle = (active) => ({
    padding: "7px 15px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: active ? "700" : "500",
    color: active ? "#0D9488" : "#6b7280",
    background: active ? "#f0fdf9" : "transparent",
    textDecoration: "none",
    fontFamily: font,
    display: "block",
    transition: "color 0.18s, background 0.18s",
    whiteSpace: "nowrap",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 200;
          width: 100%;
          background: rgba(255,255,255,0.97);
          border-bottom: 1px solid #e8ecef;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: box-shadow 0.25s;
          font-family: ${font};
        }
        .navbar.scrolled {
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
        }

        .navbar-inner {
          width: 100%;
          padding: 0 48px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 16px;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: #f0fdf9;
          border: 1px solid #ccfbf1;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.02em;
          font-family: ${font};
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
        }

        .nav-link-item {
          padding: 7px 15px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          background: transparent;
          text-decoration: none;
          font-family: ${font};
          transition: color 0.18s, background 0.18s;
          white-space: nowrap;
        }
        .nav-link-item:hover {
          color: #0D9488;
          background: #f0fdf9;
        }
        .nav-link-item.active {
          color: #0D9488;
          background: #f0fdf9;
          font-weight: 700;
        }

        .nav-cta {
          margin-left: auto;
          padding: 9px 22px;
          background: #0D9488;
          color: #fff;
          border-radius: 9px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          font-family: ${font};
          flex-shrink: 0;
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(13,148,136,0.2);
        }
        .nav-cta:hover {
          background: #0f766e;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(13,148,136,0.3);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          margin-left: auto;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.18s;
        }
        .hamburger:hover { background: #f3f4f6; }
        .hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: #374151;
          border-radius: 2px;
          transition: transform 0.25s, opacity 0.25s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 10px 16px 16px;
          gap: 3px;
          border-top: 1px solid #f3f4f6;
          background: #fff;
        }
        .mobile-menu.open { display: flex; }

        .mobile-cta {
          margin-top: 10px;
          display: block;
          text-align: center;
          padding: 12px;
          background: #0D9488;
          color: #fff;
          border-radius: 9px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          font-family: ${font};
          box-shadow: 0 2px 8px rgba(13,148,136,0.2);
        }

        /* ── Responsive ── */
        @media (max-width: 1280px) {
          .navbar-inner { padding: 0 36px; }
        }
        @media (max-width: 1024px) {
          .navbar-inner { padding: 0 28px; }
        }
        @media (max-width: 768px) {
          .navbar-inner { padding: 0 20px; }
        }
        @media (max-width: 640px) {
          .navbar-inner  { padding: 0 16px; }
          .nav-links     { display: none; }
          .nav-cta       { display: none; }
          .hamburger     { display: flex; }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#0D9488" strokeWidth="2" />
                <polyline points="14 2 14 8 20 8" stroke="#0D9488" strokeWidth="2" />
                <line x1="8" y1="13" x2="16" y2="13" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="17" x2="13" y2="17" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="nav-logo-text">
              Resume<span style={{ color: "#0D9488" }}>AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            <Link to="/"         className={`nav-link-item ${isActive("/") ? "active" : ""}`}>Home</Link>
            <Link to="/analyzer" className={`nav-link-item ${isActive("/analyzer") ? "active" : ""}`}>Analyzer</Link>
            <Link to="/rewriter" className={`nav-link-item ${isActive("/rewriter") ? "active" : ""}`}>Resume Rewriter</Link>
            <Link to="/about"    className={`nav-link-item ${isActive("/about") ? "active" : ""}`}>About</Link>
          </div>

          <Link to="/analyzer" className="nav-cta">Get Resume Score</Link>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/"         style={linkStyle(isActive("/"))}         onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/analyzer" style={linkStyle(isActive("/analyzer"))} onClick={() => setMenuOpen(false)}>Analyzer</Link>
          <Link to="/rewriter" style={linkStyle(isActive("/rewriter"))} onClick={() => setMenuOpen(false)}>Resume Rewriter</Link>
       
          <Link to="/analyzer" className="mobile-cta"                   onClick={() => setMenuOpen(false)}>Get Resume Score</Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;