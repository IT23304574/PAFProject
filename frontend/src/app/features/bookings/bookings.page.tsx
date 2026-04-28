import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../core/api';

interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string;
}

interface Facility {
  id: string;
  name: string;
  capacity: number;
}

export const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [resourceId, setResourceId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [occupancyMap, setOccupancyMap] = useState<Record<string, number>>({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  useEffect(() => {
    loadFacilities();
    if (userId) loadUserBookings();
  }, [userId]);

  // Effect to refresh occupancy whenever start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start < end) {
        fetchOccupancy(start.toISOString(), end.toISOString());
      }
    }
  }, [startTime, endTime]);

  const fetchOccupancy = async (start: string, end: string) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/occupancy?start=${start}&end=${end}`);
      const data = await res.json();
      setOccupancyMap(data);
    } catch (err) {
      console.error('Failed to fetch occupancy', err);
    }
  };

  const loadFacilities = async () => {
    try {
      setFetchError(null);
      console.log('FETCH START: Loading facilities from', `${API_BASE}/facilities`);
      const res = await fetch(`${API_BASE}/facilities`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Path Error: Backend mapping for ${API_BASE}/facilities not found.`);
      }
      const data = await res.json();
      console.log('DEBUG: Facilities raw data from server:', data);
      if (Array.isArray(data)) {
        setFacilities(data);
        if (data.length === 0) setFetchError("Database is empty. Please add facilities first.");
      } else {
        console.error('FETCH ERROR: Expected array but got:', data);
        setFacilities([]);
        setFetchError("Malformed data received from server.");
      }
    } catch (err) {
      console.error('FACILITY LOAD CRASH:', err);
      setFetchError(err instanceof Error ? err.message : "Could not connect to backend.");
      setFacilities([]);
    }
  };

  const loadUserBookings = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/me?userId=${userId}`);
      if (!res.ok) throw new Error('Server returned error for bookings');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceId || !startTime || !endTime || !userId) {
      alert('Please fill all fields');
      return;
    }

    setMessage('Creating booking...');
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          userId
        })
      });

      if (res.ok) {
        alert('Booking successful!');
        setResourceId('');
        setStartTime('');
        setEndTime('');
        loadUserBookings();
      } else {
        const errBody = await res.json().catch(() => ({}));
        alert('Error: ' + (errBody.message || 'Failed to create booking'));
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setMessage('');
    }
  };

  const getFacilityName = (id: string) => {
    return facilities.find(f => (f.id === id || (f as any)._id === id))?.name || id;
  };

  return (
    <div className="page-container">
      <style>{`
        .page-container { padding: 40px 20px; max-width: 1100px; margin: 0 auto; }
        .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #eee; margin-bottom: 30px; }
        .page-header h1 { font-size: 28px; color: #111; margin-bottom: 8px; }
        .page-header p { color: #666; margin-bottom: 32px; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; align-items: end; }
        .form-label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; }
        select, input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
        .btn-create { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .btn-create:disabled { background: #94a3b8; }
        .bookings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-top: 24px; }
        .booking-card { border-left: 4px solid #ddd; transition: transform 0.2s; }
        .booking-card:hover { transform: translateY(-2px); }
        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-cancelled { background: #f3f4f6; color: #374151; }
        .empty-state { text-align: center; padding: 60px; color: #999; }
      `}</style>

      <div className="page-header">
        <h1>📅 My Bookings</h1>
        <p>Manage your facility bookings and reservations</p>
      </div>

      <div className="card">
        <h3>📝 Create New Booking</h3>
        <form onSubmit={handleCreate} className="form-grid">
          <div className="form-group">
            <label className="form-label">Facility</label>
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              required
              disabled={facilities.length === 0}
            >
              <option value="">
                {fetchError || (facilities.length === 0 ? 'Loading facilities...' : 'Select facility')}
              </option>
              {Array.isArray(facilities) &&
                facilities.map((f) => {
                  const id = f.id || (f as any)._id;
                  const occupied = occupancyMap[id] || 0;
                  const available = f.capacity - occupied;
                  const isFull = available <= 0;

                  return (
                    <option key={id} value={id} disabled={isFull}>
                      {f.name} {startTime && endTime ? `(Available: ${available > 0 ? available : 0} / ${f.capacity})` : `(Max: ${f.capacity})`}
                      {isFull ? ' - FULL' : ''}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">End Time</label>
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
          <button type="submit" className="btn-create" disabled={!!message}>
            {message || 'Create Booking'}
          </button>
        </form>
      </div>

      <div className="bookings-section">
        <div className="flex-between">
          <h2>📋 Booking History</h2>
          <button className="secondary" onClick={loadUserBookings}>Refresh</button>
        </div>

        {loading ? (
          <div className="empty-state">Loading your data...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings found. Start by creating one above!</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {Array.isArray(bookings) && bookings.map((b) => (
              <div key={b.id} className="card booking-card" style={{ borderLeftColor: b.status === 'APPROVED' ? '#10b981' : '#f59e0b' }}>
                <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{getFacilityName(b.resourceId)}</strong>
                  <span className={`status-pill status-${b.status?.toLowerCase()}`}>{b.status}</span>
                </div>
                <div style={{ marginTop: '16px', fontSize: '13px', color: '#555' }}>
                  <div>Start: {new Date(b.startTime).toLocaleString()}</div>
                  <div>End: {new Date(b.endTime).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
