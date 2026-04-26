import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FacilityList from './components/FacilityList';
import FacilityForm from './components/FacilityForm';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="container">
            <div className="logo">
              <h1>🏫 Smart Campus Ops Hub</h1>
            </div>
            <nav className="nav-menu">
              <Link to="/facilities">Facilities</Link>
              <Link to="/resources">Resources</Link>
              <Link to="/bookings">Bookings</Link>
              <Link to="/tickets">Tickets</Link>
              <Link to="/admin" className="btn-admin">Admin Dashboard</Link>
              <Link to="/login" className="btn-login">Login</Link>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<FacilityList />} />
              <Route path="/facilities" element={<FacilityList />} />
              <Route path="/facilities/add" element={<FacilityForm />} />
              <Route path="/facilities/edit/:id" element={<FacilityForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/resources" element={<div>Resources Page</div>} />
              <Route path="/bookings" element={<div>Bookings Page</div>} />
              <Route path="/tickets" element={<div>Tickets Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2026 Smart Campus Operations. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;