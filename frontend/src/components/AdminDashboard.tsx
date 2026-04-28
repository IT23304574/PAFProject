import React, { useState, useEffect } from 'react';
import { facilityService, Facility } from '../services/facility.service';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    facilityService.getAll()
      .then((response) => {
        setFacilities(response.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const totalFacilities = facilities.length;
  const activeFacilities = facilities.filter(f => f.status === 'ACTIVE').length;
  const inactiveFacilities = facilities.filter(f => f.status === 'OUT_OF_SERVICE').length;
  const utilization = totalFacilities > 0 ? ((activeFacilities / totalFacilities) * 100).toFixed(0) : 0;

  // Group by type
  const typeCount: { [key: string]: number } = {};
  facilities.forEach(f => {
    typeCount[f.type] = (typeCount[f.type] || 0) + 1;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Admin Dashboard</h1>
        <p>Overview of campus facilities</p>
      </div>

      {isLoading ? (
        <div className="loading">⏳ Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-value">{totalFacilities}</div>
              <div className="stat-label">Total Facilities</div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{activeFacilities}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">⚠️</div>
              <div className="stat-value">{inactiveFacilities}</div>
              <div className="stat-label">Inactive</div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{utilization}%</div>
              <div className="stat-label">Utilization</div>
            </div>
          </div>

          {/* Facilities by Type Chart */}
          <div className="chart-card">
            <h3>📊 Facilities by Type</h3>
            <div className="type-list">
              {Object.entries(typeCount).map(([type, count]) => (
                <div key={type} className="type-item">
                  <span className="type-name">{type}</span>
                  <div className="bar-container">
                    <div className="bar" style={{ width: `${(count / totalFacilities) * 100}%` }}></div>
                  </div>
                  <span className="type-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Facilities Table */}
          <div className="recent-card">
            <h3>📋 Recent Facilities</h3>
            <table className="recent-table">
              <thead>
                <tr key="header">
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {facilities.slice(0, 5).map((facility) => (
                  <tr key={facility.id}>
                    <td>{facility.name}</td>
                    <td>{facility.type}</td>
                    <td>{facility.location}</td>
                    <td className="status-cell">
                      <span className={facility.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}>
                        {facility.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;