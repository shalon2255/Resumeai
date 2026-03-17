import BaseLayout from "../layout/BaseLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SkillRadar from "../components/SkillRadar";

const font = "'Sora', 'Plus Jakarta Sans', sans-serif";
const STORAGE_KEY = "resumeai_analyzer_result";

function Analyzer() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // ── Load persisted result on mount ──
  const [result, setResult] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── Persist whenever result changes ──
  useEffect(() => {
    if (result) localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  }, [result]);

  // ── Animate score on first load if result exists ──
  useEffect(() => {
    if (result?.score) animateScore(result.score);
  }, []);

  const animateScore = (target) => {
    let start = 0;
    const duration = 1200;
    const stepMs = 16;
    const inc = (target / duration) * stepMs;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setAnimatedScore(target); clearInterval(timer); }
      else setAnimatedScore(Math.round(start));
    }, stepMs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { alert("Please upload a resume"); return; }
    if (resume.type !== "application/pdf") { alert("Please upload a PDF resume"); return; }
    setLoading(true);
    setResult(null);
    setAnimatedScore(0);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);
    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze/", formData);
      setResult(res.data);
      animateScore(res.data.score);
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume");
    }
    setLoading(false);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setResult(null);
    setAnimatedScore(0);
    setResume(null);
    setJobDescription("");
  };

  // ── Pass context to rewriter via sessionStorage ──
  const handleFixWithAI = () => {
    if (!result) return;
    sessionStorage.setItem("resumeai_rewriter_context", JSON.stringify({
      missingSkills:      result.missing_skills      ?? [],
      missingKeywords:    result.keyword_missing      ?? [],
      resumeSuggestions:  result.resume_suggestions   ?? [],
      fromAnalyzer:       true,
    }));
    navigate("/rewriter");
  };

  const scoreColor  = result ? (result.score >= 70 ? "#059669" : result.score >= 40 ? "#d97706" : "#dc2626") : "#0D9488";
  const scoreBg     = result ? (result.score >= 70 ? "#ecfdf5" : result.score >= 40 ? "#fffbeb" : "#fef2f2") : "#f0fdf9";
  const scoreBorder = result ? (result.score >= 70 ? "#a7f3d0" : result.score >= 40 ? "#fde68a" : "#fecaca") : "#ccfbf1";
  const scoreLabel  = result ? (result.score >= 70 ? "Strong match" : result.score >= 40 ? "Moderate match" : "Low match") : "";
  const scoreSubtext = result
    ? result.score >= 70 ? "Great chance of passing ATS screening"
      : result.score >= 40 ? "Consider adding missing skills to improve fit"
      : "Resume needs significant improvement for this role"
    : "";

  const breakdownItems = result ? [
    { label: "Skill Match",      value: result.score_breakdown?.skill_match      ?? null, icon: "⚡", color: "#0D9488" },
    { label: "Keyword Match",    value: result.score_breakdown?.keyword_match    ?? null, icon: "🔑", color: "#6366f1" },
    { label: "Similarity Score", value: result.score_breakdown?.similarity_score ?? null, icon: "📊", color: "#f59e0b" },
  ] : [];

  return (
    <BaseLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .az { font-family: ${font}; max-width: 860px; margin: 0 auto; color: #111827; }
        .az-hdr { margin-bottom: 28px; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .az-title { font-size: 1.7rem; font-weight: 800; color: #111827; margin: 0 0 5px; letter-spacing: -0.4px; }
        .az-sub { font-size: 0.87rem; color: #6b7280; margin: 0; }
        .az-saved { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf9; border: 1px solid #ccfbf1; color: #0D9488; border-radius: 20px; padding: 5px 12px; font-size: 0.74rem; font-weight: 600; }
        .az-clear { background: none; border: 1px solid #e5e7eb; color: #9ca3af; font-size: 0.74rem; font-weight: 600; border-radius: 8px; padding: 5px 12px; cursor: pointer; font-family: ${font}; transition: all 0.18s; }
        .az-clear:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

        .az-dz { border: 2px dashed #d1d5db; background: #f9fafb; padding: 36px 24px; text-align: center; border-radius: 14px; margin-bottom: 14px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .az-dz:hover { border-color: #0D9488; background: #f0fdf9; }
        .az-dz.has-file { border-color: #0D9488; background: #f0fdf9; border-style: solid; }
        .az-dz-icon { font-size: 1.7rem; margin-bottom: 8px; }
        .az-dz-text { font-size: 0.87rem; color: #6b7280; margin: 0 0 3px; }
        .az-dz-name { font-size: 0.9rem; font-weight: 700; color: #0D9488; margin: 0; }
        .az-dz-hint { font-size: 0.75rem; color: #9ca3af; margin-top: 3px; }

        .az-ta { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; font-family: ${font}; font-size: 0.87rem; color: #111827; resize: vertical; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .az-ta:focus { border-color: #0D9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
        .az-ta::placeholder { color: #9ca3af; }

        .az-btn { margin-top: 14px; padding: 13px 32px; border-radius: 10px; border: none; background: #0D9488; color: #fff; font-family: ${font}; font-size: 0.93rem; font-weight: 700; cursor: pointer; width: 100%; transition: background 0.18s, transform 0.1s; }
        .az-btn:hover:not(:disabled) { background: #0f766e; transform: translateY(-1px); }
        .az-btn:disabled { background: #9ca3af; cursor: not-allowed; }

        .az-loading { margin-top: 16px; display: flex; align-items: center; gap: 12px; padding: 13px 18px; background: #f0fdf9; border: 1px solid #ccfbf1; border-radius: 10px; font-size: 0.87rem; color: #0D9488; font-weight: 600; }
        .az-spin { width: 17px; height: 17px; border: 2.5px solid #ccfbf1; border-top-color: #0D9488; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .az-results { margin-top: 44px; }
        .az-divider { height: 1px; background: #f3f4f6; margin: 0 0 28px; }
        .az-rh { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 26px; }
        .az-rtitle { font-size: 1.3rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.3px; }
        .az-stitle { font-size: 0.73rem; font-weight: 700; color: #9ca3af; letter-spacing: 0.08em; text-transform: uppercase; margin: 26px 0 12px; }

        /* Fix button */
        .fix-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: #fff; font-family: ${font}; font-size: 0.87rem; font-weight: 700; border: none; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; box-shadow: 0 4px 14px rgba(99,102,241,0.3); }
        .fix-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }

        /* Fit meter */
        .az-meter { border-radius: 16px; padding: 22px 26px; border: 1px solid; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .az-donut { flex-shrink: 0; position: relative; width: 94px; height: 94px; }
        .az-donut svg { width: 94px; height: 94px; transform: rotate(-90deg); }
        .az-donut-track { fill: none; stroke-width: 9; stroke: rgba(0,0,0,0.07); }
        .az-donut-fill  { fill: none; stroke-width: 9; stroke-linecap: round; transition: stroke-dashoffset 1.3s cubic-bezier(0.34,1.56,0.64,1); }
        .az-donut-num { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800; line-height: 1; }
        .az-donut-pct { font-size: 0.67rem; font-weight: 600; margin-top: 1px; opacity: 0.7; }
        .az-meter-text { flex: 1; min-width: 160px; }
        .az-meter-label { font-size: 1.02rem; font-weight: 800; margin: 0 0 5px; }
        .az-meter-sub { font-size: 0.8rem; opacity: 0.75; margin: 0 0 12px; }
        .az-bar-track { height: 7px; border-radius: 4px; background: rgba(0,0,0,0.08); overflow: hidden; }
        .az-bar-fill  { height: 100%; border-radius: 4px; transition: width 1.3s cubic-bezier(0.34,1.56,0.64,1); }
        .az-bar-ticks { display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.67rem; color: #9ca3af; font-weight: 600; }

        /* Breakdown */
        .az-bdgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        @media(max-width:520px){ .az-bdgrid { grid-template-columns: 1fr; } }
        .az-bcard { background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; padding: 20px 18px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.04); transition: transform 0.18s, box-shadow 0.18s; }
        .az-bcard:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
        .az-bcard-top { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 14px 14px 0 0; }
        .az-bcard-icon { font-size: 1.3rem; margin-bottom: 7px; }
        .az-bcard-num { font-size: 1.85rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .az-bcard-lbl { font-size: 0.75rem; color: #6b7280; font-weight: 600; letter-spacing: 0.03em; }
        .az-bcard-bar { height: 4px; background: #f3f4f6; border-radius: 3px; margin-top: 10px; overflow: hidden; }
        .az-bcard-bar-fill { height: 100%; border-radius: 3px; transition: width 1.2s ease 0.3s; }

        /* Skill tags */
        .az-sgrid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 14px; }
        .az-sbox { background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .az-sbox-hdr { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .az-sbox-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .az-sbox-title { font-size: 0.73rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
        .az-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .az-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 0.73rem; font-weight: 600; line-height: 1; transition: transform 0.15s; cursor: default; border: 1px solid transparent; }
        .az-tag:hover { transform: translateY(-1px); }
        .az-tdot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .t-blue   { background:#eff6ff; color:#1d4ed8; border-color:#dbeafe; } .t-blue .az-tdot   { background:#3b82f6; }
        .t-violet { background:#f5f3ff; color:#5b21b6; border-color:#ede9fe; } .t-violet .az-tdot { background:#7c3aed; }
        .t-green  { background:#f0fdf4; color:#15803d; border-color:#bbf7d0; } .t-green .az-tdot  { background:#22c55e; }
        .t-red    { background:#fef2f2; color:#b91c1c; border-color:#fecaca; } .t-red .az-tdot    { background:#ef4444; }

        /* Missing skills banner */
        .az-banner { margin-top: 20px; background: linear-gradient(135deg,#f5f3ff,#ede9fe); border: 1px solid #c4b5fd; border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .az-banner h4 { font-size: 0.88rem; font-weight: 700; color: #4c1d95; margin: 0 0 3px; }
        .az-banner p  { font-size: 0.78rem; color: #6d28d9; margin: 0; opacity: 0.85; }

        /* Keywords */
        .az-kgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media(max-width:520px){ .az-kgrid { grid-template-columns: 1fr; } }
        .az-kbox { background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; padding: 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .az-kbox-title { font-size: 0.73rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
        .az-kbox-icon { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }

        /* Suggestions */
        .az-sugs { display: flex; flex-direction: column; gap: 10px; }
        .az-sug { display: flex; align-items: flex-start; gap: 12px; padding: 13px 16px; background: #fff; border: 1px solid #f0f0f0; border-radius: 12px; font-size: 0.85rem; color: #374151; line-height: 1.55; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: border-color 0.15s; }
        .az-sug:hover { border-color: #d1d5db; }
        .az-sug-n { width: 22px; height: 22px; border-radius: 50%; background: #f0fdf9; border: 1px solid #ccfbf1; color: #0D9488; font-size: 0.69rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
      `}</style>

      <div className="az">

        {/* Header */}
        <div className="az-hdr">
          <div>
            <h2 className="az-title">Resume Analyzer</h2>
            <p className="az-sub">Upload your resume and a job description for instant AI-powered fit analysis.</p>
          </div>
          {result && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className="az-saved">✓ Results saved</span>
              <button className="az-clear" onClick={handleClear}>Clear</button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={`az-dz ${resume ? "has-file" : ""}`}
            onClick={() => document.getElementById("rzUpload").click()}>
            <div className="az-dz-icon">{resume ? "📄" : "☁️"}</div>
            {resume
              ? <p className="az-dz-name">✓ {resume.name}</p>
              : (<><p className="az-dz-text">Drag & drop your resume or click to upload</p><p className="az-dz-hint">PDF files only</p></>)
            }
            <input id="rzUpload" type="file" accept=".pdf" style={{ display: "none" }}
              onChange={(e) => setResume(e.target.files[0])} />
          </div>

          <textarea className="az-ta" rows="6"
            placeholder="Paste job description here (optional but recommended)..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)} />

          <button className="az-btn" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Resume"}
          </button>
        </form>

        {loading && (
          <div className="az-loading">
            <div className="az-spin" />
            Analyzing your resume with AI — this takes a few seconds…
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div className="az-results">
            <div className="az-divider" />

            <div className="az-rh">
              <h2 className="az-rtitle">Analysis Results</h2>
              <button className="fix-btn" onClick={handleFixWithAI}>
                ✨ Fix with AI Rewriter
              </button>
            </div>

            {/* Job Fit Meter */}
            <p className="az-stitle">Job Fit Meter</p>
            <div className="az-meter" style={{ background: scoreBg, borderColor: scoreBorder }}>
              <div className="az-donut">
                <svg viewBox="0 0 100 100">
                  <circle className="az-donut-track" cx="50" cy="50" r="42" />
                  <circle className="az-donut-fill" cx="50" cy="50" r="42"
                    stroke={scoreColor}
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - animatedScore / 100)}`} />
                </svg>
                <div className="az-donut-num" style={{ color: scoreColor }}>
                  {animatedScore}<span className="az-donut-pct">%</span>
                </div>
              </div>
              <div className="az-meter-text">
                <p className="az-meter-label" style={{ color: scoreColor }}>{scoreLabel}</p>
                <p className="az-meter-sub"   style={{ color: scoreColor }}>{scoreSubtext}</p>
                <div className="az-bar-track">
                  <div className="az-bar-fill" style={{ width: `${animatedScore}%`, background: scoreColor }} />
                </div>
                <div className="az-bar-ticks"><span>0</span><span>Poor</span><span>Fair</span><span>Good</span><span>100</span></div>
              </div>
            </div>

            {/* Score Breakdown */}
            <p className="az-stitle">Score Breakdown</p>
            <div className="az-bdgrid">
              {breakdownItems.map((item, i) => (
                <div key={i} className="az-bcard">
                  <div className="az-bcard-top" style={{ background: item.color }} />
                  <div className="az-bcard-icon">{item.icon}</div>
                  <div className="az-bcard-num" style={{ color: item.color }}>{item.value !== null ? `${item.value}%` : "—"}</div>
                  <div className="az-bcard-lbl">{item.label}</div>
                  <div className="az-bcard-bar"><div className="az-bcard-bar-fill" style={{ width: `${item.value ?? 0}%`, background: item.color }} /></div>
                </div>
              ))}
            </div>

            {/* Skill Radar */}
            <p className="az-stitle">Skill Radar</p>
            <SkillRadar resumeSkills={result.resume_skills} jobSkills={result.job_skills}
              matchingSkills={result.matching_skills} scoreBreakdown={result.score_breakdown} />

            {/* Skills Overview */}
            <p className="az-stitle">Skills Overview</p>
            <div className="az-sgrid">
              {[
                { title: "Resume Skills",   items: result.resume_skills,   color: "#3b82f6", dot: "#2563eb", bg: "#eff6ff", border: "#dbeafe", tc: "t-blue" },
                { title: "Job Skills",      items: result.job_skills,      color: "#7c3aed", dot: "#6d28d9", bg: "#f5f3ff", border: "#ede9fe", tc: "t-violet" },
                { title: "Matching Skills", items: result.matching_skills, color: "#15803d", dot: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", tc: "t-green" },
                { title: "Missing Skills",  items: result.missing_skills,  color: "#b91c1c", dot: "#ef4444", bg: "#fef2f2", border: "#fecaca", tc: "t-red" },
              ].map((s, i) => (
                <div key={i} className="az-sbox">
                  <div className="az-sbox-hdr">
                    <div className="az-sbox-dot" style={{ background: s.dot }} />
                    <span className="az-sbox-title" style={{ color: s.color }}>{s.title}</span>
                    {s.items?.length > 0 && (
                      <span style={{ marginLeft: "auto", fontSize: "0.71rem", fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: "10px", padding: "2px 8px" }}>
                        {s.items.length}
                      </span>
                    )}
                  </div>
                  <div className="az-tags">
                    {s.items?.length > 0
                      ? s.items.map((sk, j) => <span key={j} className={`az-tag ${s.tc}`}><span className="az-tdot" />{sk}</span>)
                      : <span style={{ fontSize: "0.79rem", color: "#9ca3af" }}>None found</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Missing skills fix banner */}
            {result.missing_skills?.length > 0 && (
              <div className="az-banner">
                <div>
                  <h4>✨ {result.missing_skills.length} missing skills detected</h4>
                  <p>Let AI rewrite your resume to better highlight relevant skills and close the gap.</p>
                </div>
                <button className="fix-btn" onClick={handleFixWithAI}>Fix with AI Rewriter →</button>
              </div>
            )}

            {/* Keyword Analysis */}
            <p className="az-stitle">Keyword Analysis</p>
            <div className="az-kgrid">
              <div className="az-kbox">
                <div className="az-kbox-title" style={{ color: "#15803d" }}>
                  <span className="az-kbox-icon" style={{ background: "#dcfce7", color: "#15803d" }}>✓</span>
                  Keywords Present
                </div>
                <div className="az-tags">
                  {result.keyword_present?.map((k, i) => <span key={i} className="az-tag t-green">{k}</span>)}
                </div>
              </div>
              <div className="az-kbox">
                <div className="az-kbox-title" style={{ color: "#b91c1c" }}>
                  <span className="az-kbox-icon" style={{ background: "#fee2e2", color: "#b91c1c" }}>✕</span>
                  Missing Keywords
                </div>
                <div className="az-tags">
                  {result.keyword_missing?.map((k, i) => <span key={i} className="az-tag t-red">{k}</span>)}
                </div>
              </div>
            </div>

            {/* Suggested Learning */}
            {result.skill_suggestions?.length > 0 && (
              <>
                <p className="az-stitle">Suggested Learning</p>
                <div className="az-sugs">
                  {result.skill_suggestions.map((item, i) => (
                    <div key={i} className="az-sug"><div className="az-sug-n">{i + 1}</div>{item}</div>
                  ))}
                </div>
              </>
            )}

            {/* Resume Improvement Suggestions */}
            {result.resume_suggestions?.length > 0 && (
              <>
                <p className="az-stitle">Resume Improvement Suggestions</p>
                <div className="az-sugs">
                  {result.resume_suggestions.map((item, i) => (
                    <div key={i} className="az-sug"><div className="az-sug-n">{i + 1}</div>{item}</div>
                  ))}
                </div>
              </>
            )}

            {/* Bottom CTA */}
            <div style={{ marginTop: "36px", textAlign: "center" }}>
              <button className="fix-btn" onClick={handleFixWithAI}
                style={{ fontSize: "0.95rem", padding: "13px 32px" }}>
                ✨ Rewrite My Resume with AI →
              </button>
            </div>

          </div>
        )}
      </div>
    </BaseLayout>
  );
}

export default Analyzer;