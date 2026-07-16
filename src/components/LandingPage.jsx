import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, Shield, ArrowRight, Check, Star,
  BarChart2, FileText, Target, Brain, Users, TrendingUp,
  ChevronRight, Play, X
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Brain size={22} />,
    color: '#2563eb',
    colorBg: 'rgba(37,99,235,0.08)',
    title: 'AI-Powered Analysis',
    desc: 'Our model reads your resume like a top recruiter — evaluating impact, clarity, and role fit with surgical precision.'
  },
  {
    icon: <Shield size={22} />,
    color: '#7c3aed',
    colorBg: 'rgba(124,58,237,0.08)',
    title: 'ATS Compatibility',
    desc: 'Beat Applicant Tracking Systems. We score keyword density, formatting, and file structure against 500+ ATS systems.'
  },
  {
    icon: <Target size={22} />,
    color: '#16a34a',
    colorBg: 'rgba(22,163,74,0.08)',
    title: 'Job Match Scoring',
    desc: 'Paste any job description and instantly see a % match score with a gap analysis and action items.'
  },
  {
    icon: <TrendingUp size={22} />,
    color: '#d97706',
    colorBg: 'rgba(217,119,6,0.08)',
    title: 'Smart Suggestions',
    desc: "Actionable, role-specific improvements ranked by potential impact — not generic tips you've already seen."
  },
  {
    icon: <BarChart2 size={22} />,
    color: '#0891b2',
    colorBg: 'rgba(8,145,178,0.08)',
    title: 'Visual Score Dashboard',
    desc: 'See every dimension of your resume quality in one unified, beautiful dashboard.'
  },
  {
    icon: <FileText size={22} />,
    color: '#be185d',
    colorBg: 'rgba(190,24,93,0.08)',
    title: 'Version History',
    desc: 'Track every improvement over time. Compare versions and see your progress in real numbers.'
  }
];

const STATS = [
  { value: '4.2M+', label: 'Resumes Analyzed' },
  { value: '96%', label: 'ATS Pass Rate' },
  { value: '3.8×', label: 'More Interview Callbacks' },
  { value: '< 30s', label: 'Average Analysis Time' }
];

const TESTIMONIALS = [
  {
    quote: 'I went from zero interviews in 3 months to 5 in one week after using ResumeAI. The ATS suggestions were the game changer.',
    name: 'Priya Mehta',
    role: 'Software Engineer at Google',
    initials: 'PM',
    gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)'
  },
  {
    quote: 'The job description matching feature is incredible. It shows you exactly which keywords are missing and why they matter.',
    name: 'Marcus Johnson',
    role: 'Product Manager at Stripe',
    initials: 'MJ',
    gradient: 'linear-gradient(135deg, #059669, #0891b2)'
  },
  {
    quote: 'As a career coach, I recommend ResumeAI to every client. The depth of analysis it provides in seconds would take me hours.',
    name: 'Sarah Chen',
    role: 'Senior Career Coach',
    initials: 'SC',
    gradient: 'linear-gradient(135deg, #d97706, #dc2626)'
  }
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Get started with AI basics',
    features: ['3 resume analyses/month', 'ATS score check', 'Basic suggestions', 'PDF export'],
    cta: 'Start Free',
    gradient: null,
    featured: false
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    desc: 'For serious job seekers',
    features: ['Unlimited analyses', 'Job description matching', 'AI career coach chat', 'Version history', 'Priority processing', 'Cover letter AI'],
    cta: 'Start Pro Trial',
    gradient: 'var(--grad-primary)',
    featured: true
  },
  {
    name: 'Team',
    price: '$39',
    period: '/month',
    desc: 'For agencies & teams',
    features: ['Everything in Pro', '10 team seats', 'Admin dashboard', 'API access', 'White-label export', 'Priority support'],
    cta: 'Contact Sales',
    gradient: null,
    featured: false
  }
];

function AnimatedCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(end.replace(/[^0-9.]/g, ''));
    const dur = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount((num * eased).toFixed(num % 1 !== 0 ? 1 : 0));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end]);

  const prefix = end.startsWith('$') ? '$' : end.startsWith('<') ? '< ' : '';
  const sfx = end.replace(/[^a-zA-Z%+×/]/g, '');

  return (
    <span ref={ref} className="stat-value gradient-text">
      {prefix}{count}{sfx || suffix}
    </span>
  );
}

export default function LandingPage({ onGetStarted, onLogin, onDemo, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Ambient Background ────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div
          className="glow-blob glow-blob-1"
          style={{ top: '-8%', left: '-10%', opacity: 0.7 }}
        />
        <div
          className="glow-blob glow-blob-2"
          style={{ bottom: '5%', right: '-8%', opacity: 0.6 }}
        />
        <div
          className="glow-blob"
          style={{ width: 320, height: 320, top: '40%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float-slow 22s ease-in-out infinite', opacity: 0.8 }}
        />
      </div>

      {/* ── Sticky Nav ─────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: '1rem', zIndex: 200, padding: '0 1.5rem' }}>
        <motion.nav
          className="glass"
          style={{ borderRadius: 'var(--r-xl)', padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--grad-primary)', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: 'var(--shadow-blue)' }}>
              <Sparkles size={15} />
            </div>
            Resume<span className="gradient-text">AI</span>
          </div>

          {/* Desktop Links */}
          <div className="nav-links" style={{ display: 'flex', gap: '0.25rem' }}>
            {['Features', 'Pricing', 'How it Works', 'Testimonials'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="nav-link">{l}</a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={toggleTheme} style={{ borderRadius: 'var(--r-full)', padding: '0.4rem 0.65rem' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onLogin}>Sign In</button>
            <motion.button
              className="btn btn-primary btn-sm"
              onClick={onGetStarted}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started <ArrowRight size={13} />
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0 4rem', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="hero-section" style={{ gap: '3rem' }}>
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div className="hero-badge">
                  <Sparkles size={13} />
                  Powered by Gemini AI — Trusted by 4M+ job seekers
                  <ChevronRight size={13} />
                </div>
              </motion.div>

              <motion.h1
                className="hero-headline"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                Your Resume,{' '}
                <span className="gradient-text">Supercharged</span>{' '}
                by AI
              </motion.h1>

              <motion.p
                className="hero-subheadline"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                Get an instant ATS score, keyword analysis, job-match scoring, and AI-generated improvements — in under 30 seconds.
              </motion.p>

              <motion.div
                className="hero-ctas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.button
                  className="btn btn-primary btn-lg"
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ boxShadow: 'var(--shadow-blue)' }}
                >
                  <Zap size={17} />
                  Analyze My Resume — Free
                </motion.button>
                <button className="btn btn-secondary btn-lg" onClick={onDemo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--grad-primary)', display: 'grid', placeItems: 'center' }}>
                    <Play size={9} color="#fff" fill="#fff" />
                  </div>
                  View Live Demo
                </button>
              </motion.div>

              <motion.div
                className="hero-proof"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.45 }}
              >
                {['No signup required', 'Results in 30 seconds', '100% free to start'].map(p => (
                  <div key={p} className="hero-proof-item">
                    <Check size={13} color="var(--green)" />
                    {p}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative' }}
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <AnimatedCounter end={s.value} />
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" className="section">
        <div className="container">
          <motion.div {...fadeUp(0)} style={{ marginBottom: '3.5rem' }}>
            <div className="section-label"><Sparkles size={13} /> Features</div>
            <h2 className="section-title">Everything you need to land the job</h2>
            <p className="section-subtitle">
              From instant ATS scoring to personalized AI coaching — ResumeAI has every tool a modern job seeker needs.
            </p>
          </motion.div>

          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card"
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon" style={{ background: f.colorBg, color: f.color }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '0.97rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how-it-works" className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><Zap size={13} /> How it Works</div>
            <h2 className="section-title">From upload to offer in 3 steps</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', position: 'relative' }}>
            {/* Connector */}
            <div style={{ position: 'absolute', top: '2.5rem', left: '18%', right: '18%', height: '1px', background: 'linear-gradient(90deg, var(--blue), var(--purple))', opacity: 0.3, zIndex: 0 }} />
            {[
              { step: '01', icon: <FileText size={24} />, title: 'Upload Your Resume', desc: 'Drag & drop your PDF or Word file. We support all major formats.' },
              { step: '02', icon: <Brain size={24} />, title: 'AI Analyzes Everything', desc: 'Our Gemini-powered model scans for ATS compliance, keyword gaps, impact metrics and more.' },
              { step: '03', icon: <TrendingUp size={24} />, title: 'Get Personalized Results', desc: 'Receive a full report with your score, job-match analysis, and a prioritized action plan.' }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeUp(i * 0.12)}
                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'grid', placeItems: 'center',
                  color: '#fff', margin: '0 auto 1.25rem',
                  boxShadow: 'var(--shadow-blue)'
                }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Step {item.step}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.65 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section id="testimonials" className="section">
        <div className="container">
          <motion.div {...fadeUp(0)} style={{ marginBottom: '3.5rem' }}>
            <div className="section-label"><Star size={13} /> Testimonials</div>
            <h2 className="section-title">Trusted by job seekers worldwide</h2>
            <p className="section-subtitle">See what real users are saying after using ResumeAI to land their dream jobs.</p>
          </motion.div>

          <div className="grid-3" style={{ gap: '1.5rem', alignItems: 'start' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} className="testimonial-card" {...fadeUp(i * 0.1)} whileHover={{ y: -4 }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.gradient }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.87rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section id="pricing" className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><Zap size={13} /> Pricing</div>
            <h2 className="section-title">Simple, transparent pricing</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Start free. Upgrade when you're ready.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', alignItems: 'start' }}>
            {PRICING.map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp(i * 0.1)}
                style={{
                  background: p.featured ? 'var(--surface)' : 'var(--bg)',
                  border: `1.5px solid ${p.featured ? 'var(--blue)' : 'var(--border)'}`,
                  borderRadius: 'var(--r-lg)',
                  padding: '2rem',
                  position: 'relative',
                  boxShadow: p.featured ? 'var(--shadow-blue)' : 'var(--shadow-xs)'
                }}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
              >
                {p.featured && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--grad-primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '0.25rem 0.85rem', borderRadius: 'var(--r-full)', whiteSpace: 'nowrap' }}>
                    Most Popular
                  </div>
                )}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{p.price}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{p.period}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: '0.25rem' }}>{p.desc}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.75rem' }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
                      <Check size={14} color="var(--green)" strokeWidth={2.5} />
                      {f}
                    </div>
                  ))}
                </div>

                <motion.button
                  className={p.featured ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ width: '100%' }}
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {p.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div
            {...fadeUp(0)}
            style={{
              background: 'var(--grad-vivid)',
              borderRadius: 'var(--r-xl)',
              padding: '5rem 3rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decoration */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="badge badge-blue" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: '1.25rem' }}>
                <Zap size={11} />
                No credit card required
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
                Ready to land your dream job?
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto 2.5rem' }}>
                Join 4+ million professionals who use ResumeAI to get more interviews, faster.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  className="btn btn-lg"
                  style={{ background: '#fff', color: 'var(--blue)', fontWeight: 700, boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Zap size={17} />
                  Analyze My Resume Free
                </motion.button>
                <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }} onClick={onDemo}>
                  View Live Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--grad-primary)', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Sparkles size={13} />
                </div>
                Resume<span className="gradient-text">AI</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 260 }}>
                The most powerful AI resume analyzer on the market. Built for modern job seekers.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Documentation', 'Contact', 'Privacy Policy', 'Terms'] }
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: '1rem' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: '0.85rem', color: 'var(--text2)', transition: 'color 0.15s' }} onMouseEnter={e => e.target.style.color='var(--text)'} onMouseLeave={e => e.target.style.color='var(--text2)'}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>© 2025 ResumeAI. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                <a key={s} href="#" style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Hero Visual Component ───────────────────────────── */
function HeroVisual() {
  return (
    <div style={{ position: 'relative', height: 440 }}>
      {/* Main Card */}
      <motion.div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 2
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Score Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.2rem' }}>ATS Score</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }} className="gradient-text">87<span style={{ fontSize: '1.2rem' }}>/100</span></div>
          </div>
          <ScoreMiniRing score={87} />
        </div>

        {/* Score Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Keywords', pct: 92, color: 'var(--blue)' },
            { label: 'Formatting', pct: 78, color: 'var(--purple)' },
            { label: 'Impact', pct: 85, color: 'var(--green)' },
            { label: 'Readability', pct: 88, color: 'var(--amber)' }
          ].map(item => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '0.25rem' }}>
                <span>{item.label}</span>
                <span style={{ color: 'var(--text)' }}>{item.pct}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-bar-fill"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-green">✓ ATS Friendly</span>
          <span className="badge badge-blue">AI Enhanced</span>
          <span className="badge badge-amber">3 Improvements</span>
        </div>
      </motion.div>

      {/* Floating Pill — Top Right */}
      <motion.div
        style={{
          position: 'absolute', top: -20, right: -24,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-full)', padding: '0.6rem 1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: 'var(--shadow-lg)', fontSize: '0.8rem', fontWeight: 700, zIndex: 3
        }}
        animate={{ y: [0, -5, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <span style={{ fontSize: '1rem' }}>🎯</span>
        <span>94% Job Match</span>
      </motion.div>

      {/* Floating Pill — Bottom Left */}
      <motion.div
        style={{
          position: 'absolute', bottom: -14, left: -20,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-full)', padding: '0.55rem 0.9rem',
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          boxShadow: 'var(--shadow-lg)', fontSize: '0.78rem', fontWeight: 700, zIndex: 3
        }}
        animate={{ y: [0, 5, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
        <span>Analysis Complete in 28s</span>
      </motion.div>

      {/* Decorative blur */}
      <div style={{
        position: 'absolute', bottom: -60, right: -60,
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', zIndex: 1, pointerEvents: 'none', borderRadius: '50%'
      }} />
    </div>
  );
}

function ScoreMiniRing({ score }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={36} cy={36} r={r} fill="none" stroke="var(--bg2)" strokeWidth={6} />
      <motion.circle
        cx={36} cy={36} r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, delay: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <text x={36} y={36} textAnchor="middle" dominantBaseline="central" style={{ transform: 'rotate(90deg)', transformOrigin: '36px 36px', fill: 'var(--text)', fontSize: '12px', fontWeight: 800 }}>
        {score}
      </text>
    </svg>
  );
}
