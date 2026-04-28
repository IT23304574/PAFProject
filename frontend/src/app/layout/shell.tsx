import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../features/auth/auth.service';

export const Shell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="shell-wrapper">
      <style>{`
        .shell-wrapper { display: flex; min-height: 100vh; background: #f4f7fe; }
        
        /* Sidebar Styling */
        .sidebar { width: 260px; background: #1e293b; color: white; display: flex; flex-direction: column; }
        .sidebar-header { padding: 30px 24px; font-size: 20px; font-weight: 700; color: #38bdf8; border-bottom: 1px solid #334155; }
        .nav-links { flex: 1; padding: 24px 12px; }
        .nav-item { 
          display: flex; align-items: center; padding: 12px 16px; color: #94a3b8; 
          text-decoration: none; border-radius: 8px; margin-bottom: 4px; transition: all 0.2s; 
        }
        .nav-item:hover { background: #334155; color: white; }
        .nav-item.active { background: #38bdf8; color: #0f172a; font-weight: 600; }
        
        /* Main Area Styling */
        .main-area { flex: 1; display: flex; flex-direction: column; }
        .header { 
          height: 70px; background: white; border-bottom: 1px solid #e2e8f0; 
          display: flex; align-items: center; justify-content: flex-end; padding: 0 40px; gap: 20px;
        }
        .user-info { display: flex; align-items: center; gap: 12px; }
        .user-name { font-weight: 500; color: #334155; }
        .logout-btn { 
          background: #fee2e2; color: #dc2626; border: none; padding: 8px 16px; 
          border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;
        }
        .content-body { flex: 1; overflow-y: auto; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-header">
          🚀 Campus Ops
        </div>
        <nav className="nav-links">
          <Link 
            to="/facilities" 
            className={`nav-item ${isActive('/facilities') ? 'active' : ''}`}
          >
            🏢 Facilities
          </Link>
          <Link 
            to="/bookings" 
            className={`nav-item ${isActive('/bookings') ? 'active' : ''}`}
          >
            📅 My Bookings
          </Link>
          <Link 
            to="/tickets" 
            className={`nav-item ${isActive('/tickets') ? 'active' : ''}`}
          >
            🔧 Tickets
          </Link>
        </nav>
      </aside>

      <main className="main-area">
        <header className="header">
          <div className="user-info">
            <span className="user-name">{user.fullName || 'User'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="content-body">
          {/* This is where the children routes (like BookingsPage) are rendered */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};