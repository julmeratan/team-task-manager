import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function Tasks() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ project: '', status: '' });
  const [form, setForm] = useState({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', project: '', assignedTo: '' });

  const fetchData = async () => {
    try {
      const params = {};
      if (filters.project) params.project = filters.project;
      if (filters.status) params.status = filters.status;
      const [tRes, pRes, uRes] = await Promise.all([api.get('/tasks', { params }), api.get('/projects'), api.get('/auth/users')]);
      setTasks(tRes.data); setProjects(pRes.data); setUsers(uRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, [filters]);

  const openCreate = () => { setForm({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', project: '', assignedTo: '' }); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/tasks', form); setShowModal(false); fetchData(); }
    catch (err) { alert(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error'); }
  };
  const updateStatus = async (id, status) => {
    try { await api.put(`/tasks/${id}`, { status }); fetchData(); } catch (err) { alert('Error'); }
  };
  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); fetchData(); } catch (err) { alert('Error'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const isOverdue = (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date();

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Tasks</h1><p>Track and manage all tasks</p></div>
        {isAdmin && <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> New Task</button>}
      </div>

      <div className="filters-bar">
        <select className="form-control" value={filters.project} onChange={e => setFilters({ ...filters, project: e.target.value })}>
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select className="form-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div className="card empty-state"><div className="empty-icon">📋</div><h3>No tasks found</h3><p>Adjust filters or create a new task</p></div>
      ) : (
        <>
          <div className="card task-table-wrapper">
            <table className="task-table">
              <thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Priority</th><th>Due</th><th>Status</th>{isAdmin && <th></th>}</tr></thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td>{t.project?.name || '—'}</td>
                    <td>{t.assignedTo?.name || '—'}</td>
                    <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                    <td>{isOverdue(t) ? <span className="badge badge-overdue">Overdue</span> : formatDate(t.dueDate)}</td>
                    <td>
                      <select className="form-control" style={{ padding: '4px 8px', fontSize: 12, width: 'auto', minWidth: 120 }} value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    {isAdmin && <td><button className="btn-icon" onClick={() => deleteTask(t._id)}><HiOutlineTrash /></button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="task-cards">
            {tasks.map(t => (
              <div key={t._id} className="card task-card-item">
                <div className="task-card-header"><span className="task-card-title">{t.title}</span><span className={`badge badge-${t.priority}`}>{t.priority}</span></div>
                <div className="task-card-meta">
                  <span>{t.project?.name}</span><span>{t.assignedTo?.name || 'Unassigned'}</span>
                  <span>{isOverdue(t) ? '⚠️ Overdue' : formatDate(t.dueDate)}</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <select className="form-control" style={{ padding: '4px 8px', fontSize: 12 }} value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                    <option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label><textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group"><label>Project</label>
                <select className="form-control" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} required>
                  <option value="">Select project</option>{projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select></div>
              <div className="form-group"><label>Assign To</label>
                <select className="form-control" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>{users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select></div>
              <div className="form-group"><label>Priority</label>
                <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select></div>
              <div className="form-group"><label>Due Date</label><input type="date" className="form-control" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
