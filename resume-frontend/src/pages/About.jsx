import BaseLayout from "../layout/BaseLayout";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const font = "'Sora', 'Plus Jakarta Sans', sans-serif";

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealDiv({ children, delay = 0, style = {}, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      transform: visible ? "translateY(0)" : "translateY(36px)",
      opacity: visible ? 1 : 0,
      transition: `transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.6s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

const stats = [
  { num: "94%",   label: "ATS Pass Rate",      desc: "Of resumes analyzed pass ATS after improvements" },
  { num: "2.3×",  label: "More Interviews",     desc: "Users get more callbacks after using ResumeAI" },
  { num: "10s",   label: "Analysis Time",       desc: "Full AI-powered analysis delivered instantly" },
  { num: "6",     label: "Skill Dimensions",    desc: "Radar chart covers technical, tools, and soft skills" },
];

const features = [
  { icon: "🎯", title: "ATS Score Engine",        desc: "Our AI scores your resume against any job description using TF-IDF similarity, skill matching, and keyword density analysis." },
  { icon: "📊", title: "Skill Radar Chart",        desc: "Visualize your strengths across 6 dimensions — technical skills, frameworks, databases, DevOps, soft skills, and keyword match." },
  { icon: "✨", title: "AI Resume Rewriter",       desc: "Powered by Groq's Llama 3.3 70B, the rewriter transforms weak bullet points into strong, measurable, ATS-optimized achievements." },
  { icon: "🔑", title: "Keyword Gap Analysis",     desc: "Side-by-side comparison of keywords present vs. missing so you know exactly what to add to beat the ATS filters." },
  { icon: "🧠", title: "Skill Gap Suggestions",    desc: "Get a personalized learning roadmap — AI tells you which skills to pick up next to qualify for your target role." },
  { icon: "💾", title: "Persistent Results",       desc: "Your analysis is saved locally so you never lose your results. Come back anytime to review or take action." },
];

const techStack = [
  { name: "React",        role: "Frontend UI",          color: "#0ea5e9", bg: "#e0f2fe" },
  { name: "Django",       role: "Backend API",          color: "#16a34a", bg: "#dcfce7" },
  { name: "Groq AI",      role: "LLM Inference",        color: "#6366f1", bg: "#ede9fe" },
  { name: "scikit-learn", role: "ML & Similarity",      color: "#f59e0b", bg: "#fef3c7" },
  { name: "Chart.js",     role: "Radar Visualization",  color: "#0D9488", bg: "#ccfbf1" },
  { name: "spaCy / NLP",  role: "Skill Extraction",     color: "#ec4899", bg: "#fce7f3" },
];

const timeline = [
  { step: "01", title: "Upload Resume",        desc: "Drop your PDF resume into the secure uploader. No account needed." },
  { step: "02", title: "Paste Job Description", desc: "Copy the job posting you're targeting and paste it into the analyzer." },
  { step: "03", title: "AI Analysis",           desc: "Our backend extracts skills, computes TF-IDF similarity, and scores your match." },
  { step: "04", title: "Review Results",        desc: "See your ATS score, skill radar, keyword gaps, and personalized suggestions." },
  { step: "05", title: "Fix with AI Rewriter",  desc: "One click takes you to the AI rewriter with all your gap context pre-loaded." },
  { step: "06", title: "Download & Apply",      desc: "Download your improved resume as PDF and apply with confidence." },
];

export default function About() {
  return (
    <BaseLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ab { font-family: ${font}; color: #111827; }

        /* ── Hero ── */
        .ab-hero {
          position: relative;
          background: linear-gradient(155deg, #f8fffe 0%, #f0fdf9 45%, #ecfdf5 75%, #f8fafb 100%);
          border-radius: 24px;
          padding: 72px 56px;
          margin-bottom: 72px;
          overflow: hidden;
          text-align: center;
        }
        .ab-hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(60px); pointer-events: none;
        }
        .ab-hero-orb-1 { width: 380px; height: 380px; background: rgba(13,148,136,0.07); top: -100px; right: -80px; }
        .ab-hero-orb-2 { width: 260px; height: 260px; background: rgba(20,184,166,0.05); bottom: -60px; left: -60px; }
        .ab-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(13,148,136,0.08); border: 1px solid rgba(13,148,136,0.18);
          color: #0D9488; border-radius: 30px; padding: 5px 16px;
          font-size: 0.76rem; font-weight: 700; letter-spacing: 0.04em;
          text-transform: uppercase; margin-bottom: 20px;
          animation: fadeUp 0.8s ease both;
        }
        .ab-hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800; color: #0f172a;
          line-height: 1.15; letter-spacing: -0.03em;
          margin: 0 0 18px;
          animation: fadeUp 0.8s ease 0.1s both;
        }
        .ab-hero-title .teal { color: #0D9488; }
        .ab-hero-sub {
          font-size: 1rem; color: #64748b; line-height: 1.72;
          max-width: 580px; margin: 0 auto 32px;
          animation: fadeUp 0.8s ease 0.2s both;
        }
        .ab-hero-btns {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          animation: fadeUp 0.8s ease 0.3s both;
        }
        .btn-primary {
          padding: 12px 26px; border-radius: 10px;
          background: #0D9488; color: #fff;
          font-family: ${font}; font-size: 0.9rem; font-weight: 700;
          text-decoration: none; display: inline-block;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(13,148,136,0.28);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.35); }
        .btn-outline {
          padding: 12px 26px; border-radius: 10px;
          background: transparent; color: #0D9488;
          font-family: ${font}; font-size: 0.9rem; font-weight: 700;
          text-decoration: none; border: 1.5px solid #0D9488;
          display: inline-block; transition: background 0.2s, transform 0.2s;
        }
        .btn-outline:hover { background: #f0fdf9; transform: translateY(-2px); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Section labels ── */
        .sec-label {
          display: inline-block; background: #f0fdf9; color: #0D9488;
          border: 1px solid #ccfbf1; border-radius: 20px;
          padding: 4px 14px; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 10px;
        }
        .sec-title {
          font-size: clamp(1.4rem, 3vw, 1.9rem); font-weight: 800;
          color: #0f172a; margin: 0 0 10px; letter-spacing: -0.025em; line-height: 1.2;
        }
        .sec-sub { font-size: 0.92rem; color: #64748b; line-height: 1.65; margin: 0 0 40px; max-width: 520px; }

        /* ── Stats ── */
        .ab-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 72px; }
        @media(max-width:768px) { .ab-stats { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:400px) { .ab-stats { grid-template-columns: 1fr; } }
        .ab-stat {
          background: #fff; border: 1px solid #e8ecef;
          border-radius: 18px; padding: 24px 20px; text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ab-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .ab-stat-num { font-size: 2.2rem; font-weight: 800; color: #0D9488; line-height: 1; margin-bottom: 6px; }
        .ab-stat-label { font-size: 0.82rem; font-weight: 700; color: #111827; margin-bottom: 6px; }
        .ab-stat-desc { font-size: 0.76rem; color: #9ca3af; line-height: 1.5; }

        /* ── Mission ── */
        .ab-mission {
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          align-items: center; margin-bottom: 72px;
        }
        @media(max-width:768px) { .ab-mission { grid-template-columns: 1fr; gap: 32px; } }
        .ab-mission-visual {
          background: linear-gradient(135deg,#f0fdf9,#ecfdf5);
          border: 1px solid #ccfbf1; border-radius: 20px;
          padding: 36px; position: relative; overflow: hidden;
        }
        .ab-mission-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 18px 20px;
          margin-bottom: 12px; display: flex; align-items: center; gap: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: transform 0.2s;
        }
        .ab-mission-card:last-child { margin-bottom: 0; }
        .ab-mission-card:hover { transform: translateX(4px); }
        .ab-mc-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
        .ab-mc-title { font-size: 0.84rem; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .ab-mc-sub   { font-size: 0.76rem; color: #6b7280; }

        /* ── Features ── */
        .ab-feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-bottom: 72px; }
        @media(max-width:900px) { .ab-feat-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:560px) { .ab-feat-grid { grid-template-columns: 1fr; } }
        .ab-feat {
          background: #fff; border: 1px solid #e8ecef;
          border-radius: 18px; padding: 24px 22px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ab-feat:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.08); }
        .ab-feat-icon {
          width: 50px; height: 50px;
          background: linear-gradient(135deg,#f0fdf9,#ccfbf1);
          border: 1px solid #ccfbf1; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 14px;
          box-shadow: 0 4px 10px rgba(13,148,136,0.1);
        }
        .ab-feat h3 { font-size: 0.92rem; font-weight: 700; color: #111827; margin: 0 0 8px; }
        .ab-feat p  { font-size: 0.83rem; color: #6b7280; line-height: 1.65; margin: 0; }

        /* ── How it works timeline ── */
        .ab-timeline { margin-bottom: 72px; }
        .ab-timeline-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; position: relative; }
        @media(max-width:768px) { .ab-timeline-grid { grid-template-columns: 1fr; } }
        .ab-titem {
          padding: 24px 28px 24px 0;
          position: relative;
        }
        .ab-titem::before {
          content: '';
          position: absolute; top: 38px; right: 0;
          width: 1px; height: calc(100% - 38px);
          background: linear-gradient(180deg,#ccfbf1,transparent);
        }
        @media(max-width:768px) {
          .ab-titem { padding: 0 0 28px 24px; border-left: 2px solid #ccfbf1; margin-left: 20px; }
          .ab-titem::before { display: none; }
        }
        .ab-tnum {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg,#f0fdf9,#ccfbf1);
          border: 2px solid #99f6e4;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; font-weight: 800; color: #0D9488;
          margin-bottom: 14px;
          box-shadow: 0 4px 14px rgba(13,148,136,0.15);
        }
        @media(max-width:768px) {
          .ab-tnum { margin-left: -34px; margin-bottom: 10px; background: #fff; }
        }
        .ab-titem h3 { font-size: 0.9rem; font-weight: 700; color: #111827; margin: 0 0 7px; }
        .ab-titem p  { font-size: 0.8rem; color: #6b7280; line-height: 1.62; margin: 0; }

        /* ── Tech stack ── */
        .ab-tech-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 72px; }
        @media(max-width:640px) { .ab-tech-grid { grid-template-columns: repeat(2,1fr); } }
        .ab-tech {
          background: #fff; border: 1px solid #e8ecef;
          border-radius: 14px; padding: 18px 16px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ab-tech:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
        .ab-tech-icon {
          width: 42px; height: 42px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 800; flex-shrink: 0;
        }
        .ab-tech-name { font-size: 0.88rem; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .ab-tech-role { font-size: 0.74rem; color: #9ca3af; font-weight: 500; }

        /* ── CTA ── */
        .ab-cta {
          background: linear-gradient(135deg,#0D9488,#0f766e,#115e59);
          border-radius: 22px; padding: 56px 48px;
          text-align: center; position: relative; overflow: hidden;
        }
        .ab-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .ab-cta h2 { font-size: clamp(1.4rem,3vw,2rem); font-weight: 800; color: #fff; margin: 0 0 10px; position: relative; }
        .ab-cta p  { font-size: 0.95rem; color: rgba(255,255,255,0.72); margin: 0 0 26px; position: relative; }
        .btn-white {
          padding: 13px 32px; border-radius: 10px;
          background: #fff; color: #0D9488;
          font-family: ${font}; font-size: 0.93rem; font-weight: 700;
          text-decoration: none; display: inline-block;
          box-shadow: 0 4px 16px rgba(0,0,0,0.14);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }

        @media(max-width:640px) {
          .ab-hero { padding: 48px 20px; }
          .ab-cta  { padding: 36px 20px; }
        }
      `}</style>

      <div className="ab">

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div className="ab-hero-orb ab-hero-orb-1" />
          <div className="ab-hero-orb ab-hero-orb-2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="ab-tag">✦ About ResumeAI</div>
            <h1 className="ab-hero-title">
              Built to get you<br />
              <span className="teal">hired faster</span>
            </h1>
            <p className="ab-hero-sub">
              ResumeAI is a free, open-source AI tool that analyzes your resume against any job description,
              scores your ATS match, identifies skill gaps, and rewrites your resume to maximize your chances of landing interviews.
            </p>
            <div className="ab-hero-btns">
              <Link to="/analyzer" className="btn-primary">Try the Analyzer →</Link>
              <Link to="/rewriter" className="btn-outline">AI Rewriter</Link>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="ab-stats">
          {stats.map((s, i) => (
            <RevealDiv key={i} delay={i * 80}>
              <div className="ab-stat">
                <div className="ab-stat-num">{s.num}</div>
                <div className="ab-stat-label">{s.label}</div>
                <div className="ab-stat-desc">{s.desc}</div>
              </div>
            </RevealDiv>
          ))}
        </div>

        {/* ── MISSION ── */}
        <section style={{ marginBottom: "72px" }}>
          <div className="ab-mission">
            <RevealDiv>
              <span className="sec-label">Our Mission</span>
              <h2 className="sec-title">Leveling the playing field for job seekers</h2>
              <p className="sec-sub">
                Most candidates lose before a human even reads their resume — rejected by ATS bots that filter on keywords and format.
                ResumeAI gives every job seeker the same intelligence that enterprise recruiters use, completely free.
              </p>
              <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: "1.7", margin: 0 }}>
                We believe your skills should speak louder than your ability to game a keyword filter.
                So we built a tool that bridges that gap — showing you exactly what ATS systems look for and helping you present your experience in the strongest possible way.
              </p>
            </RevealDiv>

            <RevealDiv delay={150}>
              <div className="ab-mission-visual">
                {[
                  { icon: "🎯", bg: "#f0fdf9", title: "Precision Analysis",    sub: "TF-IDF similarity + skill matching" },
                  { icon: "⚡", bg: "#eff6ff", title: "Instant Results",        sub: "Full report delivered in under 10s" },
                  { icon: "✨", bg: "#f5f3ff", title: "AI-Powered Rewriting",   sub: "Llama 3.3 70B via Groq inference" },
                  { icon: "🔓", bg: "#fef3c7", title: "Free & Open Source",     sub: "No account, no paywall, no limits" },
                ].map((c, i) => (
                  <div key={i} className="ab-mission-card">
                    <div className="ab-mc-icon" style={{ background: c.bg }}>{c.icon}</div>
                    <div>
                      <div className="ab-mc-title">{c.title}</div>
                      <div className="ab-mc-sub">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </RevealDiv>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ marginBottom: "72px" }}>
          <RevealDiv>
            <span className="sec-label">Features</span>
            <h2 className="sec-title">Everything the tool does</h2>
            <p className="sec-sub">Six powerful modules working together to transform your resume.</p>
          </RevealDiv>
          <div className="ab-feat-grid">
            {features.map((f, i) => (
              <RevealDiv key={i} delay={i * 70}>
                <div className="ab-feat">
                  <div className="ab-feat-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="ab-timeline">
          <RevealDiv style={{ marginBottom: "36px" }}>
            <span className="sec-label">Process</span>
            <h2 className="sec-title">How ResumeAI works</h2>
            <p className="sec-sub">From raw PDF to a polished, interview-ready resume in six steps.</p>
          </RevealDiv>
          <div className="ab-timeline-grid">
            {timeline.map((t, i) => (
              <RevealDiv key={i} delay={i * 90}>
                <div className="ab-titem">
                  <div className="ab-tnum">{t.step}</div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section style={{ marginBottom: "72px" }}>
          <RevealDiv>
            <span className="sec-label">Tech Stack</span>
            <h2 className="sec-title">Built with modern tools</h2>
            <p className="sec-sub">A full-stack AI project combining React, Django, and state-of-the-art language models.</p>
          </RevealDiv>
          <div className="ab-tech-grid">
            {techStack.map((t, i) => (
              <RevealDiv key={i} delay={i * 60}>
                <div className="ab-tech">
                  <div className="ab-tech-icon"
                    style={{ background: t.bg, color: t.color, fontSize: "0.82rem", fontWeight: 800 }}>
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="ab-tech-name" style={{ color: t.color }}>{t.name}</div>
                    <div className="ab-tech-role">{t.role}</div>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <RevealDiv>
          <div className="ab-cta">
            <h2>Ready to land more interviews?</h2>
            <p>Upload your resume and get your AI-powered score in 10 seconds — completely free.</p>
            <Link to="/analyzer" className="btn-white">Get My Resume Score →</Link>
          </div>
        </RevealDiv>

      </div>
    </BaseLayout>
  );
}