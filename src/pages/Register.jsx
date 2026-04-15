import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Register page
// - Collects user profile fields and creates an account via `/api/auth/register`
// - Ensures passwords match before sending request
// - On success stores `token` and `user` then navigates to `/dashboard`

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', program: '', year: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        program: formData.program,
        year: parseInt(formData.year)
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">🎓 Create Account</h2>
      {error && (
        <div style={{background: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '20px'}}>
          {error}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Program</label>
          <select name="program" className="form-control" value={formData.program} onChange={onChange} required>
            <option value="">Select Program</option>
            <option>Bachelor of Science in Information Technology</option>
            <option>Bachelor of Business Administration</option>
            <option>Bachelor of Laws</option>
          </select>
        </div>
        <div className="form-group">
          <label>Year of Study</label>
          <select name="year" className="form-control" value={formData.year} onChange={onChange} required>
            <option value="">Select Year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-control" value={formData.password} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={onChange} required />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="text-center mt-20">
        <Link to="/login" className="link">Already have an account? Sign In</Link>
      </p>
    </div>
  );
};

export default Register;