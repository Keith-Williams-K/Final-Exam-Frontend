import React, { useState } from 'react';
import axios from 'axios';

const SessionForm = ({ groupId, onSessionCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location_link: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(
                `http://localhost:5000/api/sessions/${groupId}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSessionCreated(res.data.session);
            setFormData({ title: '', date: '', time: '', location_link: '', description: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px'
        }}>
            <h3 style={{ marginBottom: '20px', color: '#1a1a1a' }}>📅 Schedule New Session</h3>

            {error && (
                <div style={{
                    background: '#fed7d7',
                    color: '#c53030',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Session Title *</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="e.g., Midterm Review Session"
                        value={formData.title}
                        onChange={onChange}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                        <label>Date *</label>
                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            min={minDate}
                            value={formData.date}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Time *</label>
                        <input
                            type="time"
                            name="time"
                            className="form-control"
                            value={formData.time}
                            onChange={onChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Location / Meeting Link</label>
                    <input
                        type="text"
                        name="location_link"
                        className="form-control"
                        placeholder="e.g., Library Room 204 or Zoom link"
                        value={formData.location_link}
                        onChange={onChange}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        placeholder="What will you cover in this session?"
                        value={formData.description}
                        onChange={onChange}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            background: '#a0aec0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #8b0000 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Session'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SessionForm;