import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BrowseGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/groups');
      setGroups(res.data.groups);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><p style={{color: 'white'}}>Loading groups...</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="flex justify-between items-center" style={{marginBottom: '30px'}}>
        <h1 className="welcome-text" style={{marginBottom: 0}}>Browse Study Groups</h1>
        
        <Link to="/groups/create" className="btn btn-success" style={{width: 'auto'}}>
          + Create New Group
        </Link>
      </div>

      {groups.length === 0 ? (
        <div className="card">
          <p style={{color: '#888', textAlign: 'center', padding: '40px'}}>
            No study groups yet. Be the first to create one!
          </p>
        </div>
      ) : (
        <div className="group-grid">
          {groups.map(group => (
            <Link to={`/groups/${group.id}`} key={group.id} style={{textDecoration: 'none'}}>
              <div className="group-card">
                <div className="group-title">{group.name}</div>
                <div className="group-course">{group.course}</div>
                <div className="group-description">
                  {group.description || 'No description provided.'}
                </div>
                <div className="group-meta">
                  <span>👥 {group.memberCount} members</span>
                  <span>📍 {group.location || 'Online'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseGroups;
