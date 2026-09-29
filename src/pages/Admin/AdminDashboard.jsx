import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/metrics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) navigate('/admin/login');
          throw new Error('Failed to fetch metrics');
        }
        return res.json();
      })
      .then(setMetrics)
      .catch(console.error);
  }, [navigate]);

  if (!metrics) return <div>Loading dashboard...</div>;

  return (
    <div className="admin-dashboard page-enter">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <h3 style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '10px' }}>Total Sales</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{metrics.totalSales.toLocaleString('en-IN')}</div>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <h3 style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '10px' }}>Total Orders</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{metrics.totalOrders}</div>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <h3 style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '10px' }}>Today's Orders</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{metrics.todaysOrders}</div>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <h3 style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '10px' }}>Pending / Processing</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-accent)' }}>{metrics.pendingOrders} / {metrics.processingOrders}</div>
        </div>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <h3 style={{ color: 'var(--color-gray)', fontSize: '14px', marginBottom: '10px' }}>Low Stock Products</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: metrics.lowStockProducts > 0 ? '#d32f2f' : 'inherit' }}>
            {metrics.lowStockProducts}
          </div>
        </div>
      </div>
    </div>
  );
}
