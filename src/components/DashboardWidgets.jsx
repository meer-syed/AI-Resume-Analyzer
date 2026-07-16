import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, Upload, TrendingUp, Award, AlertTriangle,
  CheckCircle, Clock, Zap, FileSearch, HelpCircle, ChevronRight,
  Star, Target, BarChart2
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }
});

export default function DashboardWidgets({ resume, history = [], onNavigate }) {
  if (!resume) {
    return <EmptyDashboard onNavigate={onNavigate} />;
  }

  const ats = resume.ats;
  const issues = ats.issues || [];
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount  = issues.filter(i => i.severity === 'warning').length;
  const recentHistory = history.slice(0, 5);

  const metrics = [
    {
      label: 'ATS Score',
      value: `${ats.overall}`,
      suffix: '/100',
      icon: <Award size={20} />,
      iconBg: 'rgba(37,99,235,0.1)',
      iconColor: '#2563eb',
      change: '+8 from last',
      trend: 'up'
    },
    {
      label: 'Keywords Match',
      value: `${resume.jobMatching?.matchScore ?? 88}%`,
      suffix: '',
      icon: <Target size={20} />,
      iconBg: 'rgba(124,58,237,0.1)',
      iconColor: '#7c3aed',
      change: '+12% improved',
      trend: 'up'
    },
    {
      label: 'Issues Found',
      value: `${issues.length}`,
      suffix: '',
      icon: <AlertTriangle size={20} />,
      iconBg: 'rgba(217,119,6,0.1)',
      iconColor: '#d97706',
      change: `${criticalCount} critical`,
      trend: criticalCount > 0 ? 'down' : 'neutral'
    },
    {
      label: 'Skills Extracted',
      value: `${resume.skills?.length ?? 0}`,
      suffix: '',
      icon: <Sparkles size={20} />,
      iconBg: 'rgba(22,163,74,0.1)',
      iconColor: '#16a34a',
      change: 'Verified by AI',
      trend: 'up'
    }
  ];

  const scores = [
    { label: 'Keywords',    value: ats.keywords     ?? 90, color: '#2563eb' },
    { label: 'Formatting',  value: ats.formatting   ?? 78, color: '#7c3aed' },
    { label: 'Impact',      value: ats.impact       ?? 85, color: '#16a34a' },
    { label: 'Readability', value: ats.readability  ?? 92, color: '#d97706' },
    { label: 'Experience',  value: ats.experience   ?? 80, color: '#0891b2' },
  ];

  const quickActions = [
    { id: 'analysis',  icon: <BarChart2 size={18} />, label: 'View Full Analysis', color: '#2563eb' },
    { id: 'jobMatch',  icon: <FileSearch size={18} />, label: 'Match a Job Description', color: '#7c3aed' },
    { id: 'tools',     icon: <HelpCircle size={18} />, label: 'Career AI Tools', color: '#16a34a' },
    { id: 'upload',    icon: <Upload size={18} />, label: 'Upload New Version', color: '#d97706' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Page Header */}
      <motion.div {...fadeUp(0)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-title">Welcome back, {resume.name?.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">Here's your resume performance summary for <strong>{resume.title}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('upload')}>
              <Upload size={14} /> New Resume
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('analysis')}>
              View Analysis <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid-4" style={{ gap: '1rem' }}>
        {metrics.map((m, i) => (
          <motion.div key={m.label} className="metric-card" {...fadeUp(0.06 * i)}>
            <div className="metric-icon" style={{ background: m.iconBg, color: m.iconColor }}>
              {m.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <motion.span
                  className="metric-value"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + 0.06 * i }}
                >
                  {m.value}
                </motion.span>
                {m.suffix && <span style={{ fontSize: '0.9rem', color: 'var(--text3)', fontWeight: 600 }}>{m.suffix}</span>}
              </div>
              <div className="metric-label">{m.label}</div>
              <div className={`metric-change ${m.trend}`}>{m.change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Score Breakdown + Chart */}
      <div className="grid-2" style={{ gap: '1.25rem' }}>

        {/* Score Breakdown */}
        <motion.div className="card" style={{ padding: '1.5rem' }} {...fadeUp(0.12)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.15rem' }}>Score Breakdown</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>ATS compatibility across 5 dimensions</p>
            </div>
            <ScoreRing score={ats.overall} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scores.map((s, i) => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text2)' }}>{s.label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color }}>{s.value}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-bar-fill"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.34, 1.2, 0.64, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trend Chart */}
        <motion.div className="card" style={{ padding: '1.5rem' }} {...fadeUp(0.16)}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.15rem' }}>Improvement Trend</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Score history across resume versions</p>
          </div>
          <TrendChart history={recentHistory} atsScore={ats.overall} />
        </motion.div>
      </div>

      {/* Issues + Quick Actions */}
      <div className="grid-2" style={{ gap: '1.25rem' }}>

        {/* Issues List */}
        <motion.div className="card" style={{ padding: '1.5rem' }} {...fadeUp(0.2)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Issues to Fix</h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {criticalCount > 0 && <span className="badge badge-red">{criticalCount} Critical</span>}
              {warningCount > 0  && <span className="badge badge-amber">{warningCount} Warning</span>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {issues.slice(0, 4).map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.75rem', borderRadius: 'var(--r-sm)',
                  background: issue.severity === 'critical' ? 'rgba(220,38,38,0.04)' : 'rgba(217,119,6,0.04)',
                  border: `1px solid ${issue.severity === 'critical' ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)'}`
                }}
              >
                {issue.severity === 'critical'
                  ? <AlertTriangle size={14} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />
                  : <AlertTriangle size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.15rem' }}>{issue.section}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)', lineHeight: 1.5 }}>{issue.message}</div>
                </div>
              </motion.div>
            ))}
            {issues.length > 4 && (
              <button
                style={{ fontSize: '0.8rem', color: 'var(--blue)', fontWeight: 600, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                onClick={() => onNavigate('analysis')}
              >
                View all {issues.length} issues <ChevronRight size={14} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="card" style={{ padding: '1.5rem' }} {...fadeUp(0.24)}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickActions.map((action, i) => (
              <motion.button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.85rem 1rem', borderRadius: 'var(--r-sm)',
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem',
                  textAlign: 'left', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 'var(--r-xs)', background: `${action.color}18`, color: action.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {action.icon}
                </div>
                <span style={{ flex: 1 }}>{action.label}</span>
                <ChevronRight size={14} color="var(--text3)" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skills Section */}
      {resume.skills && resume.skills.length > 0 && (
        <motion.div className="card" style={{ padding: '1.5rem' }} {...fadeUp(0.28)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Detected Skills</h3>
            <span className="badge badge-blue">{resume.skills.length} Skills</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {resume.skills.map((skill, i) => (
              <motion.span
                key={skill.name || skill}
                className="skill-tag"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.32 + i * 0.025, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {skill.name || skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── Empty State ──────────────────────────────────── */
function EmptyDashboard({ onNavigate }) {
  const actions = [
    { icon: <Upload size={22} />, label: 'Upload Resume', sub: 'PDF, DOCX, or TXT', id: 'upload', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
    { icon: <Sparkles size={22} />, label: 'Load Demo', sub: 'Software Engineer profile', id: 'demo', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Upload or load a demo resume to get started</p>
      </motion.div>

      {/* Welcome Card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.025) 0%, rgba(124,58,237,0.025) 100%)'
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'var(--grad-primary)',
            display: 'grid', placeItems: 'center',
            color: '#fff', margin: '0 auto 2rem',
            boxShadow: 'var(--shadow-blue)'
          }}
        >
          <Sparkles size={36} />
        </motion.div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
          Your AI Workspace is Ready
        </h2>
        <p style={{ color: 'var(--text2)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Upload your resume to get an instant ATS score, keyword analysis, job matching, and personalized AI suggestions.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {actions.map(a => (
            <motion.button
              key={a.id}
              onClick={() => onNavigate(a.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
                padding: '1.5rem 2rem', borderRadius: 'var(--r-md)',
                background: a.bg, border: `1.5px solid ${a.color}25`,
                color: a.color, cursor: 'pointer', minWidth: 160,
                transition: 'all 0.2s'
              }}
            >
              {a.icon}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.15rem' }}>{a.sub}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Feature preview row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: 600, margin: '0 auto' }}>
          {[
            { label: 'ATS Score', icon: '🎯', desc: 'Pass recruiter filters' },
            { label: 'Job Match', icon: '🔍', desc: 'See exact keyword gaps' },
            { label: 'AI Coach', icon: '🤖', desc: 'Get smart rewrites' },
          ].map(f => (
            <div key={f.label} style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{f.icon}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.15rem' }}>{f.label}</div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text3)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Score Ring SVG ───────────────────────────────── */
function ScoreRing({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="var(--bg2)" strokeWidth={7} />
        <motion.circle
          cx={36} cy={36} r={r}
          fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.34, 1.1, 0.64, 1] }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.04em', color }}>{score}</div>
      </div>
    </div>
  );
}

/* ── Trend Chart SVG ──────────────────────────────── */
function TrendChart({ history, atsScore }) {
  const rawScores = history.length >= 2
    ? history.map(h => h.score)
    : [Math.max(40, atsScore - 22), Math.max(50, atsScore - 12), atsScore - 5, atsScore];

  const W = 340, H = 120;
  const pad = { t: 12, r: 12, b: 28, l: 36 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const minV = Math.max(0, Math.min(...rawScores) - 10);
  const maxV = Math.min(100, Math.max(...rawScores) + 5);

  const toX = (i) => pad.l + (i / (rawScores.length - 1)) * iW;
  const toY = (v) => pad.t + iH - ((v - minV) / (maxV - minV)) * iH;

  const pts = rawScores.map((s, i) => ({ x: toX(i), y: toY(s), s }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length-1].x} ${pad.t + iH} L ${pts[0].x} ${pad.t + iH} Z`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[minV + (maxV - minV) * 0.25, minV + (maxV - minV) * 0.5, minV + (maxV - minV) * 0.75].map((v, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={toY(v)} y2={toY(v)} stroke="var(--border)" strokeDasharray="4 4" />
          <text x={pad.l - 6} y={toY(v) + 4} textAnchor="end" fontSize={9} fill="var(--text3)">{Math.round(v)}</text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#areaGrad)" />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#lineGrad2)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* Dots */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="var(--surface)" stroke="#2563eb" strokeWidth={2.5} />
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize={9} fill="var(--text3)">v{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
