import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "../layout/BaseLayout";

/* ─── Floating particle background ─── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > W) d.dx *= -1;
        if (d.y < 0 || d.y > H) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,148,136,${d.o})`;
        ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(13,148,136,${0.07 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── Scroll-reveal hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Feature card ─── */
function FeatureCard({ icon, title, desc, delay = 0 }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{
      background: "#fff",
      border: "1px solid #e8ecef",
      borderRadius: "20px",
      padding: "28px 24px",
      fontFamily: "var(--font)",
      transform: visible ? "translateY(0) rotateX(0deg)" : "translateY(40px) rotateX(8deg)",
      opacity: visible ? 1 : 0,
      transition: `transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.6s ease ${delay}ms`,
      transformStyle: "preserve-3d",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: "52px", height: "52px",
        background: "linear-gradient(135deg,#f0fdf9,#ccfbf1)",
        border: "1px solid #ccfbf1", borderRadius: "14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "16px", fontSize: "1.5rem",
        boxShadow: "0 4px 12px rgba(13,148,136,0.1)",
      }}>{icon}</div>
      <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>{title}</h3>
      <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: "1.65", margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ─── Step ─── */
function Step({ num, title, desc, delay = 0 }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{
      flex: 1, minWidth: "180px", textAlign: "center",
      transform: visible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.92)",
      opacity: visible ? 1 : 0,
      transition: `all 0.65s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
    }}>
      <div style={{
        width: "60px", height: "60px", borderRadius: "50%",
        background: "linear-gradient(135deg,#f0fdf9,#ccfbf1)",
        border: "2px solid #99f6e4",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px",
        fontSize: "1.1rem", fontWeight: "800", color: "#0D9488",
        boxShadow: "0 6px 20px rgba(13,148,136,0.15)",
      }}>{num}</div>
      <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#111827", margin: "0 0 8px", fontFamily: "var(--font)" }}>{title}</h3>
      <p style={{ fontSize: "0.84rem", color: "#6b7280", lineHeight: "1.6", margin: 0, fontFamily: "var(--font)" }}>{desc}</p>
    </div>
  );
}

/* ─── Testimonial ─── */
function Testimonial({ name, role, text, delay = 0 }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} style={{
      background: "#fff", border: "1px solid #e8ecef", borderRadius: "18px",
      padding: "24px", fontFamily: "var(--font)",
      transform: visible ? "translateY(0)" : "translateY(36px)",
      opacity: visible ? 1 : 0,
      transition: `all 0.7s ease ${delay}ms`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
        {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#f59e0b", fontSize: "0.85rem" }}>★</span>)}
      </div>
      <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: "1.65", margin: "0 0 16px", fontStyle: "italic" }}>"{text}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg,#ccfbf1,#99f6e4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.8rem", fontWeight: "700", color: "#0D9488",
        }}>{name[0]}</div>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#111827" }}>{name}</div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ HOME ══════════════════════════════════════════ */
export default function Home() {
  const [heroRef, heroVisible] = useReveal(0.05);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxY = scrollY * 0.35;
  const heroScale = Math.max(0.92, 1 - scrollY * 0.0002);
  const heroOpacity = Math.max(0, 1 - scrollY * 0.0015);

  return (
    <BaseLayout>
      <style>{`
        :root { --font: 'Sora', 'Plus Jakarta Sans', sans-serif; }
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        /* ── Hero ── */
        .hero-section {
          position: relative; overflow: hidden;
          min-height: 88vh;
          display: flex; align-items: center;
          margin: -48px -24px 80px;
          padding: 80px 24px 60px;
          background: linear-gradient(160deg, #f8fffe 0%, #f0fdf9 40%, #ecfdf5 70%, #f8fafb 100%);
        }
        .hero-content {
          position: relative; z-index: 2;
          max-width: 1100px; margin: 0 auto; width: 100%;
          display: flex; align-items: center; gap: 56px; flex-wrap: wrap;
        }
        .hero-text { flex: 1; min-width: 280px; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(13,148,136,0.08);
          border: 1px solid rgba(13,148,136,0.2);
          color: #0D9488; border-radius: 30px;
          padding: 5px 14px 5px 8px;
          font-size: 0.78rem; font-weight: 600;
          margin-bottom: 20px; font-family: var(--font);
        }
        .hero-badge-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg,#0D9488,#14b8a6);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
        }

        .hero-title {
          font-family: var(--font);
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; line-height: 1.15;
          color: #0f172a; margin: 0 0 20px;
          letter-spacing: -0.03em;
        }
        .hero-title .accent { color: #0D9488; position: relative; display: inline-block; }
        .hero-title .accent::after {
          content: '';
          position: absolute; bottom: -2px; left: 0; right: 0;
          height: 3px; border-radius: 2px;
          background: linear-gradient(90deg, #0D9488, #14b8a6, transparent);
        }

        .hero-sub {
          font-family: var(--font); font-size: 1.02rem;
          color: #64748b; line-height: 1.72;
          margin: 0 0 32px; max-width: 460px;
        }

        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
        .btn-primary {
          padding: 13px 28px; border-radius: 10px;
          background: #0D9488; color: #fff;
          font-family: var(--font); font-size: 0.92rem; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(13,148,136,0.3);
          display: inline-block;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.35); }
        .btn-outline {
          padding: 13px 28px; border-radius: 10px;
          background: transparent; color: #0D9488;
          font-family: var(--font); font-size: 0.92rem; font-weight: 600;
          text-decoration: none; border: 1.5px solid #0D9488;
          transition: background 0.2s, transform 0.2s; display: inline-block;
        }
        .btn-outline:hover { background: #f0fdf9; transform: translateY(-2px); }

        .hero-stats { display: flex; gap: 28px; flex-wrap: wrap; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 1.6rem; font-weight: 800; color: #0D9488; font-family: var(--font); line-height: 1; }
        .stat-lbl { font-size: 0.72rem; color: #94a3b8; margin-top: 3px; font-family: var(--font); font-weight: 500; letter-spacing: 0.04em; }
        .stat-divider { width: 1px; background: #e2e8f0; align-self: stretch; }

        /* ── Mock card ── */
        .hero-card {
          flex-shrink: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          width: 280px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(13,148,136,0.08);
          font-family: var(--font);
          transform-style: preserve-3d;
          animation: heroFloat 5s ease-in-out infinite;
        }
        @keyframes heroFloat {
          0%,100% { transform: translateY(0) rotateY(-4deg) rotateX(3deg); }
          50%      { transform: translateY(-14px) rotateY(4deg) rotateX(-3deg); }
        }

        /* ── Orbs ── */
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(60px); pointer-events: none;
          z-index: 0;
        }
        .orb-1 { width: 400px; height: 400px; background: rgba(13,148,136,0.07); top: -100px; right: -80px; }
        .orb-2 { width: 300px; height: 300px; background: rgba(20,184,166,0.06); bottom: -60px; left: -60px; }

        /* ── Sections ── */
        .section { margin-bottom: 88px; }
        .section-label {
          display: inline-block;
          background: #f0fdf9; color: #0D9488;
          border: 1px solid #ccfbf1; border-radius: 20px;
          padding: 4px 14px; font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 12px; font-family: var(--font);
        }
        .section-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800; color: #0f172a; margin: 0 0 10px;
          letter-spacing: -0.025em; font-family: var(--font); line-height: 1.2;
        }
        .section-sub {
          font-size: 0.95rem; color: #64748b;
          line-height: 1.65; margin: 0 0 40px;
          max-width: 520px; font-family: var(--font);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .steps-row {
          display: flex; align-items: flex-start; gap: 0;
          position: relative;
        }
        .step-connector {
          flex: 1; height: 2px;
          background: linear-gradient(90deg, #ccfbf1, #99f6e4, #ccfbf1);
          margin-top: 30px; border-radius: 1px;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        /* ── CTA band ── */
        .cta-band {
          background: linear-gradient(135deg, #0D9488 0%, #0f766e 50%, #115e59 100%);
          border-radius: 24px;
          padding: 56px 48px;
          text-align: center;
          position: relative; overflow: hidden;
          margin-bottom: 0;
        }
        .cta-band::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }
        .cta-band h2 {
          font-family: var(--font); font-size: clamp(1.5rem, 3.5vw, 2.2rem);
          font-weight: 800; color: #fff; margin: 0 0 12px;
          letter-spacing: -0.02em; position: relative; z-index: 1;
        }
        .cta-band p {
          font-family: var(--font); font-size: 0.98rem;
          color: rgba(255,255,255,0.75); margin: 0 0 28px;
          position: relative; z-index: 1;
        }
        .btn-white {
          padding: 14px 32px; border-radius: 10px;
          background: #fff; color: #0D9488;
          font-family: var(--font); font-size: 0.95rem; font-weight: 700;
          text-decoration: none; display: inline-block;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          position: relative; z-index: 1;
        }
        .btn-white:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }

        /* ── Score preview strip ── */
        .score-strip {
          display: flex; gap: 14px; overflow-x: auto;
          padding-bottom: 8px; margin-bottom: 48px;
          scrollbar-width: none;
        }
        .score-strip::-webkit-scrollbar { display: none; }
        .score-chip {
          flex-shrink: 0; background: #fff;
          border: 1px solid #e8ecef; border-radius: 12px;
          padding: 10px 16px;
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .score-chip-dot { width: 8px; height: 8px; border-radius: 50%; }
        .score-chip-label { font-size: 0.8rem; color: #374151; font-weight: 600; }
        .score-chip-val { font-size: 0.8rem; font-weight: 700; }

        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .testimonials-grid { grid-template-columns: repeat(2,1fr); }
          .steps-row { flex-direction: column; align-items: center; gap: 20px; }
          .step-connector { width: 2px; height: 30px; flex: none; margin: 0; background: linear-gradient(180deg,#ccfbf1,#99f6e4); }
        }
        @media (max-width: 640px) {
          .hero-section { margin: -28px -16px 60px; padding: 60px 16px 48px; }
          .features-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .hero-card { width: 100%; max-width: 300px; }
          .hero-btns { flex-direction: column; }
          .cta-band { padding: 36px 20px; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section className="hero-section">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <Particles />

        <div className="hero-content" ref={heroRef} style={{
          opacity: heroOpacity,
          transform: `scale(${heroScale}) translateY(${parallaxY * 0.1}px)`,
          transition: "opacity 0.05s linear",
        }}>
          {/* Text */}
          <div className="hero-text" style={{
            transform: heroVisible ? "translateX(0)" : "translateX(-60px)",
            opacity: heroVisible ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div className="hero-badge">
              <span className="hero-badge-dot">✦</span>
              AI-Powered Resume Intelligence
            </div>

            <h1 className="hero-title">
              Land Your Dream Job<br />
              with a <span className="accent">Smarter Resume</span>
            </h1>

            <p className="hero-sub">
              Upload your resume, paste any job description, and get a deep AI analysis — ATS score, skill gaps, keyword matches, and instant rewrite suggestions.
            </p>

            <div className="hero-btns">
              <Link to="/analyzer" className="btn-primary">Analyze My Resume →</Link>
              <Link to="/rewriter" className="btn-outline">AI Rewriter</Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-num"><Counter target={94} suffix="%" /></div>
                <div className="stat-lbl">ATS Pass Rate</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <div className="stat-num"><Counter target={2} suffix=".3×" duration={1200} /></div>
                <div className="stat-lbl">More Interviews</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <div className="stat-num"><Counter target={10} suffix="s" duration={900} /></div>
                <div className="stat-lbl">Analysis Time</div>
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div style={{
            transform: heroVisible ? "translateX(0) rotateY(0deg)" : "translateX(80px) rotateY(20deg)",
            opacity: heroVisible ? 1 : 0,
            transition: "all 1s cubic-bezier(0.34,1.56,0.64,1) 0.2s",
            perspective: "800px",
          }}>
            <div className="hero-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#ccfbf1,#0D9488)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.8rem", fontWeight: "700" }}>JS</div>
                <div>
                  <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", width: "90px", marginBottom: "5px" }} />
                  <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "4px", width: "60px" }} />
                </div>
                <div style={{ marginLeft: "auto", background: "#f0fdf9", color: "#0D9488", fontSize: "0.7rem", fontWeight: "700", padding: "3px 9px", borderRadius: "20px", border: "1px solid #ccfbf1" }}>Active</div>
              </div>

              <div style={{ marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "500" }}>ATS Score</span>
                <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#0D9488" }}>78%</span>
              </div>
              <div style={{ height: "7px", background: "#f1f5f9", borderRadius: "4px", marginBottom: "16px", overflow: "hidden" }}>
                <div style={{ width: "78%", height: "100%", background: "linear-gradient(90deg,#0D9488,#14b8a6)", borderRadius: "4px" }} />
              </div>

              <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: "600", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Matched Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
                {["Python","React","SQL","Django"].map(t => (
                  <span key={t} style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "600", background: "#f0fdf9", color: "#0D9488", border: "1px solid #ccfbf1" }}>{t}</span>
                ))}
              </div>

              <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: "600", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Missing Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
                {["Docker","AWS"].map(t => (
                  <span key={t} style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "600", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }}>{t}</span>
                ))}
              </div>

              <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "10px 12px" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: "500", marginBottom: "6px" }}>Score Breakdown</div>
                {[["Skill Match","82%","#0D9488"], ["Keywords","74%","#6366f1"], ["Similarity","68%","#f59e0b"]].map(([l,v,c]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.68rem", color: "#94a3b8", width: "68px", flexShrink: 0 }}>{l}</span>
                    <div style={{ flex: 1, height: "4px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: v, height: "100%", background: c, borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "0.68rem", fontWeight: "700", color: c, width: "28px", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SCORE STRIP ══ */}
      <div className="score-strip">
        {[
          ["Technical Skills","85","#0D9488"], ["Frameworks","72","#6366f1"],
          ["Databases","60","#f59e0b"], ["DevOps / Cloud","45","#ef4444"],
          ["Soft Skills","78","#8b5cf6"], ["Keyword Match","74","#0ea5e9"],
          ["ATS Score","78","#0D9488"], ["Overall Fit","71","#10b981"],
        ].map(([l, v, c]) => (
          <div key={l} className="score-chip">
            <div className="score-chip-dot" style={{ background: c }} />
            <span className="score-chip-label">{l}</span>
            <span className="score-chip-val" style={{ color: c }}>{v}%</span>
          </div>
        ))}
      </div>

      {/* ══ FEATURES ══ */}
      <section className="section">
        <div style={{ marginBottom: "40px" }}>
          <span className="section-label">Features</span>
          <h2 className="section-title">Everything you need to<br />get hired faster</h2>
          <p className="section-sub">From ATS optimization to AI rewriting — we give your resume every edge it needs.</p>
        </div>
        <div className="features-grid">
          <FeatureCard delay={0}   icon="🎯" title="AI Personalization"      desc="Tailored suggestions powered by advanced AI to match any job role precisely." />
          <FeatureCard delay={80}  icon="⚡" title="Instant ATS Score"       desc="See exactly how applicant tracking systems rate your resume in real time." />
          <FeatureCard delay={160} icon="📊" title="Skill Radar Chart"       desc="Visualize your competency gaps across 6 dimensions with an animated radar." />
          <FeatureCard delay={240} icon="✏️" title="AI Resume Rewriter"      desc="One-click AI rewriting that makes every bullet point stronger and ATS-ready." />
          <FeatureCard delay={320} icon="🔑" title="Keyword Analysis"        desc="Find which keywords you're missing and which you've nailed for the target role." />
          <FeatureCard delay={400} icon="🧠" title="Skill Gap Suggestions"   desc="Know exactly which skills to learn next to qualify for your target role." />
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="section">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="section-label">Process</span>
          <h2 className="section-title">Three steps to a better resume</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>Simple, fast, and brutally honest AI analysis in under 10 seconds.</p>
        </div>
        <div className="steps-row">
          <Step delay={0}   num="01" title="Upload Resume"       desc="Drag & drop your PDF resume into our secure analyzer." />
          <div className="step-connector" />
          <Step delay={150} num="02" title="Add Job Description" desc="Paste the job description you're targeting." />
          <div className="step-connector" />
          <Step delay={300} num="03" title="Get Your Report"     desc="Receive your ATS score, skill radar, keywords, and AI rewrites." />
        </div>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link to="/analyzer" className="btn-primary">Start Analyzing Now →</Link>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section">
        <div style={{ marginBottom: "40px" }}>
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">People getting hired<br />with ResumeAI</h2>
        </div>
        <div className="testimonials-grid">
          <Testimonial delay={0}   name="Arjun Mehta"   role="SWE @ Google"       text="The ATS score jumped from 42% to 87% after following the suggestions. Got 3 interviews in a week." />
          <Testimonial delay={100} name="Priya Nair"    role="PM @ Swiggy"        text="The skill radar showed exactly what I was missing. I learned those 2 tools and landed my dream job." />
          <Testimonial delay={200} name="Ravi Kumar"    role="Backend Dev @ Zoho" text="The AI rewriter transformed my boring bullet points into impact-driven achievements instantly." />
        </div>
      </section>

      {/* ══ CTA BAND ══ */}
      <section className="section">
        <div className="cta-band">
          <h2>Ready to land more interviews?</h2>
          <p>Upload your resume and get your AI-powered score in 10 seconds — completely free.</p>
          <Link to="/analyzer" className="btn-white">Get My Resume Score →</Link>
        </div>
      </section>

    </BaseLayout>
  );
}