import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Sun, Moon, Search, Bell, Upload, History as HistoryIcon,
  BarChart2, FileSearch, HelpCircle, User, Settings as SettingsIcon,
  LogOut, ChevronLeft, Award, FileDown, Menu, X, ChevronRight,
  Shield, Zap
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DashboardWidgets from './components/DashboardWidgets';
import ResumeUpload from './components/ResumeUpload';
import ResumeAnalysis from './components/ResumeAnalysis';
import JobAnalyzer from './components/JobAnalyzer';
import CareerTools from './components/CareerTools';
import History from './components/History';
import ProfileSettings from './components/ProfileSettings';
import AdminDashboard from './components/AdminDashboard';

import { initialHistory, mockNotifications } from './utils/mockData';

const SIDEBAR_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
      { id: 'upload',    label: 'Upload Resume', icon: Upload },
      { id: 'analysis',  label: 'AI Analysis',  icon: Award },
    ]
  },
  {
    label: 'Tools',
    items: [
      { id: 'jobMatch',  label: 'Job Matcher',  icon: FileSearch },
      { id: 'tools',     label: 'Career AI',    icon: HelpCircle },
      { id: 'history',   label: 'History',      icon: HistoryIcon },
    ]
  },
  {
    label: 'Account',
    items: [
      { id: 'settings',  label: 'Settings',     icon: SettingsIcon },
    ]
  }
];

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  upload:    'Upload Resume',
  analysis:  'AI Analysis',
  jobMatch:  'Job Matcher',
  tools:     'Career AI Tools',
  history:   'Version History',
  settings:  'Settings',
  admin:     'Admin Panel',
  report:    'Export Report'
};

export default function App() {
  const [user, setUser]                   = useState(null);
  const [theme, setTheme]                 = useState('light');
  const [activeTab, setActiveTab]         = useState('dashboard');
  const [activeResume, setActiveResume]   = useState(null);
  const [history, setHistory]             = useState(initialHistory);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const notifRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLoadDemo = () => {
    setUser({ name: 'Alex Rivera', email: 'alex.rivera@devmail.io', role: 'Premium User' });
    import('./utils/mockData').then(({ mockProfiles }) => {
      setActiveResume(mockProfiles.software_engineer);
      setActiveTab('dashboard');
    });
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleParsingComplete = (parsedProfile, originalFileName) => {
    setActiveResume(parsedProfile);
    const newHistoryItem = {
      id: `h-${Date.now()}`,
      fileName: originalFileName,
      score: parsedProfile.ats.overall,
      version: `v${(history.length + 1).toFixed(1)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      parsedProfile: originalFileName.toLowerCase().includes('design') ? 'product_designer' : 'software_engineer',
      jobTarget: parsedProfile.jobMatching.targetJob
    };
    setHistory([newHistoryItem, ...history]);
    const newNotif = {
      id: `n-${Date.now()}`,
      type: 'success',
      text: `"${originalFileName}" analyzed! ATS Score: ${parsedProfile.ats.overall}.`,
      time: 'Just now',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
    setActiveTab('analysis');
  };

  const handleDeleteHistory = (histId) => setHistory(history.filter(h => h.id !== histId));

  const handleSelectResume = (profileKey) => {
    import('./utils/mockData').then(({ mockProfiles }) => {
      setActiveResume(mockProfiles[profileKey]);
    });
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── GUARD: Landing & Auth ────────────────────────────
  if (!user) {
    if (activeTab === 'auth') {
      return <AuthPage onAuthSuccess={handleAuthSuccess} onBackToHome={() => setActiveTab('landing')} />;
    }
    return (
      <LandingPage
        onGetStarted={() => setActiveTab('auth')}
        onLogin={() => setActiveTab('auth')}
        onDemo={handleLoadDemo}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  const sidebarItems = [
    ...SIDEBAR_GROUPS,
    ...(user.role === 'Admin' ? [{ label: 'Admin', items: [{ id: 'admin', label: 'Admin Panel', icon: Shield }] }] : [])
  ];

  // ── REPORT PAGE ──────────────────────────────────────
  const renderReportPage = () => {
    if (!activeResume) return null;
    return (
      <div style={{ padding: '3rem', background: '#ffffff', color: '#000000', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>ATS Resume Audit Report</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b' }}>Candidate: <strong>{activeResume.name}</strong> · Target: {activeResume.title}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0 }}>{activeResume.ats.overall} <span style={{ fontSize: '1rem', color: '#64748b' }}>/100</span></h2>
            <span style={{ fontWeight: 700, color: '#16a34a' }}>ATS Ready</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Issues Found</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.2rem' }}>
              {activeResume.ats.issues.map((i, idx) => (
                <li key={idx} style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                  <strong>[{i.severity.toUpperCase()}] {i.section}:</strong> {i.message}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Skills</h3>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {activeResume.skills.map((s, idx) => (
                <span key={idx} style={{ padding: '0.25rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.78rem' }}>{s.name}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
          Generated by ResumeAI on {new Date().toLocaleDateString()}
        </div>
      </div>
    );
  };

  return (
    <div className="app-layout">

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 45, backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <motion.aside
        className={`sidebar no-print ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        animate={{ width: sidebarCollapsed ? 70 : 'var(--sidebar-w)' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Sparkles size={16} />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                className="sidebar-brand-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                Resume<span className="gradient-text">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {sidebarItems.map(group => (
            <div key={group.label}>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    className="sidebar-section-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {group.label}
                  </motion.div>
                )}
              </AnimatePresence>

              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                    onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                    whileHover={{ x: sidebarCollapsed ? 0 : 3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon size={18} className="nav-icon" />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          className="nav-item-label"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* User card */}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg2)', borderRadius: 'var(--r-sm)',
                  marginBottom: '0.4rem'
                }}
              >
                <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.72rem', flexShrink: 0 }}>
                  {user.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>{user.role}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="nav-item"
            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronLeft size={16} className="nav-icon" />
            </motion.div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="nav-item-label" style={{ fontSize: '0.82rem' }}>
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="nav-item"
            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start', color: 'var(--red)' }}
            onClick={() => setUser(null)}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="nav-item-label" style={{ fontSize: '0.82rem' }}>
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ── WORKSPACE ───────────────────────────────────── */}
      <div className="workspace">

        {/* ── TOPBAR ────────────────────────────────────── */}
        <header className="topbar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Menu Toggle */}
            <button
              className="topbar-icon-btn"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{ display: 'none' }}
              id="mobile-menu-btn"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb */}
            <div className="topbar-breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span className="topbar-breadcrumb-active">{PAGE_TITLES[activeTab] || activeTab}</span>
            </div>
          </div>

          <div className="topbar-actions">
            {/* Search */}
            <div className="topbar-search">
              <Search size={13} color="var(--text3)" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Theme Toggle */}
            <button className="topbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="topbar-icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative' }}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: 2, right: 2,
                      width: 16, height: 16, borderRadius: '50%',
                      background: 'var(--red)', color: '#fff',
                      fontSize: '0.6rem', fontWeight: 800,
                      display: 'grid', placeItems: 'center',
                      border: '1.5px solid var(--surface)'
                    }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="notif-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.1rem', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.87rem' }}>Notifications</span>
                      <button onClick={markAllRead} style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 600 }}>Mark all read</button>
                    </div>
                    {notifications.slice(0, 5).map(n => (
                      <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.2rem' }}>{n.text}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{n.time}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Export Button */}
            {activeResume && (
              <button
                className="btn btn-secondary btn-sm no-print"
                onClick={() => { setActiveTab('report'); setTimeout(() => window.print(), 350); }}
              >
                <FileDown size={13} />
                Export PDF
              </button>
            )}

            {/* User Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border)' }}>
              <div className="avatar">
                {user.name.charAt(0)}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user.name}</div>
                <div className="badge badge-blue" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{user.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ──────────────────────────────── */}
        <main className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {activeTab === 'dashboard' && (
                <DashboardWidgets
                  resume={activeResume}
                  history={history}
                  onNavigate={(tab) => {
                    if (tab === 'demo') handleLoadDemo();
                    else setActiveTab(tab);
                  }}
                />
              )}

              {activeTab === 'upload' && (
                <ResumeUpload onParsingComplete={handleParsingComplete} />
              )}

              {activeTab === 'analysis' && (
                <ResumeAnalysis
                  resume={activeResume}
                  onUpdateResume={(updated) => setActiveResume(updated)}
                />
              )}

              {activeTab === 'jobMatch' && (
                <JobAnalyzer
                  resume={activeResume}
                  onUpdateResume={(updated) => setActiveResume(updated)}
                />
              )}

              {activeTab === 'tools' && (
                <CareerTools resume={activeResume} />
              )}

              {activeTab === 'history' && (
                <History
                  history={history}
                  activeResume={activeResume}
                  onSelectResume={handleSelectResume}
                  onDeleteHistory={handleDeleteHistory}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'settings' && (
                <ProfileSettings user={user} onLogout={() => setUser(null)} />
              )}

              {activeTab === 'admin' && <AdminDashboard />}

              {activeTab === 'report' && renderReportPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print, header, aside { display: none !important; }
          body, .app-layout, .page-content { background: #fff !important; color: #000 !important; padding: 0 !important; }
        }
        @media (max-width: 768px) {
          #mobile-menu-btn { display: grid !important; }
        }
      `}</style>
    </div>
  );
}
