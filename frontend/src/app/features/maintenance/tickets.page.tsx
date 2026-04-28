import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../core/api';

interface Ticket {
  id: string;
  resourceId: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  createdAt?: string;
}

export const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resourceId, setResourceId] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  useEffect(() => {
    if (userId) loadTickets();
  }, [userId]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tickets/me?userId=${userId}`);
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId, category, priority, description, userId })
      });
      if (res.ok) {
        alert('Ticket created!');
        setResourceId('');
        setDescription('');
        loadTickets();
      }
    } catch (err) {
      alert('Create failed');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <style>{`
        .ticket-card { background: white; padding: 20px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #eee; }
        .priority-badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
        .priority-high { background: #fee2e2; color: #dc2626; }
        .priority-medium { background: #fef3c7; color: #d97706; }
        .priority-low { background: #f3f4f6; color: #4b5563; }
        .form-card { background: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; margin-bottom: 5px; font-weight: 500; }
        .input-group input, .input-group select, .input-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
      `}</style>

      <h1>🔧 Maintenance Tickets</h1>
      
      <div className="form-card">
        <h3>Create New Ticket</h3>
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Resource ID</label>
            <input value={resourceId} onChange={e => setResourceId(e.target.value)} required placeholder="e.g. ROOM_101" />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option>Maintenance</option>
                <option>Cleaning</option>
                <option>IT Support</option>
              </select>
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
          </div>
          <button type="submit" className="btn-create">Submit Ticket</button>
        </form>
      </div>

      <h3>My Tickets</h3>
      {loading ? <p>Loading...</p> : (
        <div>
          {tickets.map(t => (
            <div key={t.id} className="ticket-card">
              <div className="flex-between">
                <strong>#{t.id.slice(-6)} - {t.resourceId}</strong>
                <span className={`priority-badge priority-${t.priority.toLowerCase()}`}>{t.priority}</span>
              </div>
              <p style={{ margin: '10px 0', color: '#4b5563' }}>{t.description}</p>
              <div className="flex-between" style={{ fontSize: '12px', color: '#9ca3af' }}>
                <span>Category: {t.category}</span>
                <span>Status: {t.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
