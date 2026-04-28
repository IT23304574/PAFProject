import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE } from '../../../core/api';

export const FacilityFormComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [facility, setFacility] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: 0,
    location: '',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetch(`${API_BASE}/facilities/${id}`)
        .then(res => res.json())
        .then(data => setFacility(data))
        .catch(err => console.error('Load failed', err));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditMode ? `${API_BASE}/facilities/${id}` : `${API_BASE}/facilities`;
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facility)
      });

      if (res.ok) {
        navigate('/facilities');
      }
    } catch (err) {
      alert('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <div className="card">
        <h2>{isEditMode ? '✏️ Edit Facility' : '🏢 Add New Facility'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Facility Name</label>
            <input 
              value={facility.name} 
              onChange={e => setFacility({...facility, name: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select 
              value={facility.type} 
              onChange={e => setFacility({...facility, type: e.target.value})}
            >
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              value={facility.location} 
              onChange={e => setFacility({...facility, location: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Capacity</label>
            <input 
              type="number" 
              value={facility.capacity} 
              onChange={e => setFacility({...facility, capacity: parseInt(e.target.value)})} 
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Facility'}
            </button>
            <button type="button" className="secondary" onClick={() => navigate('/facilities')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};