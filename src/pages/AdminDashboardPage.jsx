import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/realApi';

export function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data.data);
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20">Loading...</div>;
  if (error) return <div className="p-20 text-red">{error}</div>;

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Admin Dashboard</h1>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>
              <th style={{ padding: '12px' }}>Username</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Last Login</th>
              <th style={{ padding: '12px' }}>Last Logout</th>
              <th style={{ padding: '12px' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{u.username}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: u.status === 'online' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                    color: u.status === 'online' ? '#22c55e' : '#6b7280'
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.status === 'online' ? '#22c55e' : '#6b7280' }} />
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px', color: 'var(--text2)', fontSize: '14px' }}>
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td style={{ padding: '12px', color: 'var(--text2)', fontSize: '14px' }}>
                  {u.lastLogout ? new Date(u.lastLogout).toLocaleString() : 'Never'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    background: u.role === 'admin' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                    color: u.role === 'admin' ? '#a855f7' : 'var(--text2)'
                  }}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
