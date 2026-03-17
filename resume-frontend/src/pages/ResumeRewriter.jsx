import BaseLayout from "../layout/BaseLayout";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const font = "'Sora', 'Plus Jakarta Sans', sans-serif";

function ResumeRewriter() {
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null); // from analyzer
  const [copied, setCopied] = useState(false);
  const improvedRef = useRef(null);

  // ── Load context passed from Analyzer ──
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("resumeai_rewriter_context");
      if (raw) {
        const ctx = JSON.parse(raw);
        if (ctx.fromAnalyzer) setContext(ctx);
      }
    } catch { /* ignore */ }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { alert("Please upload your resume"); return; }
    if (resume.type !== "application/pdf") { alert("Please upload a PDF file"); return; }
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("resume", resume);
    try {
      const res = await axios.post("http://127.0.0.1:8000/rewrite/", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error rewriting resume. Please try again.");
    }
    setLoading(false);
  };

  // ── Copy improved text to clipboard ──
  const handleCopy = () => {
    if (!result?.improved_resume) return;
    navigator.clipboard.writeText(result.improved_resume).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Download as PDF using browser print ──
  const handleDownloadPDF = () => {
    if (!result?.improved_resume) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Improved Resume</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Inter', sans-serif;
              font-size: 13px;
              line-height: 1.65;
              color: #1a1a1a;
              padding: 48px 52px;
              max-width: 860px;
              margin: 0 auto;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: 'Inter', sans-serif;
              font-size: 13px;
              line-height: 1.7;
            }
            h1, h2, h3 { color: #0D9488; margin: 16px 0 6px; }
            @media print {
              body { padding: 20px 28px; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <pre>${result.improved_resume.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <BaseLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .rw { font-family: ${font}; color: #111827; }

        /* Header */
        .rw-hdr { margin-bottom: 28px; }
        .rw-title { font-size: 1.7rem; font-weight: 800; color: #111827; margin: 0 0 5px; letter-spacing: -0.4px; }
        .rw-sub { font-size: 0.87rem; color: #6b7280; margin: 0; }

        /* Context banner from analyzer */
        .rw-ctx {
          background: linear-gradient(135deg,#f5f3ff,#ede9fe);
          border: 1px solid #c4b5fd;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex; align-items: flex-start; gap: 14px;
        }
        .rw-ctx-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 2px; }
        .rw-ctx-title { font-size: 0.88rem; font-weight: 700; color: #4c1d95; margin: 0 0 4px; }
        .rw-ctx-body  { font-size: 0.8rem; color: #6d28d9; margin: 0; line-height: 1.5; }
        .rw-ctx-tags  { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .rw-ctx-tag   { padding: 3px 9px; border-radius: 20px; font-size: 0.71rem; font-weight: 600; background: #ede9fe; color: #5b21b6; border: 1px solid #c4b5fd; }

        /* Upload card */
        .rw-upload-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 28px;
          max-width: 560px;
        }
        .rw-dz { border: 2px dashed #d1d5db; background: #f9fafb; padding: 32px 24px; text-align: center; border-radius: 12px; margin-bottom: 14px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .rw-dz:hover { border-color: #6366f1; background: #f5f3ff; }
        .rw-dz.has-file { border-color: #6366f1; background: #f5f3ff; border-style: solid; }
        .rw-dz-icon { font-size: 1.6rem; margin-bottom: 8px; }
        .rw-dz-text { font-size: 0.86rem; color: #6b7280; margin: 0 0 3px; }
        .rw-dz-name { font-size: 0.88rem; font-weight: 700; color: #6366f1; margin: 0; }
        .rw-dz-hint { font-size: 0.74rem; color: #9ca3af; margin-top: 2px; }
        .rw-btn { padding: 13px 32px; border-radius: 10px; border: none; background: linear-gradient(135deg,#6366f1,#4f46e5); color: #fff; font-family: ${font}; font-size: 0.93rem; font-weight: 700; cursor: pointer; width: 100%; transition: transform 0.18s, box-shadow 0.18s; box-shadow: 0 4px 14px rgba(99,102,241,0.3); }
        .rw-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .rw-btn:disabled { background: #9ca3af; box-shadow: none; cursor: not-allowed; }

        /* Loading */
        .rw-loading { display: flex; align-items: center; gap: 12px; padding: 13px 18px; background: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 10px; font-size: 0.87rem; color: #6366f1; font-weight: 600; margin-bottom: 20px; }
        .rw-spin { width: 17px; height: 17px; border: 2.5px solid #c4b5fd; border-top-color: #6366f1; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Split screen */
        .rw-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 8px;
        }
        @media (max-width: 768px) {
          .rw-split { grid-template-columns: 1fr; }
        }

        .rw-panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 500px;
        }
        .rw-panel-header {
          padding: 14px 20px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .rw-panel-title {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .rw-panel-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .rw-panel-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          font-size: 0.84rem;
          line-height: 1.72;
          color: #374151;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          white-space: pre-wrap;
          word-break: break-word;
          background: #fafafa;
        }
        .rw-panel-body.improved {
          background: #fff;
          color: #111827;
        }

        /* Action buttons */
        .rw-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .rw-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #374151;
          font-family: ${font};
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
        }
        .rw-action-btn:hover { border-color: #6366f1; color: #6366f1; background: #f5f3ff; }
        .rw-action-btn.download {
          background: linear-gradient(135deg,#0D9488,#0f766e);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 3px 10px rgba(13,148,136,0.25);
        }
        .rw-action-btn.download:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(13,148,136,0.35); color: #fff; border-color: transparent; }
        .rw-action-btn.copied { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }

        /* Diff highlights */
        .rw-improved-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        /* Stats bar */
        .rw-stats {
          display: flex;
          gap: 20px;
          padding: 14px 20px;
          border-top: 1px solid #f3f4f6;
          background: #fafafa;
          flex-wrap: wrap;
        }
        .rw-stat { font-size: 0.74rem; color: #9ca3af; font-weight: 500; }
        .rw-stat strong { color: #374151; font-weight: 700; }
      `}</style>

      <div className="rw">

        {/* Header */}
        <div className="rw-hdr">
          <h2 className="rw-title">AI Resume Rewriter</h2>
          <p className="rw-sub">Upload your PDF resume and AI will rewrite it with stronger language, measurable impact, and ATS-friendly formatting.</p>
        </div>

        {/* Context banner from Analyzer */}
        {context?.fromAnalyzer && (
          <div className="rw-ctx">
            <div className="rw-ctx-icon">🎯</div>
            <div>
              <p className="rw-ctx-title">Redirected from Analyzer — AI will focus on your gaps</p>
              <p className="rw-ctx-body">
                The rewriter knows your {context.missingSkills?.length ?? 0} missing skills and {context.missingKeywords?.length ?? 0} missing keywords and will optimize your resume around them.
              </p>
              {context.missingSkills?.length > 0 && (
                <div className="rw-ctx-tags">
                  {context.missingSkills.slice(0, 8).map((s, i) => (
                    <span key={i} className="rw-ctx-tag">{s}</span>
                  ))}
                  {context.missingSkills.length > 8 && (
                    <span className="rw-ctx-tag">+{context.missingSkills.length - 8} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload form */}
        <div className="rw-upload-card">
          <form onSubmit={handleSubmit}>
            <div className={`rw-dz ${resume ? "has-file" : ""}`}
              onClick={() => document.getElementById("rwUpload").click()}>
              <div className="rw-dz-icon">{resume ? "📄" : "☁️"}</div>
              {resume
                ? <p className="rw-dz-name">✓ {resume.name}</p>
                : (<><p className="rw-dz-text">Drag & drop your resume or click to upload</p><p className="rw-dz-hint">PDF files only</p></>)
              }
              <input id="rwUpload" type="file" accept=".pdf" style={{ display: "none" }}
                onChange={(e) => setResume(e.target.files[0])} />
            </div>
            <button className="rw-btn" disabled={loading}>
              {loading ? "Rewriting…" : "✨ Rewrite with AI"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="rw-loading">
            <div className="rw-spin" />
            AI is improving your resume — analyzing language, impact, and ATS alignment…
          </div>
        )}

        {/* ── SPLIT SCREEN RESULTS ── */}
        {result && (
          <>
            {/* Action bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1rem", fontWeight: "800", color: "#111827", fontFamily: font }}>Rewrite Complete</span>
                <span className="rw-improved-badge">✓ AI Improved</span>
              </div>
              <div className="rw-actions">
                <button className="rw-action-btn" onClick={handleCopy}>
                  {copied ? "✓" : "⎘"} {copied ? "Copied!" : "Copy text"}
                </button>
                <button className={`rw-action-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopy} style={{ display: "none" }} />
                <button className="rw-action-btn download" onClick={handleDownloadPDF}>
                  ↓ Download PDF
                </button>
              </div>
            </div>

            <div className="rw-split">

              {/* LEFT — Original */}
              <div className="rw-panel">
                <div className="rw-panel-header">
                  <div className="rw-panel-title">
                    <div className="rw-panel-dot" style={{ background: "#9ca3af" }} />
                    <span style={{ color: "#6b7280" }}>Original Resume</span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 500 }}>
                    {result.original_resume?.split(/\s+/).filter(Boolean).length ?? 0} words
                  </span>
                </div>
                <div className="rw-panel-body">
                  {result.original_resume}
                </div>
                <div className="rw-stats">
                  <span className="rw-stat">Words: <strong>{result.original_resume?.split(/\s+/).filter(Boolean).length ?? 0}</strong></span>
                  <span className="rw-stat">Lines: <strong>{result.original_resume?.split("\n").length ?? 0}</strong></span>
                </div>
              </div>

              {/* RIGHT — Improved */}
              <div className="rw-panel" style={{ border: "1.5px solid #c4b5fd" }}>
                <div className="rw-panel-header" style={{ background: "#faf5ff" }}>
                  <div className="rw-panel-title">
                    <div className="rw-panel-dot" style={{ background: "#6366f1" }} />
                    <span style={{ color: "#4f46e5" }}>AI Improved Resume</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.72rem", color: "#6d28d9", fontWeight: 600 }}>
                      {result.improved_resume?.split(/\s+/).filter(Boolean).length ?? 0} words
                    </span>
                    <button className="rw-action-btn" onClick={handleCopy}
                      style={{ padding: "4px 10px", fontSize: "0.72rem" }}>
                      {copied ? "✓ Copied" : "⎘ Copy"}
                    </button>
                  </div>
                </div>
                <div className="rw-panel-body improved" ref={improvedRef}>
                  {result.improved_resume}
                </div>
                <div className="rw-stats" style={{ background: "#faf5ff" }}>
                  <span className="rw-stat">Words: <strong style={{ color: "#6366f1" }}>{result.improved_resume?.split(/\s+/).filter(Boolean).length ?? 0}</strong></span>
                  <span className="rw-stat">Lines: <strong style={{ color: "#6366f1" }}>{result.improved_resume?.split("\n").length ?? 0}</strong></span>
                  <span className="rw-stat">
                    Change: <strong style={{ color: "#0D9488" }}>
                      +{Math.max(0, (result.improved_resume?.split(/\s+/).filter(Boolean).length ?? 0) - (result.original_resume?.split(/\s+/).filter(Boolean).length ?? 0))} words
                    </strong>
                  </span>
                </div>
              </div>

            </div>

            {/* Download button — bottom */}
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button className="rw-action-btn download"
                onClick={handleDownloadPDF}
                style={{ padding: "13px 36px", fontSize: "0.93rem", borderRadius: "10px", boxShadow: "0 4px 16px rgba(13,148,136,0.25)" }}>
                ↓ Download Improved Resume as PDF
              </button>
              <button className="rw-action-btn" onClick={handleCopy}
                style={{ padding: "13px 24px", fontSize: "0.93rem", borderRadius: "10px" }}>
                {copied ? "✓ Copied!" : "⎘ Copy to Clipboard"}
              </button>
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
}

export default ResumeRewriter;