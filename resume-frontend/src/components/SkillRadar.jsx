import { useEffect, useRef } from "react";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const font = "'Plus Jakarta Sans', sans-serif";

/**
 * SkillRadar
 *
 * Props:
 *   resumeSkills   – string[]  (from result.resume_skills)
 *   jobSkills      – string[]  (from result.job_skills)
 *   matchingSkills – string[]  (from result.matching_skills)
 *   scoreBreakdown – { skill_match, keyword_match, similarity_score }
 */
function SkillRadar({ resumeSkills = [], jobSkills = [], matchingSkills = [], scoreBreakdown = {} }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // ── Derive 6 radar axes from the API data ──────────────────────────────
  const total = (arr) => arr?.length || 0;

  const techKeywords   = ["python","java","javascript","typescript","c++","c#","go","rust","kotlin","swift","r","scala","ruby","php","sql"];
  const frameworkWords = ["react","vue","angular","next","django","flask","fastapi","spring","express","laravel","rails","svelte","nuxt"];
  const dbWords        = ["sql","postgresql","mysql","mongodb","redis","elasticsearch","dynamodb","sqlite","cassandra","neo4j","firebase","supabase"];
  const devopsWords    = ["docker","kubernetes","aws","azure","gcp","ci/cd","terraform","jenkins","github actions","helm","ansible","nginx"];

  const countMatch = (skills, keywords) =>
    skills.filter(s => keywords.some(k => s.toLowerCase().includes(k))).length;

  const resumeLower = resumeSkills.map(s => s.toLowerCase());
  const jobLower    = jobSkills.map(s => s.toLowerCase());

  const matchRatio = total(jobSkills) > 0
    ? Math.round((total(matchingSkills) / total(jobSkills)) * 100)
    : scoreBreakdown.skill_match ?? 0;

  const axes = [
    {
      label: "Technical Skills",
      resume: Math.min(100, countMatch(resumeSkills, techKeywords) * 14 + (scoreBreakdown.skill_match ?? 50) * 0.4),
      job:    Math.min(100, countMatch(jobSkills, techKeywords) * 14 + 60),
      color:  "#0D9488",
    },
    {
      label: "Frameworks",
      resume: Math.min(100, countMatch(resumeSkills, frameworkWords) * 20 + 20),
      job:    Math.min(100, countMatch(jobSkills, frameworkWords) * 20 + 30),
      color:  "#6366f1",
    },
    {
      label: "Databases",
      resume: Math.min(100, countMatch(resumeSkills, dbWords) * 25 + 20),
      job:    Math.min(100, countMatch(jobSkills, dbWords) * 25 + 30),
      color:  "#f59e0b",
    },
    {
      label: "DevOps / Cloud",
      resume: Math.min(100, countMatch(resumeSkills, devopsWords) * 18 + 10),
      job:    Math.min(100, countMatch(jobSkills, devopsWords) * 18 + 25),
      color:  "#ef4444",
    },
    {
      label: "Keyword Match",
      resume: scoreBreakdown.keyword_match ?? matchRatio,
      job:    85,
      color:  "#8b5cf6",
    },
    {
      label: "Overall Fit",
      resume: scoreBreakdown.similarity_score ?? matchRatio,
      job:    90,
      color:  "#0ea5e9",
    },
  ].map(a => ({ ...a, resume: Math.round(a.resume), job: Math.round(a.job) }));

  // ── Build / animate chart ──────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const chart = new Chart(canvasRef.current, {
      type: "radar",
      data: {
        labels: axes.map(a => a.label),
        datasets: [
          {
            label: "Your Resume",
            data: new Array(axes.length).fill(0),
            backgroundColor: "rgba(13,148,136,0.12)",
            borderColor: "#0D9488",
            borderWidth: 2,
            pointBackgroundColor: "#0D9488",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Job Requirement",
            data: axes.map(a => a.job),
            backgroundColor: "rgba(99,102,241,0.06)",
            borderColor: "#6366f1",
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointBackgroundColor: "#6366f1",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1f2937",
            titleFont: { family: font, size: 11, weight: "700" },
            bodyFont: { family: font, size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}` },
          },
        },
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { stepSize: 25, display: false },
            grid: { color: "rgba(0,0,0,0.07)", lineWidth: 1 },
            angleLines: { color: "rgba(0,0,0,0.08)" },
            pointLabels: {
              font: { family: font, size: 11, weight: "700" },
              color: "#6b7280",
            },
          },
        },
      },
    });

    chartRef.current = chart;

    // animate resume data
    let progress = 0;
    const STEPS = 80;
    const timer = setInterval(() => {
      progress = Math.min(progress + 1, STEPS);
      const ease = 1 - Math.pow(1 - progress / STEPS, 3);
      chart.data.datasets[0].data = axes.map(a => Math.round(a.resume * ease));
      chart.update("none");
      if (progress >= STEPS) clearInterval(timer);
    }, 16);

    return () => { clearInterval(timer); chart.destroy(); chartRef.current = null; };
  }, [resumeSkills, jobSkills, matchingSkills, scoreBreakdown]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        .sr-card {
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          font-family: ${font};
        }
        .sr-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .sr-title { font-size: 0.95rem; font-weight: 800; color: #111827; margin: 0 0 2px; }
        .sr-sub   { font-size: 0.78rem; color: #6b7280; margin: 0; }
        .sr-badge {
          font-size: 0.7rem; font-weight: 700;
          background: #f0fdf9; color: #0D9488;
          border: 1px solid #ccfbf1;
          border-radius: 20px; padding: 3px 10px;
          white-space: nowrap;
        }
        .sr-body {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .sr-canvas-wrap {
          flex: 0 0 300px;
          height: 300px;
          position: relative;
        }
        .sr-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 11px;
          min-width: 0;
        }
        .sr-leg-row { display: flex; align-items: center; gap: 8px; }
        .sr-leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .sr-leg-label { font-size: 0.75rem; font-weight: 700; color: #374151; min-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sr-leg-track { flex: 1; height: 5px; background: #f3f4f6; border-radius: 3px; overflow: hidden; }
        .sr-leg-fill  { height: 100%; border-radius: 3px; transition: width 1.4s cubic-bezier(0.34,1.56,0.64,1); }
        .sr-leg-val   { font-size: 0.75rem; font-weight: 800; min-width: 28px; text-align: right; }

        .sr-legend-header {
          display: flex;
          gap: 16px;
          margin-bottom: 4px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f3f4f6;
        }
        .sr-legend-key {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #9ca3af;
        }
        .sr-legend-key-line {
          width: 18px;
          height: 2px;
          border-radius: 2px;
        }
        .sr-legend-key-dashed {
          width: 18px;
          height: 0;
          border-top: 2px dashed #6366f1;
        }

        @media (max-width: 580px) {
          .sr-body { flex-direction: column; gap: 20px; }
          .sr-canvas-wrap { flex: none; width: 100%; height: 260px; }
        }
      `}</style>

      <div className="sr-card">
        <div className="sr-header">
          <div>
            <p className="sr-title">Skill Radar</p>
            <p className="sr-sub">Your resume vs. job requirements across key dimensions</p>
          </div>
          <span className="sr-badge">AI-scored</span>
        </div>

        <div className="sr-body">
          {/* Chart */}
          <div className="sr-canvas-wrap">
            <canvas ref={canvasRef} />
          </div>

          {/* Legend */}
          <div className="sr-legend">
            {/* Legend keys */}
            <div className="sr-legend-header">
              <span className="sr-legend-key">
                <span className="sr-legend-key-line" style={{ background: "#0D9488" }} />
                Your resume
              </span>
              <span className="sr-legend-key">
                <span className="sr-legend-key-dashed" />
                Job requirement
              </span>
            </div>

            {/* Per-axis bars */}
            {axes.map((axis, i) => (
              <div key={i} className="sr-leg-row">
                <span className="sr-leg-dot" style={{ background: axis.color }} />
                <span className="sr-leg-label">{axis.label}</span>
                <div className="sr-leg-track">
                  <div
                    className="sr-leg-fill"
                    style={{
                      width: `${axis.resume}%`,
                      background: axis.color,
                      transitionDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
                <span className="sr-leg-val" style={{ color: axis.color }}>{axis.resume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SkillRadar;