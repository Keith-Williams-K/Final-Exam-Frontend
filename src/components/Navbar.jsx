import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">📚 Study Group Finder</Link>
      <div className="navbar-menu">
        <Link 
          to="/dashboard" 
          style={{
            color: isActive('/dashboard') ? '#8b0000' : '#555',
            fontWeight: isActive('/dashboard') ? 'bold' : 'normal'
          }}
        >
          Dashboard
        </Link>
        <Link 
          to="/browse"
          style={{
            color: isActive('/browse') ? '#8b0000' : '#555',
            fontWeight: isActive('/browse') ? 'bold' : 'normal'
          }}
        >
          Browse Groups
        </Link>
        <Link 
          to="/groups/create"
          style={{
            color: isActive('/groups/create') ? '#8b0000' : '#555',
            fontWeight: isActive('/groups/create') ? 'bold' : 'normal'
          }}
        >
          Create Group
        </Link>
        <span>👤 {user.name || 'Student'}</span>
        <button onClick={handleLogout} className="btn btn-danger" style={{width: 'auto', padding: '8px 16px'}}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;