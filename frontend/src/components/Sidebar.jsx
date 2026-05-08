import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiOutlineViewGrid, HiOutlineFolder, HiOutlineClipboardList, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const links = [
    { to: '/', icon: <HiOutlineViewGrid />, label: 'Dashboard' },
    { to: '/projects', icon: <HiOutlineFolder />, label: 'Projects' },
    { to: '/tasks', icon: <HiOutlineClipboardList />, label: 'Tasks' },
  ];

  return (
    <>
      <button className="mobile-nav-toggle" onClick={() => setOpen(!open)}>
        {open ? <HiOutlineX /> : <HiOutlineMenu />}
      </button>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">T</div>
          <h2>TaskFlow</h2>
        </div>
        <nav className="sidebar-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
              {l.icon} {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <HiOutlineLogout /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
