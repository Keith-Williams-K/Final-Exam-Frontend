// Navigation bar component displayed for authenticated users
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Navbar component
// - Shows navigation links when a user is authenticated (presence of `token`)
// - Reads `user` from localStorage to display the current user's name
// - Provides `Logout` which clears storage and navigates to `/login`

const Navbar = () => {
  // Hooks for navigation and current location
  const navigate = useNavigate();
  const location = useLocation();
  // Get authentication token and user data from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Handle user logout
  const handleLogout = () => {
    // Remove authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate back to login page
    navigate('/login');
  };

  if (!token) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Brand link to dashboard */}
      <Link to="/dashboard" className="navbar-brand">📚 Study Group Finder</Link>
      <div className="navbar-menu">
        {/* Navigation links with active state styling */}
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
        {/* Display user name */}
        <span>👤 {user.name || 'Student'}</span>
        {/* Logout button */}
        <button onClick={handleLogout} className="btn btn-danger" style={{width: 'auto', padding: '8px 16px'}}>
          Logout
        </button>
      </div>
    </nav>
  );
};

// Export the Navbar component
export default Navbar;