import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HardDrive, Users, Settings, Database, Activity, RefreshCw, BarChart2, Plus } from 'lucide-react';
import { mockSystemStats, mockUsers } from '../utils/mockData';

export default function AdminDashboard() {
  const [usersList, setUsersList] = useState(mockUsers);
  const [searchUser, setSearchUser] = useState('');
  const [celeryLog, setCeleryLog] = useState('All background tasks idling. Worker instances: 3 active.');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleToggleRole = (userId) => {
    setUsersList(usersList.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'Admin' ? 'Premium User' : u.role === 'Premium User' ? 'Standard User' : 'Admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleFlushCache = () => {
    setIsRefreshing(true);
    setCeleryLog('Flushing Redis memory registers...');
    setTimeout(() => {
      setCeleryLog('Redis registers flushed successfully. Re-syncing worker queues...');
      setIsRefreshing(false);
    }, 1200);
  };

  // SVG Chart: Revenue over time
  const renderRevenueChart = () => {
    const revData = mockSystemStats.revenue;
    const maxVal = 16000;
    const minVal = 3000;
    
    const points = revData.map((d, idx) => {
      const x = 30 + (idx * 70);
      const y = 130 - ((d.amount - minVal) / (maxVal - minVal)) * 90;
      return { x, y, month: d.month, val: d.amount };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
    }, '');

    return (
      <svg width="100%" height="150" viewBox="0 0 420 150" style={{ overflow: 'visible' }}>
        <line x1="30" y1="40" x2="380" y2="40" stroke="var(--surface-border)" strokeDasharray="4 4" />
        <line x1="30" y1="85" x2="380" y2="85" stroke="var(--surface-border)" strokeDasharray="4 4" />
        <line x1="30" y1="130" x2="380" y2="130" stroke="var(--surface-border)" />

        <path d={pathD} fill="none" stroke="#7c3aed" strokeWidth="3" />

        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--surface)" stroke="#7c3aed" strokeWidth="2.5" />
            <text x={p.x} y={p.y - 10} fontSize="9" fontWeight="700" fill="var(--text-primary)" textAnchor="middle">${p.val}</text>
            <text x={p.x} y="142" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">{p.month}</text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top dashboard status cards */}
      <div className="grid-4">
        {/* CPU usage */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CPU LOAD</span>
            <Activity size={16} color="var(--color-primary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{mockSystemStats.cpuUsage}%</h3>
          <div style={{ height: 4, width: '100%', background: 'var(--bg-secondary)', borderRadius: 999 }}>
            <div style={{ height: '100%', width: `${mockSystemStats.cpuUsage}%`, background: 'var(--color-primary)', borderRadius: 999 }} />
          </div>
        </div>

        {/* Memory */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>RAM USAGE</span>
            <HardDrive size={16} color="var(--color-secondary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{mockSystemStats.memoryUsage}%</h3>
          <div style={{ height: 4, width: '100%', background: 'var(--bg-secondary)', borderRadius: 999 }}>
            <div style={{ height: '100%', width: `${mockSystemStats.memoryUsage}%`, background: 'var(--color-secondary)', borderRadius: 999 }} />
          </div>
        </div>

        {/* Redis */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>REDIS CLOUD</span>
            <Database size={16} color="var(--color-success)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{mockSystemStats.redisStatus}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Memory Cache Active</span>
        </div>

        {/* Celery tasks */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CELERY TASKS</span>
            <RefreshCw size={16} color="var(--color-warning)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{mockSystemStats.celeryTasksQueued} Active</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Workers active: {mockSystemStats.celeryWorkers}</span>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
        
        {/* Users Catalog management */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Registered Customers</h3>
            <input 
              type="text" 
              placeholder="Search email..." 
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              className="form-control"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 8, width: 160 }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>User Details</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Permissions</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Resumes</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList
                  .filter(u => u.email.toLowerCase().includes(searchUser.toLowerCase()))
                  .map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                      <td style={{ padding: '0.6rem 0.5rem' }}>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem' }}>
                        <span className={`badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'Premium User' ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>{u.resumesCount}</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>
                        <button onClick={() => handleToggleRole(u.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: 6 }}>
                          Edit Role
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operators control logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Revenue Chart */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Platform Revenue (Monthly USD)</h3>
            {renderRevenueChart()}
          </div>

          {/* Diagnostics card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Operator Diagnostics</h3>
            <div style={{ padding: '0.75rem', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--surface-border)', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: 65 }}>
              {celeryLog}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={handleFlushCache} disabled={isRefreshing} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}>
                Flush Redis Cache
              </button>
              <button onClick={() => setCeleryLog('Initializing 2 additional worker threads... Done. Active workers: 5.')} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}>
                Spawn Workers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
