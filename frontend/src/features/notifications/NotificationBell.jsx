import { useEffect, useState } from 'react';
import { getNotifications, markAsRead } from '../core/api/notifications';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* 🔔 Bell */}
      <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
        🔔
        {unreadCount > 0 && (
          <span style={{
            color: 'white',
            background: 'red',
            borderRadius: '50%',
            padding: '2px 6px',
            marginLeft: '5px',
            fontSize: '12px'
          }}>
            {unreadCount}
          </span>
        )}
      </div>

      {/* 📥 Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '30px',
          background: '#1e293b',
          borderRadius: '8px',
          width: '300px',
          padding: '10px',
          zIndex: 1000
        }}>
          <h4>Notifications</h4>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleRead(n.id)}
                style={{
                  padding: '8px',
                  marginBottom: '5px',
                  background: n.read ? '#334155' : '#475569',
                  cursor: 'pointer',
                  borderRadius: '5px'
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;