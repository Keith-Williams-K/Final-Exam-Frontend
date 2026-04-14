import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const fetchGroup = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${id}`);
      setGroup(res.data.group);
      const members = res.data.group.Users || [];
      const member = members.find(m => m.id === user.id);
      setIsMember(!!member);
      setIsLeader(member?.Membership?.role === 'leader');
    } catch (err) {
      console.error('Error fetching group:', err);
    } finally {
      setLoading(false);
    }
  }, [id, user.id]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/memberships/join/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Join success:', res.data);
      await fetchGroup();
      alert('Successfully joined the group!');
    } catch (err) {
      console.error('Join error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to join group. Make sure you are logged in.');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    
    try {
      await axios.delete(
        `http://localhost:5000/api/memberships/leave/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchGroup();
      alert('Successfully left the group!');
    } catch (err) {
      console.error('Leave error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to leave group');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <p style={{color: 'white', textAlign: 'center', padding: '50px'}}>Loading group details...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="dashboard">
        <div className="card" style={{textAlign: 'center', padding: '50px'}}>
          <h2 style={{color: '#8b0000', marginBottom: '20px'}}>Group Not Found</h2>
          <p style={{color: '#666', marginBottom: '30px'}}>The group you're looking for doesn't exist or has been deleted.</p>
          <Link to="/browse" className="btn" style={{display: 'inline-block', width: 'auto'}}>
            Browse All Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="card" style={{marginBottom: '30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
          <div>
            <h1 style={{fontSize: '28px', marginBottom: '10px', color: '#1a1a1a'}}>{group.name}</h1>
            <p style={{color: '#8b0000', fontSize: '16px', fontWeight: '500', marginBottom: '10px'}}>{group.course}</p>
          </div>
          {!isMember && (
            <button 
              onClick={handleJoin} 
              disabled={joining}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #8b0000 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: joining ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: joining ? 0.7 : 1
              }}
            >
              {joining ? 'Joining...' : 'Join Group'}
            </button>
          )}
          {isMember && !isLeader && (
            <button 
              onClick={handleLeave}
              style={{
                padding: '12px 24px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Leave Group
            </button>
          )}
          {isLeader && (
            <span style={{
              padding: '8px 16px',
              background: '#fefcbf',
              color: '#975a16',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              👑 Group Leader
            </span>
          )}
        </div>
        
        <p style={{color: '#666', marginBottom: '20px', lineHeight: '1.6'}}>
          {group.description || 'No description provided.'}
        </p>
        
        <div style={{display: 'flex', gap: '20px', color: '#888', fontSize: '14px', paddingTop: '15px', borderTop: '1px solid #e1e5e9'}}>
          <span>📍 {group.location || 'Online'}</span>
          <span>👥 {group.Users?.length || 0} members</span>
          <span>👤 Led by: {group.leader?.name}</span>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Members ({group.Users?.length || 0})</h3>
        {group.Users?.length === 0 ? (
          <p style={{color: '#888', textAlign: 'center', padding: '20px'}}>No members yet</p>
        ) : (
          group.Users?.map(member => (
            <div key={member.id} style={{
              padding: '15px 0',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{fontWeight: '500', color: '#1a1a1a'}}>{member.name}</span>
                <span style={{color: '#888', marginLeft: '10px', fontSize: '14px'}}>{member.program}</span>
              </div>
              {member.Membership?.role === 'leader' && (
                <span style={{
                  background: '#fefcbf',
                  color: '#975a16',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  Leader
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupDetail;