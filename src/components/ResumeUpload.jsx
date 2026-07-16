import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw,
  Sparkles, Zap, Shield, File, X
} from 'lucide-react';
import { simulateResumeParsing } from '../utils/aiSimulator';

const PARSING_STEPS = [
  { label: 'Reading file structure', icon: <File size={14} /> },
  { label: 'Extracting text & layout', icon: <FileText size={14} /> },
  { label: 'Running ATS compatibility checks', icon: <Shield size={14} /> },
  { label: 'Analyzing keywords & impact', icon: <Sparkles size={14} /> },
  { label: 'Generating AI suggestions', icon: <Zap size={14} /> },
  { label: 'Finalizing your report', icon: <CheckCircle2 size={14} /> },
];

export default function ResumeUpload({ onParsingComplete }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError]               = useState('');
  const [file, setFile]                 = useState(null);
  const [isParsing, setIsParsing]       = useState(false);
  const [parsingStatus, setParsingStatus] = useState({ progress: 0, message: '', stepIndex: 0 });
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const validateAndProcessFile = (selectedFile) => {
    setError('');
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError('Invalid format. Only PDF, DOCX, and TXT are supported.');
      return;
    }
    if (selectedFile.size > 8 * 1024 * 1024) {
      setError('File is too large. Maximum size is 8 MB.');
      return;
    }
    setFile(selectedFile);
    startParsingFlow(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) validateAndProcessFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) validateAndProcessFile(e.target.files[0]);
  };

  const startParsingFlow = (selectedFile) => {
    setIsParsing(true);
    setParsingStatus({ progress: 0, message: PARSING_STEPS[0].label, stepIndex: 0 });
    simulateResumeParsing(
      selectedFile,
      (progress, message) => {
        const stepIndex = Math.min(Math.floor((progress / 100) * PARSING_STEPS.length), PARSING_STEPS.length - 1);
        setParsingStatus({ progress, message, stepIndex });
      },
      (parsedProfile) => {
        setIsParsing(false);
        onParsingComplete(parsedProfile, selectedFile.name);
      }
    );
  };

  const resetUpload = () => {
    setFile(null); setError(''); setIsParsing(false);
    setParsingStatus({ progress: 0, message: '', stepIndex: 0 });
  };

  const formatSize = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="page-title">Upload Resume</h1>
        <p className="page-subtitle">Upload your resume and get a full AI-powered ATS analysis in under 30 seconds.</p>
      </motion.div>

      {/* Main Upload Area */}
      <AnimatePresence mode="wait">
        {!isParsing ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
          >
            {/* Drop Zone */}
            <div
              className={`upload-zone ${isDragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Animated cloud icon */}
              <motion.div
                animate={isDragActive ? { scale: 1.12, y: -6 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: isDragActive ? 'var(--grad-primary)' : 'rgba(37,99,235,0.08)',
                  display: 'grid', placeItems: 'center',
                  color: isDragActive ? '#fff' : 'var(--blue)',
                  margin: '0 auto 1.5rem',
                  transition: 'background 0.25s'
                }}
              >
                <UploadCloud size={34} strokeWidth={1.5} />
              </motion.div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                {isDragActive ? 'Drop your file here!' : 'Drag & drop your resume'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1.5rem' }}>
                or{' '}
                <span style={{ color: 'var(--blue)', fontWeight: 700, cursor: 'pointer' }}>
                  click to browse
                </span>
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['.PDF', '.DOCX', '.TXT'].map(fmt => (
                  <span key={fmt} className="badge" style={{ fontSize: '0.72rem' }}>{fmt}</span>
                ))}
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>Max 8 MB</span>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.85rem 1rem', marginTop: '0.75rem',
                    background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)',
                    borderRadius: 'var(--r-sm)'
                  }}
                >
                  <AlertCircle size={16} color="var(--red)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--red)', fontWeight: 600, flex: 1 }}>{error}</span>
                  <button onClick={() => setError('')}><X size={14} color="var(--red)" /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── PARSING STATE ────────────────────────────── */
          <motion.div
            key="parsing"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="card"
            style={{ padding: '3rem 2rem', textAlign: 'center' }}
          >
            {/* Animated Bars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '2rem' }}>
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{ width: 6, background: 'var(--grad-primary)', borderRadius: 3 }}
                  animate={{ height: [12, 36, 12], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.9, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.015em' }}>
                Analyzing Your Resume
              </h3>
              {file && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', background: 'var(--bg2)', borderRadius: 'var(--r-full)', fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 500 }}>
                  <FileText size={12} />
                  {file.name} · {formatSize(file.size)}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ margin: '0 auto 1.75rem', maxWidth: 420 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text2)' }}>{parsingStatus.message}</span>
                <span className="gradient-text">{parsingStatus.progress}%</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <motion.div
                  className="progress-bar-fill"
                  style={{ width: `${parsingStatus.progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Step Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
              {PARSING_STEPS.map((step, i) => {
                const done    = i < parsingStatus.stepIndex;
                const active  = i === parsingStatus.stepIndex;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.65rem',
                      fontSize: '0.8rem', fontWeight: active ? 700 : 500,
                      color: done ? 'var(--green)' : active ? 'var(--blue)' : 'var(--text3)'
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={14} color="var(--green)" />
                    ) : active ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--blue)', borderTopColor: 'transparent' }}
                      />
                    ) : (
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--border)' }} />
                    )}
                    {step.label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features row */}
      {!isParsing && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid-3"
          style={{ gap: '1rem' }}
        >
          {[
            { icon: <Shield size={18} />, color: '#2563eb', bg: 'rgba(37,99,235,0.08)', title: 'ATS Scoring', desc: 'Instant compatibility score against 500+ ATS systems' },
            { icon: <Sparkles size={18} />, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', title: 'AI Improvements', desc: 'Role-specific rewrites ranked by impact' },
            { icon: <Zap size={18} />, color: '#d97706', bg: 'rgba(217,119,6,0.08)', title: '30-Second Results', desc: 'Full analysis in under 30 seconds' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: f.bg, color: f.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{f.title}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text2)', lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
