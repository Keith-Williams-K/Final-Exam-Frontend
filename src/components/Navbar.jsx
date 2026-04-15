import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Navbar component
// - Shows navigation links when a user is authenticated (presence of `token`)
// - Reads `user` from localStorage to display the current user's name
// - Provides `Logout` which clears storage and navigates to `/login`

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

  // If there is no auth token we do not render the navbar (user must login)
  if (!token) return null;

  // Helper to mark the active route in the nav
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