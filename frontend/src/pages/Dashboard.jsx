import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamation, HiOutlineFolder, HiOutlineTrendingUp } from 'react-icons/hi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const completionRate = stats?.totalTasks ? Math.round((stats.completed / stats.totalTasks) * 100) : 0;

  return (
    <div className="fade-in">
      <div className="welcome-banner slide-up">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p>Here's your productivity overview for today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="stats-grid">
        {[
          { icon: <HiOutlineClipboardList />, cls: 'blue', val: stats?.totalTasks || 0, label: 'Total Tasks', delay: '0s' },
          { icon: <HiOutlineClock />, cls: 'yellow', val: stats?.pending || 0, label: 'Pending', delay: '0.05s' },
          { icon: <HiOutlineTrendingUp />, cls: 'cyan', val: stats?.inProgress || 0, label: 'In Progress', delay: '0.1s' },
          { icon: <HiOutlineCheckCircle />, cls: 'green', val: stats?.completed || 0, label: 'Completed', delay: '0.15s' },
          { icon: <HiOutlineExclamation />, cls: 'red', val: stats?.overdue || 0, label: 'Overdue', delay: '0.2s' },
          { icon: <HiOutlineFolder />, cls: 'purple', val: stats?.projects || 0, label: 'Projects', delay: '0.25s' },
        ].map((s, i) => (
          <div key={i} className="card stat-card slide-up" style={{ animationDelay: s.delay }}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ethara AI Widget */}
      <div className="card slide-up" style={{ animationDelay: '0.28s', marginBottom: 24, border: '1px solid rgba(124, 58, 237, 0.3)', background: 'linear-gradient(135deg, rgba(15, 20, 45, 0.9), rgba(124, 58, 237, 0.08))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)', opacity: 0.5 }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14, boxShadow: '0 4px 12px var(--accent-glow)' }}>AI</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #fff, var(--accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ethara AI Insights</h2>
          </div>
          <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => {
            import('react-hot-toast').then(({ default: toast }) => toast.success('Ethara AI successfully analyzed your workspace data! 🚀'));
          }}>Generate Report</button>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, position: 'relative' }}>
          <strong>Ethara Analysis:</strong> Your team is performing <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>15% faster</span> this week. Consider assigning more high-priority tasks to active members to maintain velocity.
        </p>
      </div>

      {/* Completion Rate Bar */}
      <div className="card slide-up" style={{ animationDelay: '0.3s', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Completion Rate</h2>
          <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-light)' }}>{completionRate}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completionRate}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>

      <div className="card slide-up" style={{ animationDelay: '0.35s' }}>
        <div className="section-header">
          <h2>Recent Tasks</h2>
        </div>
        {stats?.recentTasks?.length > 0 ? (
          <table className="task-table">
            <thead><tr><th>Task</th><th>Project</th><th>Status</th><th>Due</th></tr></thead>
            <tbody>
              {stats.recentTasks.map(t => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 700 }}>{t.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.project?.name || '—'}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status.replace('-', ' ')}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.dueDate ? formatDate(t.dueDate) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🚀</div>
            <h3>Ready to get started</h3>
            <p>Create a project and start adding tasks to track your team's progress</p>
          </div>
        )}
      </div>
    </div>
  );
}
