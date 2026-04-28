import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FacilityList from './components/FacilityList';
import AddFacility from './components/AddFacility';
import EditFacility from './components/EditFacility';
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
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<FacilityList />} />
              <Route path="/facilities" element={<FacilityList />} />
              <Route path="/add-facility" element={<AddFacility />} />
              <Route path="/edit-facility/:id" element={<EditFacility />} />
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