import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SessionForm from '../components/SessionForm';

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [pendingRequests, setPendingRequests] = useState([]);
const [joinStatus, setJoinStatus] = useState(null); // null, 'pending', 'approved', 'rejected'

const fetchPendingRequests = useCallback(async () => {
    if (!isLeader) return;
    try {
        const res = await axios.get(
            `http://localhost:5000/api/memberships/pending/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingRequests(res.data.pending || []);
    } catch (err) {
        console.error('Error fetching pending:', err);
    }
}, [id, token, isLeader]);

  const fetchGroup = useCallback(async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/groups/${id}`);
        setGroup(res.data.group);
        const members = res.data.group.Users || [];
        const member = members.find(m => m.id === user.id);
        setIsMember(!!member);
        setIsLeader(member?.Membership?.role === 'leader');
        
        // Check if user has a pending request
        if (!member) {
            try {
                const pendingRes = await axios.get(
                    `http://localhost:5000/api/memberships/pending/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const userPending = pendingRes.data.pending?.find(p => p.user_id === user.id);
                if (userPending) {
                    setJoinStatus('pending');
                }
            } catch (err) {
                // Ignore
            }
        } else {
            setJoinStatus('approved');
        }
    } catch (err) {
        console.error('Error fetching group:', err);
    } finally {
        setLoading(false);
    }
}, [id, user.id, token]);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/sessions/group/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  }, [id, token]);

  useEffect(() => {
    fetchGroup();
    fetchSessions();
  }, [fetchGroup, fetchSessions]);

  const handleJoin = async () => {
    setJoining(true);
    try {
        const res = await axios.post(
            `http://localhost:5000/api/memberships/join/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
        setJoinStatus('pending');
        fetchGroup();
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to send join request');
    } finally {
        setJoining(false);
    }
};

  const handleApprove = async (userId) => {
    try {
        await axios.put(
            `http://localhost:5000/api/memberships/approve/${id}/${userId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchGroup();
        fetchPendingRequests();
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to approve');
    }
};

const handleReject = async (userId) => {
    try {
        await axios.put(
            `http://localhost:5000/api/memberships/reject/${id}/${userId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPendingRequests();
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to reject');
    }
};
useEffect(() => {
    fetchGroup();
    fetchSessions();
    fetchPendingRequests();
}, [fetchGroup, fetchSessions, fetchPendingRequests]);

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
          <Link to="/browse" className="btn" style={{display: 'inline-block', width: 'auto'}}>
            Browse All Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Group Info Card */}
      <div className="card" style={{marginBottom: '30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
          <div>
            <h1 style={{fontSize: '28px', marginBottom: '10px', color: '#1a1a1a'}}>{group.name}</h1>
            <p style={{color: '#8b0000', fontSize: '16px', fontWeight: '500', marginBottom: '10px'}}>{group.course}</p>
          </div>
          {!isMember && (
            <button onClick={handleJoin} disabled={joining}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #8b0000 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: joining ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: joining ? 0.7 : 1
              }}>
              {joining ? 'Joining...' : 'Join Group'}
            </button>
          )}
          {isMember && !isLeader && (
            <button onClick={handleLeave}
              style={{
                padding: '12px 24px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
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

      {/* Members Section */}
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

        {!isMember && joinStatus !== 'pending' && (
    <button onClick={handleJoin} disabled={joining}
        style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #8b0000 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: joining ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
        }}>
        {joining ? 'Sending...' : 'Request to Join'}
    </button>
)}

{joinStatus === 'pending' && (
    <span style={{
        padding: '12px 24px',
        background: '#fefcbf',
        color: '#975a16',
        borderRadius: '8px',
        fontWeight: 'bold'
    }}>
        ⏳ Pending Approval
    </span>
)}

    {/* Pending Requests Section (Leader Only) */}
{isLeader && pendingRequests.length > 0 && (
    <div className="card" style={{ marginTop: '30px' }}>
        <h3 className="card-title">⏳ Pending Join Requests ({pendingRequests.length})</h3>
        {pendingRequests.map(request => (
            <div key={request.id} style={{
                padding: '15px 0',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{request.User?.name}</span>
                    <span style={{ color: '#888', marginLeft: '10px', fontSize: '14px' }}>
                        {request.User?.program} - Year {request.User?.year}
                    </span>
                    <span style={{ color: '#888', marginLeft: '10px', fontSize: '14px' }}>
                        📧 {request.User?.email}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => handleApprove(request.user_id)}
                        style={{
                            padding: '8px 16px',
                            background: '#48bb78',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                        ✅ Approve
                    </button>
                    <button
                        onClick={() => handleReject(request.user_id)}
                        style={{
                            padding: '8px 16px',
                            background: '#f56565',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                        ❌ Reject
                    </button>
                </div>
            </div>
        ))}
    </div>
)}

      {/* Sessions Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="card-title" style={{ marginBottom: 0 }}>📅 Study Sessions</h3>
          {isLeader && !showSessionForm && (
            <button
              onClick={() => setShowSessionForm(true)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #8b0000 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              + Schedule Session
            </button>
          )}
        </div>

        {showSessionForm && (
          <SessionForm
            groupId={id}
            onSessionCreated={(newSession) => {
              setSessions([...sessions, newSession]);
              setShowSessionForm(false);
            }}
            onCancel={() => setShowSessionForm(false)}
          />
        )}

        {sessions.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>
            No sessions scheduled yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {sessions.map(session => (
              <div key={session.id} style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '10px',
                border: '1px solid #e1e5e9'
              }}>
                <h4 style={{ marginBottom: '10px', color: '#1a1a1a' }}>{session.title}</h4>
                <p style={{ color: '#666', marginBottom: '10px' }}>{session.description || 'No description'}</p>
                <div style={{ display: 'flex', gap: '20px', color: '#888', fontSize: '14px' }}>
                  <span>📅 {new Date(session.date).toLocaleDateString()} at {session.time}</span>
                  <span>📍 {session.location_link || 'Location TBD'}</span>
                  <span>👤 Created by: {session.creator?.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;