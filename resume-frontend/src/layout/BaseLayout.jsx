import Navbar from "../components/Navbar";

function BaseLayout({ children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }

        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafb;
          width: 100%;
        }

        .page-content {
          flex: 1;
          width: 100%;
          padding: 48px 48px 80px;
        }

        .page-footer {
          background: #fff;
          border-top: 1px solid #e8ecef;
          padding: 22px 48px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
        }

        .footer-inner {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .footer-logo {
          font-size: 1rem;
          font-weight: 800;
          color: #0D9488;
          font-family: 'Sora', sans-serif;
          letter-spacing: -0.01em;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .footer-link {
          font-size: 0.82rem;
          color: #9ca3af;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #0D9488; }

        .footer-copy {
          font-size: 0.8rem;
          color: #c4c9d4;
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 1280px) {
          .page-content  { padding: 44px 36px 72px; }
          .page-footer   { padding: 20px 36px; }
        }

        @media (max-width: 1024px) {
          .page-content  { padding: 40px 28px 64px; }
          .page-footer   { padding: 20px 28px; }
        }

        @media (max-width: 768px) {
          .page-content  { padding: 32px 20px 56px; }
          .page-footer   { padding: 18px 20px; }
          .footer-links  { gap: 14px; }
        }

        @media (max-width: 640px) {
          .page-content  { padding: 24px 16px 48px; }
          .page-footer   { padding: 16px; }
          .footer-inner  { flex-direction: column; text-align: center; gap: 6px; }
          .footer-links  { justify-content: center; }
        }

        @media (max-width: 400px) {
          .page-content  { padding: 20px 12px 40px; }
        }
      `}</style>

      <div className="page-wrapper">
        <Navbar />

        <main className="page-content">
          {children}
        </main>

        <footer className="page-footer">
          <div className="footer-inner">
            <span className="footer-logo">Resume<span style={{ color: "#111827" }}>AI</span></span>

            <div className="footer-links">
              <a href="/" className="footer-link">Home</a>
              <a href="/analyzer" className="footer-link">Analyzer</a>
              <a href="/rewriter" className="footer-link">Rewriter</a>
              <a href="/about" className="footer-link">About</a>
            </div>

            <span className="footer-copy">© 2025 ResumeAI · AI-Powered Career Tools</span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default BaseLayout;