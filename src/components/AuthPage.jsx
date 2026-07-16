import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowLeft, Mail, Lock, User, Eye, EyeOff,
  Check, X, Shield, ChevronRight, Zap
} from 'lucide-react';

const PASSWORD_CHECKS = [
  { key: 'length',  label: 'At least 8 characters', test: p => p.length >= 8 },
  { key: 'number',  label: 'Contains a number',      test: p => /[0-9]/.test(p) },
  { key: 'capital', label: 'Contains uppercase',     test: p => /[A-Z]/.test(p) },
  { key: 'symbol',  label: 'Contains a symbol',      test: p => /[^A-Za-z0-9]/.test(p) },
];

export default function AuthPage({ onAuthSuccess, onBackToHome }) {
  const [tab, setTab]               = useState('login'); // login | register | forgot
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [name, setName]             = useState('');
  const [showPass, setShowPass]     = useState(false);

  const checks = PASSWORD_CHECKS.map(c => ({ ...c, passed: c.test(password) }));
  const passScore = checks.filter(c => c.passed).length;
  const strengthColor = passScore <= 1 ? 'var(--red)' : passScore <= 2 ? 'var(--amber)' : passScore === 3 ? 'var(--blue)' : 'var(--green)';
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passScore] || '';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onAuthSuccess({
      name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: email.toLowerCase() === 'admin@resumeai.com' ? 'Admin' : 'Premium User'
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onAuthSuccess({ name, email, role: 'Premium User' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflow: 'hidden'
    }}>
      {/* ── Left Panel ─── */}
      <div style={{
        background: 'var(--grad-vivid)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
            <Sparkles size={16} />
          </div>
          ResumeAI
        </div>

        {/* Main copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem' }}
          >
            Land your dream job with AI.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: 360, marginBottom: '2.5rem' }}
          >
            Join 4 million+ professionals who use ResumeAI to beat ATS systems and get more interviews.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[
              { stat: '96%', label: 'ATS Pass Rate' },
              { stat: '3.8×', label: 'More Interview Callbacks' },
              { stat: '< 30s', label: 'Instant Analysis' },
            ].map(s => (
              <div key={s.stat} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>{s.stat}</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem' }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer note */}
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', position: 'relative', zIndex: 1 }}>
          © 2025 ResumeAI — Powered by Gemini AI
        </div>
      </div>

      {/* ── Right Panel ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', background: 'var(--bg)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Back button */}
          <button
            onClick={onBackToHome}
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '2rem', borderRadius: 'var(--r-full)' }}
          >
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
            Back to Home
          </button>

          <AnimatePresence mode="wait">
            {tab === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>Welcome back</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Sign in to your ResumeAI account</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                      <input
                        type="email" required
                        className="form-control"
                        style={{ paddingLeft: '2.2rem' }}
                        placeholder="you@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                      <button type="button" onClick={() => setTab('forgot')} style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 600 }}>Forgot?</button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                      <input
                        type={showPass ? 'text' : 'password'} required
                        className="form-control"
                        style={{ paddingLeft: '2.2rem', paddingRight: '2.8rem' }}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }}
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap size={15} /> Sign In
                  </motion.button>
                </form>

                <div className="divider-text" style={{ margin: '1.5rem 0' }}>or</div>

                <button
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => onAuthSuccess({ name: 'Alex Rivera', email: 'demo@resumeai.com', role: 'Premium User' })}
                >
                  <Sparkles size={15} /> Continue with Demo Account
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text2)', marginTop: '1.5rem' }}>
                  No account?{' '}
                  <button onClick={() => setTab('register')} style={{ color: 'var(--blue)', fontWeight: 700 }}>Create one free</button>
                </p>
              </motion.div>
            )}

            {tab === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>Create Account</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Free forever — no credit card required</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                      <input type="text" required className="form-control" style={{ paddingLeft: '2.2rem' }} placeholder="Alex Rivera" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                      <input type="email" required className="form-control" style={{ paddingLeft: '2.2rem' }} placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                      <input type={showPass ? 'text' : 'password'} required className="form-control" style={{ paddingLeft: '2.2rem', paddingRight: '2.8rem' }} placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {password && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', gap: '4px', margin: '0.5rem 0 0.35rem' }}>
                          {[1, 2, 3, 4].map(n => (
                            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: passScore >= n ? strengthColor : 'var(--border)', transition: 'background 0.25s' }} />
                          ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {checks.map(c => (
                            <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: c.passed ? 'var(--green)' : 'var(--text3)' }}>
                              {c.passed ? <Check size={10} /> : <X size={10} />}
                              {c.label}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <motion.button type="submit" className="btn btn-primary" style={{ width: '100%' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Shield size={15} /> Create Free Account
                  </motion.button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text2)', marginTop: '1.5rem' }}>
                  Already have an account?{' '}
                  <button onClick={() => setTab('login')} style={{ color: 'var(--blue)', fontWeight: 700 }}>Sign in</button>
                </p>
              </motion.div>
            )}

            {tab === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>Reset Password</h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Enter your email and we'll send a reset link</p>
                </div>

                <form onSubmit={e => { e.preventDefault(); setTab('login'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                      <input type="email" required className="form-control" style={{ paddingLeft: '2.2rem' }} placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <motion.button type="submit" className="btn btn-primary" style={{ width: '100%' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Send Reset Link
                  </motion.button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text2)', marginTop: '1.5rem' }}>
                  <button onClick={() => setTab('login')} style={{ color: 'var(--blue)', fontWeight: 700 }}>← Back to Sign In</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 1fr 1fr"] > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
