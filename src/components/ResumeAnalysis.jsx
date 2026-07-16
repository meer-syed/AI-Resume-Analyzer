import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, Award, FileText,
  Clipboard, Check, Sparkles, BookOpen, Briefcase, Plus,
  Shield, Star
} from 'lucide-react';

const TABS = [
  { id: 'ats',     label: 'ATS Analysis' },
  { id: 'grammar', label: 'Grammar & Tone' },
  { id: 'parsed',  label: 'Resume Content' },
  { id: 'builder', label: 'AI Builder' },
];

export default function ResumeAnalysis({ resume, onUpdateResume }) {
  const [activeTab, setActiveTab] = useState('ats');
  const [copiedId, setCopiedId]   = useState(null);
  const [newSkill, setNewSkill]   = useState('');

  if (!resume) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><FileText size={28} /></div>
        <h3 style={{ fontWeight: 700 }}>No Resume Loaded</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Upload a resume or load a demo profile first.</p>
      </div>
    );
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleApplyRewrite = (grammarId, suggestedText, originalText) => {
    const updatedResume = { ...resume };
    let replaced = false;
    updatedResume.experience = updatedResume.experience.map(job => {
      const updatedDesc = job.description.map(line => {
        if (line.includes(originalText) || originalText.includes(line)) {
          replaced = true;
          return suggestedText;
        }
        return line;
      });
      return { ...job, description: updatedDesc };
    });
    if (replaced) {
      updatedResume.grammar.issues = updatedResume.grammar.issues.filter(i => i.id !== grammarId);
      updatedResume.ats.overall = Math.min(100, updatedResume.ats.overall + 3);
      onUpdateResume(updatedResume);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const updatedResume = { ...resume };
    updatedResume.skills.push({ name: newSkill.trim(), category: 'Technical', level: 'Advanced' });
    if (updatedResume.jobMatching.missingSkills.includes(newSkill.trim())) {
      updatedResume.jobMatching.missingSkills = updatedResume.jobMatching.missingSkills.filter(s => s !== newSkill.trim());
      updatedResume.jobMatching.matchedSkills.push(newSkill.trim());
      updatedResume.jobMatching.matchScore = Math.min(100, updatedResume.jobMatching.matchScore + 5);
    }
    updatedResume.ats.overall = Math.min(100, updatedResume.ats.overall + 2);
    onUpdateResume(updatedResume);
    setNewSkill('');
  };

  const breakdown = resume.ats.breakdown || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">AI Resume Analysis</h1>
            <p className="page-subtitle">Deep evaluation of <strong>{resume.name}</strong>'s resume</p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span className="stat-pill"><Award size={13} /> ATS Score: <strong style={{ color: 'var(--blue)' }}>{resume.ats.overall}/100</strong></span>
            <span className="stat-pill">{resume.grammar?.issues?.length ?? 0} Grammar Issues</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="tab-list">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {/* ── ATS ANALYSIS ──────────────────────────── */}
          {activeTab === 'ats' && (
            <div className="grid-2" style={{ gap: '1.25rem', alignItems: 'start' }}>
              {/* Score Panel */}
              <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem', alignSelf: 'flex-start' }}>Score Breakdown</h3>

                {/* Big Dial */}
                <div style={{ position: 'relative', width: 150, height: 150, marginBottom: '2rem' }}>
                  <svg width={150} height={150} viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={75} cy={75} r={60} stroke="var(--bg2)" strokeWidth={12} fill="none" />
                    <motion.circle
                      cx={75} cy={75} r={60}
                      stroke="url(#atsGrad)"
                      strokeWidth={12} fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - resume.ats.overall / 100) }}
                      transition={{ duration: 1.3, ease: [0.34, 1.1, 0.64, 1] }}
                    />
                    <defs>
                      <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }} className="gradient-text">{resume.ats.overall}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text3)', fontWeight: 600 }}>/ 100</div>
                    </div>
                  </div>
                </div>

                {/* Bars */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {[
                    { label: 'Formatting', value: breakdown.formatting ?? 82, color: '#2563eb' },
                    { label: 'Keyword Match', value: breakdown.keywords ?? 88, color: '#7c3aed' },
                    { label: 'Grammar', value: breakdown.grammar ?? 75, color: '#16a34a' },
                    { label: 'Section Headings', value: breakdown.sections ?? 90, color: '#d97706' },
                  ].map((item, i) => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                        <span style={{ color: 'var(--text2)' }}>{item.label}</span>
                        <span style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-bar-fill"
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.34, 1.2, 0.64, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues List */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Assessment Logs</h3>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className="badge badge-red">{resume.ats.issues.filter(i => i.severity === 'critical').length} Critical</span>
                    <span className="badge badge-amber">{resume.ats.issues.filter(i => i.severity === 'warning').length} Warning</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {resume.ats.issues.map((issue, idx) => {
                    const isInfo    = issue.severity === 'info';
                    const isWarning = issue.severity === 'warning';
                    const borderColor = isInfo ? 'rgba(22,163,74,0.2)' : isWarning ? 'rgba(217,119,6,0.2)' : 'rgba(220,38,38,0.2)';
                    const bgColor     = isInfo ? 'rgba(22,163,74,0.04)' : isWarning ? 'rgba(217,119,6,0.04)' : 'rgba(220,38,38,0.04)';

                    return (
                      <motion.div
                        key={issue.id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{ display: 'flex', gap: '0.85rem', padding: '0.85rem', borderRadius: 'var(--r-sm)', background: bgColor, border: `1px solid ${borderColor}` }}
                      >
                        <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>
                          {isInfo    && <CheckCircle2 size={15} color="var(--green)" />}
                          {isWarning && <AlertTriangle size={15} color="var(--amber)" />}
                          {!isInfo && !isWarning && <XCircle size={15} color="var(--red)" />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{issue.section}</span>
                            <span className={`badge ${isInfo ? 'badge-green' : isWarning ? 'badge-amber' : 'badge-red'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.55, margin: 0 }}>{issue.message}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── GRAMMAR & TONE ──────────────────────────── */}
          {activeTab === 'grammar' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Grammar & Tone Rewrites</h3>
                <span className="badge badge-blue">{resume.grammar.issues.length} Issues</span>
              </div>

              {resume.grammar.issues.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <CheckCircle2 size={44} color="var(--green)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>All Clear!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Grammar & tone analysis shows no weak verbs or passive constructions.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {resume.grammar.issues.map((issue, i) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{issue.type}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{issue.context}</span>
                      </div>

                      {/* Original */}
                      <div style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--red)', background: 'rgba(220,38,38,0.02)', fontSize: '0.875rem', color: 'var(--text2)' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '0.5rem' }}>Before</span>
                        {issue.text}
                      </div>

                      {/* Suggestion */}
                      <div style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--green)', background: 'rgba(22,163,74,0.02)', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '0.5rem' }}>After</span>
                          {issue.suggested}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => copyToClipboard(issue.suggested, issue.id)}
                          >
                            {copiedId === issue.id ? <Check size={12} color="var(--green)" /> : <Clipboard size={12} />}
                            {copiedId === issue.id ? 'Copied' : 'Copy'}
                          </button>
                          <motion.button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleApplyRewrite(issue.id, issue.suggested, issue.text)}
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          >
                            <Sparkles size={12} /> Apply
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PARSED CONTENT ──────────────────────────── */}
          {activeTab === 'parsed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header Card */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.4rem' }}>Candidate</div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.25rem' }}>{resume.name}</h2>
                    <div style={{ fontSize: '0.85rem', color: 'var(--blue)', fontWeight: 600, marginBottom: '0.75rem' }}>{resume.title}</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6 }}>{resume.summary}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', justifyContent: 'center' }}>
                    {[
                      { label: 'Email', value: resume.email },
                      { label: 'Phone', value: resume.phone },
                      { label: 'Location', value: resume.location },
                      { label: 'LinkedIn', value: resume.linkedin },
                    ].map(f => (
                      <div key={f.label} style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text3)', minWidth: 65 }}>{f.label}</span>
                        <span style={{ color: 'var(--text2)' }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1.25rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Experience */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={16} color="var(--blue)" /> Work Experience
                    </h3>
                    <div className="timeline">
                      {resume.experience.map((job, j) => (
                        <div key={j} className="timeline-item">
                          <div style={{ padding: '1rem', background: 'var(--bg2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.4rem' }}>
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{job.role}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--blue)', fontWeight: 600 }}>{job.company}</div>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>{job.date}</div>
                            </div>
                            <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {job.description.map((b, bi) => <li key={bi}>{b}</li>)}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.1rem' }}>Technical Projects</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {resume.projects.map((proj, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'var(--bg2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.87rem', fontWeight: 700 }}>{proj.name}</span>
                            <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}><Star size={10} /> {proj.stars}</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '0.6rem', lineHeight: 1.55 }}>{proj.description}</p>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {proj.tech.map(t => <span key={t} className="badge" style={{ fontSize: '0.68rem' }}>{t}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Skills */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Skills</h3>
                      <span className="badge badge-blue">{resume.skills.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {resume.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`skill-tag ${skill.level === 'Expert' ? 'skill-tag-expert' : ''}`}
                          style={{ background: skill.level === 'Expert' ? 'rgba(37,99,235,0.07)' : undefined, borderColor: skill.level === 'Expert' ? 'rgba(37,99,235,0.25)' : undefined, color: skill.level === 'Expert' ? 'var(--blue)' : undefined }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={16} color="var(--purple)" /> Education
                    </h3>
                    {resume.education.map((edu, i) => (
                      <div key={i} style={{ padding: '0.85rem', background: 'var(--bg2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.87rem', fontWeight: 700 }}>{edu.degree}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{edu.date}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text2)' }}>
                          <span>{edu.school}</span>
                          <span>GPA: {edu.gpa}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certs */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={16} color="var(--green)" /> Certifications
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {resume.certifications.map((c, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'var(--bg2)', borderRadius: 'var(--r-xs)' }}>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{c.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{c.issuer}</div>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{c.date}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem' }}>Languages</div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {resume.languages.map(l => <span key={l} className="badge">{l}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── AI BUILDER ──────────────────────────────── */}
          {activeTab === 'builder' && (
            <div className="grid-2" style={{ gap: '1.25rem', alignItems: 'start' }}>
              {/* Add Skill */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.1)', color: 'var(--blue)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>AI Resume Builder</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5 }}>Add skills and improvements in real-time. AI instantly updates your ATS score.</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="form-label" style={{ marginBottom: '0.5rem' }}>Add Missing Skill</div>
                  <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      required
                      type="text"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      placeholder="e.g. Terraform, GraphQL, Rust"
                      className="form-control"
                    />
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </form>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div className="form-label" style={{ marginBottom: '0.5rem' }}>Suggested Skills</div>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {['Terraform', 'Go', 'Prometheus', 'Kubernetes', 'gRPC', 'Rust'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewSkill(s)}
                        className="skill-tag"
                        style={{ cursor: 'pointer' }}
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="surface-inset">
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.4rem' }}>AI Recommendation</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.6 }}>
                    Adding <strong>Terraform</strong> and <strong>Kubernetes</strong> will resolve 2 critical ATS keyword issues and improve your job match score by an estimated <strong>+12%</strong>.
                  </p>
                </div>
              </div>

              {/* Score Improvement Preview */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Score Impact Preview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Current ATS Score', value: resume.ats.overall, color: 'var(--blue)' },
                    { label: 'Potential Score (if 3 skills added)', value: Math.min(100, resume.ats.overall + 9), color: 'var(--green)' },
                    { label: 'Job Match Score', value: resume.jobMatching?.matchScore ?? 78, color: 'var(--purple)' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{item.label}</span>
                        <span style={{ fontWeight: 800, color: item.color }}>{item.value}/100</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-bar-fill"
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, ease: [0.34, 1.2, 0.64, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <div className="form-label" style={{ marginBottom: '0.6rem' }}>Current Skills ({resume.skills.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: 150, overflowY: 'auto' }}>
                    {resume.skills.map((s, i) => (
                      <motion.span
                        key={s.name}
                        className="skill-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        {s.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
