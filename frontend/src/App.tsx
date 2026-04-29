import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FacilityList from './components/FacilityList';
import AddFacility from './components/AddFacility';
import EditFacility from './components/EditFacility';
import AdminDashboard from './components/AdminDashboard';  // 👈 ADD THIS
import './App.css';

// Component to handle active link styling
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  );
}

function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);
  const [isLoggedIn] = useState(true);
  const [userName] = useState('System Admin');

  const notifications = [
    { icon: '✅', message: 'Your booking for Hall A has been approved', time: '5 minutes ago' },
    { icon: '🎫', message: 'New ticket assigned to you', time: '1 hour ago' },
    { icon: '🔔', message: 'Facility maintenance scheduled', time: '2 hours ago' }
  ];

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="container">
            <div className="logo">
              <h1>🏫 Smart Campus Ops Hub</h1>
            </div>
            <nav className="nav-menu">
              <NavLink to="/facilities">Facilities</NavLink>
              <NavLink to="/resources">Resources</NavLink>
              <NavLink to="/bookings">Bookings</NavLink>
              <NavLink to="/tickets">Tickets</NavLink>
              
              {/* Bell Icon */}
              <div className="bell-icon" onClick={() => setShowNotifications(!showNotifications)}>
                🔔
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </div>
              
              {/* Auth Buttons */}
              <div className="auth-buttons">
                {isLoggedIn ? (
                  <>
                    <span className="user-name">👋 Hi, {userName}</span>
                    <button className="btn-logout">Logout</button>
                  </>
                ) : (
                  <button className="btn-login">Login</button>
                )}
              </div>
            </nav>
          </div>
        </header>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h4>Notifications</h4>
              <button className="clear-btn" onClick={() => setShowNotifications(false)}>Clear all</button>
            </div>
            <div className="notification-list">
              {notifications.map((notif, index) => (
                <div key={index} className="notification-item">
                  <span className="notif-icon">{notif.icon}</span>
                  <div className="notif-content">
                    <p>{notif.message}</p>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<FacilityList />} />
              <Route path="/facilities" element={<FacilityList />} />
              <Route path="/add-facility" element={<AddFacility />} />
              <Route path="/edit-facility/:id" element={<EditFacility />} />
              <Route path="/admin" element={<AdminDashboard />} />  {/* 👈 ADD THIS ROUTE */}
              <Route path="/resources" element={<div>Resources Page</div>} />
              <Route path="/bookings" element={<div>Bookings Page</div>} />
              <Route path="/tickets" element={<div>Tickets Page</div>} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2026 Smart Campus Operations. All rights reserved.</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;