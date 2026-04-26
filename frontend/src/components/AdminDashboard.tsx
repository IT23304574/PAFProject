import React, { useState, useEffect } from 'react';
import { facilityService, Facility } from '../services/facility.service';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    facilityService.getAll().then((response) => {
      setFacilities(response.data);
    }).catch(() => {});
  }, []);

  const totalFacilities = facilities.length;
  const activeFacilities = facilities.filter(f => f.status === 'ACTIVE').length;
  const inactiveFacilities = facilities.filter(f => f.status === 'OUT_OF_SERVICE').length;

  const typeCount = facilities.reduce((acc, f) => {
    acc[f.type] = (acc[f.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="dashboard-container">
      <h2>📊 Admin Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalFacilities}</div>
          <div className="stat-label">Total Facilities</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{activeFacilities}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-value">{inactiveFacilities}</div>
          <div className="stat-label">Inactive</div>
        </div>
      </div>

      <div className="chart-card">
        <h3>Facilities by Type</h3>
        <div className="type-list">
          {Object.entries(typeCount).map(([type, count]) => (
            <div key={type} className="type-item">
              <span>{type}</span>
              <div className="bar-container">
                <div className="bar" style={{ width: `${(count / totalFacilities) * 100}%` }}></div>
              </div>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;