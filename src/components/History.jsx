import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Search, Trash2, FileText, ArrowRightLeft, Check,
  Award, AlertCircle, ChevronRight, BarChart2, TrendingUp
} from 'lucide-react';
import { mockProfiles } from '../utils/mockData';

export default function History({ history = [], activeResume, onSelectResume, onDeleteHistory, onNavigate }) {
  const [searchTerm, setSearchTerm]   = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds]   = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredHistory = history.filter(h =>
    h.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.jobTarget.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      setCompareIds(compareIds.length >= 2 ? [compareIds[1], id] : [...compareIds, id]);
    }
  };

  const getCompareProfiles = () => {
    if (compareIds.length !== 2) return null;
    const item1 = history.find(h => h.id === compareIds[0]);
    const item2 = history.find(h => h.id === compareIds[1]);
    if (!item1 || !item2) return null;
    const p1 = JSON.parse(JSON.stringify(mockProfiles[item1.parsedProfile]));
    p1.ats.overall = item1.score; p1.version = item1.version; p1.fileName = item1.fileName;
    const p2 = JSON.parse(JSON.stringify(mockProfiles[item2.parsedProfile]));
    p2.ats.overall = item2.score; p2.version = item2.version; p2.fileName = item2.fileName;
    return { p1, p2 };
  };

  const compared = getCompareProfiles();
  const scoreColor = (s) => s >= 80 ? 'var(--green)' : s >= 60 ? 'var(--amber)' : 'var(--red)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Version History</h1>
            <p className="page-subtitle">{history.length} resume{history.length !== 1 ? 's' : ''} analyzed — track your improvement over time</p>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            {/* Search */}
            <div className="topbar-search" style={{ borderRadius: 'var(--r-full)' }}>
              <Search size={13} color="var(--text3)" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 160 }}
              />
            </div>
            <button
              className={`btn ${compareMode ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => { setCompareMode(!compareMode); setCompareIds([]); }}
            >
              <ArrowRightLeft size={13} />
              {compareMode ? 'Exit Compare' : 'Compare'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Compare Banner */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.85rem 1.1rem',
              background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)',
              borderRadius: 'var(--r-sm)', fontSize: '0.82rem', color: 'var(--blue)', fontWeight: 600
            }}
          >
            <AlertCircle size={15} />
            Select 2 versions below to compare side by side.
            <span style={{ marginLeft: 'auto', color: 'var(--text2)', fontWeight: 500 }}>
              {compareIds.length}/2 selected
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Panel */}
      <AnimatePresence>
        {compareMode && compared && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="card"
            style={{ padding: '1.75rem' }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>Version Comparison</h3>
            <div className="grid-2" style={{ gap: '2rem' }}>
              {[compared.p1, compared.p2].map((profile, pi) => (
                <div key={pi} style={{ borderRight: pi === 0 ? '1px solid var(--border)' : 'none', paddingRight: pi === 0 ? '2rem' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 700 }}>{profile.fileName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{profile.version}</div>
                    </div>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${scoreColor(profile.ats.overall)}15`, color: scoreColor(profile.ats.overall), display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '1.1rem', border: `2px solid ${scoreColor(profile.ats.overall)}40` }}>
                      {profile.ats.overall}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Top Skills</div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {profile.skills.slice(0, 5).map(s => (
                      <span key={s.name} className="badge" style={{ fontSize: '0.68rem' }}>{s.name}</span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Grammar Issues</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {profile.grammar.issues.slice(0, 2).map((i, idx) => (
                      <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text2)', padding: '0.4rem 0.6rem', background: 'var(--bg2)', borderRadius: 'var(--r-xs)' }}>
                        {i.text}
                      </div>
                    ))}
                    {profile.grammar.issues.length === 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Check size={12} /> All clear
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {compared.p2.ats.overall !== compared.p1.ats.overall && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  marginTop: '1.5rem', padding: '0.85rem', textAlign: 'center',
                  background: compared.p2.ats.overall > compared.p1.ats.overall ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)',
                  border: `1px solid ${compared.p2.ats.overall > compared.p1.ats.overall ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`,
                  borderRadius: 'var(--r-sm)', fontSize: '0.85rem',
                  color: compared.p2.ats.overall > compared.p1.ats.overall ? 'var(--green)' : 'var(--red)',
                  fontWeight: 700
                }}
              >
                {compared.p2.ats.overall > compared.p1.ats.overall
                  ? `✅ Score improved by +${compared.p2.ats.overall - compared.p1.ats.overall} points between versions`
                  : `⚠️ Score decreased by ${compared.p1.ats.overall - compared.p2.ats.overall} points`
                }
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Clock size={28} /></div>
          <h3 style={{ fontWeight: 700 }}>No History Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
            {searchTerm ? 'No results match your search.' : 'Upload resumes to build your version history.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ padding: '0.6rem 1.5rem', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)' }}>File</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', textAlign: 'right' }}>Score</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', textAlign: 'center', minWidth: 90 }}>Date</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', minWidth: 130 }}>Actions</span>
          </div>

          {filteredHistory.map((item, idx) => {
            const isActive = !!activeResume;
            const color = scoreColor(item.score);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)',
                  display: 'grid', gridTemplateColumns: '1fr auto auto auto',
                  gap: '1rem', alignItems: 'center',
                  background: compareIds.includes(item.id) ? 'rgba(37,99,235,0.04)' : 'transparent',
                  transition: 'background 0.18s'
                }}
              >
                {/* File info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                  {compareMode && (
                    <input
                      type="checkbox"
                      checked={compareIds.includes(item.id)}
                      onChange={() => toggleCompare(item.id)}
                      style={{ width: 15, height: 15, cursor: 'pointer', flexShrink: 0 }}
                    />
                  )}
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'rgba(37,99,235,0.08)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <FileText size={16} color="var(--blue)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.87rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.fileName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span>{item.version}</span>
                      <span>·</span>
                      <span>{item.jobTarget}</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.03em', color }}>{item.score}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>/100</span>
                </div>

                {/* Date */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textAlign: 'center', minWidth: 90 }}>
                  {item.date}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.4rem', minWidth: 130, justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => { onSelectResume(item.parsedProfile); onNavigate('analysis'); }}
                  >
                    <BarChart2 size={12} /> View
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--red)', borderRadius: 'var(--r-sm)' }}
                    onClick={() => {
                      if (confirmDelete === item.id) {
                        onDeleteHistory(item.id);
                        setConfirmDelete(null);
                      } else {
                        setConfirmDelete(item.id);
                        setTimeout(() => setConfirmDelete(null), 3000);
                      }
                    }}
                  >
                    <Trash2 size={12} />
                    {confirmDelete === item.id ? 'Confirm?' : ''}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
