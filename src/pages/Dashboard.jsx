import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [myGroupsRes, sessionsRes, allGroupsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/memberships/my-groups', { headers }),
          axios.get('http://localhost:5000/api/sessions/upcoming', { headers }),
          axios.get('http://localhost:5000/api/groups')
        ]);
        setMyGroups(myGroupsRes.data.groups || []);
        setUpcomingSessions(sessionsRes.data.sessions || []);
        setTotalGroups(allGroupsRes.data.count || 0);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="dashboard">
      <h1 className="welcome-text">Welcome back, {user.name}!</h1>
      <p style={{color: 'rgba(255,255,255,0.8)', marginTop: '-20px', marginBottom: '20px'}}>
        {user.program} - Year {user.year}
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">My Groups</div>
          <div className="stat-value">{myGroups.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Upcoming Sessions</div>
          <div className="stat-value">{upcomingSessions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Groups</div>
          <div className="stat-value">{totalGroups}</div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h3 className="card-title">My Study Groups</h3>
          {myGroups.length === 0 ? (
            <div style={{textAlign: 'center', padding: '30px', color: '#888'}}>
              <p>No groups joined yet</p>
              <Link to="/browse" style={{display: 'inline-block', marginTop: '15px', padding: '10px 20px', background: '#8b0000', color: 'white', borderRadius: '8px', textDecoration: 'none'}}>Browse Groups</Link>
            </div>
          ) : (
            myGroups.map(group => (
              <Link to={`/groups/${group.id}`} key={group.id} style={{textDecoration: 'none'}}>
                <div className="group-card">
                  <div className="group-title">{group.name}</div>
                  <div className="group-course">{group.course}</div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="card">
          <h3 className="card-title">Upcoming Sessions</h3>
          {upcomingSessions.length === 0 ? (
            <p style={{color: '#888', textAlign: 'center', padding: '30px'}}>No upcoming sessions</p>
          ) : (
            upcomingSessions.map(session => (
              <div key={session.id} className="group-card">
                <div className="group-title">{session.title}</div>
                <div className="group-course">{session.StudyGroup?.name}</div>
                <div className="group-meta">📅 {new Date(session.date).toLocaleDateString()} at {session.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;