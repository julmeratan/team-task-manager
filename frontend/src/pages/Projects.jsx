import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', members: [] });

  const fetchData = async () => {
    try {
      const [pRes, uRes] = await Promise.all([api.get('/projects'), api.get('/auth/users')]);
      setProjects(pRes.data); setUsers(uRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditId(null); setForm({ name: '', description: '', members: [] }); setShowModal(true); };
  const openEdit = (p) => { setEditId(p._id); setForm({ name: p.name, description: p.description || '', members: p.members.map(m => m._id) }); setShowModal(true); };
  const toggleMember = (id) => setForm(f => ({ ...f, members: f.members.includes(id) ? f.members.filter(m => m !== id) : [...f.members, id] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/projects/${editId}`, form);
      else await api.post('/projects', form);
      setShowModal(false); fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); fetchData(); } catch (err) { alert('Error'); }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Projects</h1><p>Manage your team projects</p></div>
        {isAdmin && <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> New Project</button>}
      </div>
      {projects.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📂</div><h3>No projects yet</h3>
          <p>{isAdmin ? 'Create your first project' : 'Not added to any projects yet'}</p>
          {isAdmin && <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus /> Create Project</button>}
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(p => (
            <div key={p._id} className="card project-card slide-up">
              <div className="project-header">
                <div className="project-name">{p.name}</div>
                {isAdmin && <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-icon" onClick={() => openEdit(p)}><HiOutlinePencil /></button>
                  <button className="btn-icon" onClick={() => handleDelete(p._id)}><HiOutlineTrash /></button>
                </div>}
              </div>
              <div className="project-desc">{p.description || 'No description'}</div>
              <div className="project-members">
                {p.members.slice(0, 5).map(m => <div key={m._id} className="member-avatar" title={m.name}>{m.name.charAt(0).toUpperCase()}</div>)}
                {p.members.length > 5 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>+{p.members.length - 5}</span>}
                {p.members.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No members</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editId ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Project Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label>
                <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group"><label>Members</label>
                <div className="members-checklist">
                  {users.map(u => <label key={u._id}><input type="checkbox" checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} /> {u.name} <span className={`badge badge-${u.role}`}>{u.role}</span></label>)}
                </div></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
