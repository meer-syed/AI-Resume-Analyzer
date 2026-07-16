import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, CheckCircle, AlertTriangle, FileSearch,
  Sparkles, ChevronRight, Zap, Target, TrendingUp, X
} from 'lucide-react';
import { simulateJobAnalysis } from '../utils/aiSimulator';

const SAMPLE_JOB = `Staff Platform Engineer (Cloud Security)

We are seeking a senior infrastructure technologist to design AWS landing zones, manage Kubernetes clusters, configure automated Terraform modules, and implement Prometheus/Grafana observability dashboards. Experience with TypeScript or Go backend development, Docker containers, and CI/CD pipelines is required. The ideal candidate is passionate about reliability engineering and has a deep understanding of cloud-native architectures.`;

export default function JobAnalyzer({ resume, onUpdateResume }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [analysisLog, setAnalysisLog]       = useState('');
  const [result, setResult]                 = useState(null);

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!jobDescription || !resume) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const analysisResult = await simulateJobAnalysis(resume, jobDescription, (log) => setAnalysisLog(log));
      setIsAnalyzing(false);
      setResult(analysisResult);
      onUpdateResume({ ...resume, jobMatching: analysisResult });
    } catch {
      setIsAnalyzing(false);
      setAnalysisLog('Analysis failed. Please try again.');
    }
  };

  const matchColor = result
    ? result.matchScore >= 80 ? 'var(--green)' : result.matchScore >= 60 ? 'var(--amber)' : 'var(--red)'
    : 'var(--blue)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="page-title">Job Description Matcher</h1>
        <p className="page-subtitle">Paste any job description to see how well your resume matches — plus missing keywords and gap analysis.</p>
      </motion.div>

      {!resume && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertTriangle size={32} color="var(--amber)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Load a resume first to use the job matcher.</p>
        </div>
      )}

      {resume && (
        <div style={{ display: 'grid', gridTemplateColumns: result ? '0.9fr 1.1fr' : '1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Input Column */}
          <motion.div className="card" style={{ padding: '1.75rem' }} layout>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37,99,235,0.1)', color: 'var(--blue)', display: 'grid', placeItems: 'center' }}>
                <FileSearch size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.05rem' }}>Job Description</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Paste the full job listing</p>
              </div>
            </div>

            <form onSubmit={handleStartAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={10}
                  style={{ minHeight: 220, fontSize: '0.83rem', lineHeight: 1.65 }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                    {jobDescription.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    type="button"
                    onClick={() => setJobDescription(SAMPLE_JOB)}
                    style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Sparkles size={11} /> Load Sample Job
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={isAnalyzing || !jobDescription.trim()}
                whileHover={!isAnalyzing ? { scale: 1.02, y: -1 } : {}}
                whileTap={{ scale: 0.98 }}
                style={{ opacity: isAnalyzing || !jobDescription.trim() ? 0.7 : 1 }}
              >
                {isAnalyzing ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff' }}
                    />
                    {analysisLog || 'Analyzing...'}
                  </>
                ) : (
                  <><Zap size={15} /> Analyze Match</>
                )}
              </motion.button>
            </form>

            {/* Analyzing steps */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg2)', borderRadius: 'var(--r-sm)', fontSize: '0.78rem', color: 'var(--text2)' }}
                >
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.65rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{ height: 3, flex: 1, borderRadius: 2, background: 'var(--blue)' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  {analysisLog}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Column */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
              >
                {/* Score Hero */}
                <div className="card" style={{ padding: '1.75rem', textAlign: 'center', background: `linear-gradient(135deg, ${matchColor}0d, ${matchColor}05)` }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem' }}>Match Score</div>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
                    style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, color: matchColor, marginBottom: '0.5rem' }}
                  >
                    {result.matchScore}%
                  </motion.div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1rem' }}>{result.targetJob}</div>

                  {/* Mini bars */}
                  <div className="progress-bar" style={{ height: 8 }}>
                    <motion.div
                      className="progress-bar-fill"
                      style={{ background: matchColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.matchScore}%` }}
                      transition={{ duration: 1.2, delay: 0.2, ease: [0.34, 1.1, 0.64, 1] }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text3)', marginTop: '0.4rem' }}>
                    <span>0%</span><span>Perfect Match: 100%</span>
                  </div>
                </div>

                {/* Matched Skills */}
                <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={14} color="var(--green)" /> Matched Skills
                    </h4>
                    <span className="badge badge-green">{result.matchedSkills.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {result.matchedSkills.map(s => (
                      <span key={s} className="badge badge-green" style={{ fontSize: '0.72rem' }}>✓ {s}</span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <X size={14} color="var(--red)" /> Missing Keywords
                    </h4>
                    <span className="badge badge-red">{result.missingSkills.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    {result.missingSkills.map(s => (
                      <span key={s} className="badge badge-red" style={{ fontSize: '0.72rem' }}>+ {s}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.5 }}>
                    Adding these skills to your resume could raise your match score significantly.
                  </p>
                </div>

                {/* Recommendations */}
                <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={14} color="var(--blue)" /> AI Recommendations
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.55 }}
                      >
                        <ChevronRight size={13} color="var(--blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                        {rec}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
