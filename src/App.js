import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseGroups from './pages/BrowseGroups';
import CreateGroup from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<BrowseGroups />} />
        <Route path="/groups/create" element={<CreateGroup />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
      </Routes>
    </Router>
  );
}

export default App;