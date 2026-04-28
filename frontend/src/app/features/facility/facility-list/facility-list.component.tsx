import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../../core/api';

interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  status: string;
}

export const FacilityListComponent = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/facilities`);
      const data = await res.json();
      setFacilities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load facilities', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;
    try {
      const res = await fetch(`${API_BASE}/facilities/${id}`, { method: 'DELETE' });
      if (res.ok) loadFacilities();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filtered = facilities.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '30px' }}>
      <style>{`
        .facility-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .facility-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #eee; }
        .search-bar { width: 100%; max-width: 400px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; }
        .actions { display: flex; gap: 10px; margin-top: 15px; }
        .btn-add { background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; margin-bottom: 20px; }
        .btn-edit { background: #f3f4f6; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
        .btn-del { background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
      `}</style>

      <div className="flex-between">
        <div>
          <h1>🏢 Campus Facilities</h1>
          <p>Browse and manage campus resources</p>
        </div>
        <button className="btn-add" onClick={() => navigate('/facilities/add')}>+ Add Facility</button>
      </div>

      <input 
        className="search-bar"
        placeholder="Search by name or type..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <p>Loading facilities...</p>
      ) : (
        <div className="facility-grid">
          {filtered.map(f => (
            <div key={f.id} className="facility-card">
              <h3>{f.name}</h3>
              <p><strong>Type:</strong> {f.type}</p>
              <p><strong>Location:</strong> {f.location}</p>
              <p><strong>Capacity:</strong> {f.capacity}</p>
              <div className="actions">
                <button className="btn-edit" onClick={() => navigate(`/facilities/edit/${f.id}`)}>Edit</button>
                <button className="btn-del" onClick={() => handleDelete(f.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};