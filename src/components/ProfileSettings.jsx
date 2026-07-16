import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Key, CreditCard, Shield, Award, Activity,
  Check, Zap, LogOut, Bell, Moon, Sun, Globe
} from 'lucide-react';

const ACTIVITY_LOGS = [
  { event: 'Resume Upload (v3.0)', time: 'Today 22:45', status: 'success' },
  { event: 'Cover Letter Generated', time: 'Today 21:12', status: 'success' },
  { event: 'Job Match Analysis', time: 'Yesterday 14:33', status: 'success' },
  { event: 'History Entry Cleared', time: '2026-07-10 18:22', status: 'success' },
  { event: 'Login from new device', time: '2026-07-09 09:10', status: 'warning' },
];

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: User },
  { id: 'plan',     label: 'Plan',     icon: Award },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'activity', label: 'Activity', icon: Activity },
];

export default function ProfileSettings({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileName, setProfileName]   = useState(user?.name || 'Alex Rivera');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'alex@devmail.io');
  const [saved, setSaved]               = useState(false);

  const quotaUsed = 1240;
  const quotaMax  = 5000;
  const quotaPct  = Math.round((quotaUsed / quotaMax) * 100);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--grad-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: 900, flexShrink: 0, boxShadow: 'var(--shadow-blue)' }}>
            {(user?.name || 'A').charAt(0)}
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.15rem' }}>{user?.name || 'Alex Rivera'}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-blue">{user?.role || 'Premium User'}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{user?.email}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="tab-list">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── PROFILE TAB ───────────────────────── */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div className="grid-2" style={{ gap: '1.25rem', alignItems: 'start' }}>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} color="var(--blue)" /> Personal Information
              </h3>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={profileName} onChange={e => setProfileName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role / Title</label>
                  <input type="text" className="form-control" defaultValue="Software Engineer" />
                </div>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
                  </motion.button>
                  <button type="button" className="btn btn-secondary" onClick={onLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Preferences */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '1rem' }}>Preferences</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { icon: <Bell size={15} />, label: 'Email Notifications', desc: 'Resume analysis alerts', defaultOn: true },
                    { icon: <Globe size={15} />, label: 'Public Profile', desc: 'Allow profile indexing', defaultOn: false },
                  ].map((pref, i) => (
                    <ToggleRow key={i} {...pref} />
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(220,38,38,0.2)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--red)' }}>Danger Zone</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '1rem' }}>Permanently delete your account and all associated data.</p>
                <button className="btn btn-danger btn-sm" onClick={() => {}}>Delete Account</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PLAN TAB ───────────────────────────── */}
      {activeTab === 'plan' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div className="grid-2" style={{ gap: '1.25rem', alignItems: 'start' }}>

            {/* Current Plan */}
            <div className="card" style={{ padding: '1.75rem', border: '1.5px solid var(--blue)' }}>
              <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Current Plan</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Pro</h3>
                </div>
                <span className="badge badge-blue">Active</span>
              </div>

              <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>$12<span style={{ fontSize: '0.9rem', color: 'var(--text3)', fontWeight: 500 }}>/month</span></div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '1.5rem' }}>Renews on Aug 17, 2026</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {['Unlimited resume analyses', 'Job description matching', 'AI career coach', 'Version history', 'Cover letter AI', 'Priority processing'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.82rem' }}>
                    <Check size={13} color="var(--green)" />
                    {f}
                  </div>
                ))}
              </div>

              <button className="btn btn-secondary" style={{ width: '100%' }}>Manage Subscription</button>
            </div>

            {/* Usage & Quota */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '1.1rem' }}>API Usage</h4>
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text2)' }}>Analyses Used</span>
                  <span>{quotaUsed.toLocaleString()} / {quotaMax.toLocaleString()}</span>
                </div>
                <div className="progress-bar" style={{ height: 8, marginBottom: '0.4rem' }}>
                  <motion.div
                    className="progress-bar-fill"
                    style={{ background: quotaPct > 80 ? 'var(--amber)' : 'var(--blue)', width: `${quotaPct}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${quotaPct}%` }}
                    transition={{ duration: 1, ease: [0.34, 1.2, 0.64, 1] }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{quotaPct}% of monthly quota used</div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '1rem' }}>API Key</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="password" className="form-control" value="sk-ai-••••••••••••••••" readOnly style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} />
                  <button className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>Copy</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── SECURITY TAB ───────────────────────── */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div className="grid-2" style={{ gap: '1.25rem', alignItems: 'start' }}>
            {/* Change Password */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={16} color="var(--blue)" /> Change Password
              </h3>
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Update Password</button>
              </form>
            </div>

            {/* 2FA */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} color="var(--green)" /> Two-Factor Authentication
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Add an extra layer of security to your account. When enabled, you'll be required to provide a verification code in addition to your password.
              </p>
              <div style={{ padding: '1rem', background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <Check size={16} color="var(--green)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--green)' }}>2FA is enabled</span>
              </div>
              <button className="btn btn-secondary btn-sm">Configure 2FA</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── ACTIVITY TAB ──────────────────────── */}
      {activeTab === 'activity' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent Activity</h3>
              <span className="badge">{ACTIVITY_LOGS.length} events</span>
            </div>
            {ACTIVITY_LOGS.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ padding: '0.9rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: log.status === 'success' ? 'var(--green)' : 'var(--amber)',
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{log.event}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', flexShrink: 0 }}>{log.time}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ToggleRow({ icon, label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{ color: 'var(--text3)' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{desc}</div>
        </div>
      </div>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 42, height: 24, borderRadius: 12, flexShrink: 0,
          background: on ? 'var(--blue)' : 'var(--border2)',
          position: 'relative', transition: 'background 0.25s', cursor: 'pointer'
        }}
      >
        <motion.div
          animate={{ x: on ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3 }}
        />
      </button>
    </div>
  );
}
