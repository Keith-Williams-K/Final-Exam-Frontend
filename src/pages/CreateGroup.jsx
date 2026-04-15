import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// CreateGroup
// - Form to create a new study group. Requires authentication token.
// - Posts to `/api/groups` and navigates to the new group's detail page on success.

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', course: '', description: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const onSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await axios.post('http://localhost:5000/api/groups', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // After creating the group navigate to its detail page.
    // A short timeout is used to allow the backend to finish any async work.
    setTimeout(() => {
      navigate(`/groups/${res.data.group.id}`);
    }, 500);
    
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create group');
    setLoading(false);
  }
};

  return (
    <div className="dashboard">
      <h1 className="welcome-text">Create New Study Group</h1>
      
      
      <div className="card" style={{maxWidth: '600px'}}>
        {error && (
          <div style={{background: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '20px'}}>
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Group Name *</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Course *</label>
            <select name="course" className="form-control" value={formData.course} onChange={onChange} required>
              <option value="">Select Course</option>
              <option>CSC1202 - Web and Mobile Application Development</option>
              <option>CSC1201 - Database Systems</option>
              <option>CSC1103 - Programming Fundamentals</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Meeting Location</label>
            <input type="text" name="location" className="form-control" value={formData.location} onChange={onChange} placeholder="e.g., Library Room 204 or Zoom link" />
          </div>
          <div className="flex gap-10">
            <button type="button" onClick={() => navigate('/browse')} className="btn" style={{background: '#a0aec0'}}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;