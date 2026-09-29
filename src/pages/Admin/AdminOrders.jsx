import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return navigate('/admin/login');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        fetchOrders(); // Refresh list
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
      case 'DELIVERED': return 'success';
      case 'FAILED':
      case 'CANCELLED': return 'danger';
      case 'PENDING': return 'warning';
      case 'PROCESSING':
      case 'SHIPPED': return 'info';
      default: return '';
    }
  };

  return (
    <div className="admin-orders page-enter">
      <div className="admin-header">
        <h1>Orders</h1>
      </div>

      <div className="admin-card admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderId}>
                <td style={{ fontWeight: 600 }}>{order.orderId}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.customer.fullName}</td>
                <td>₹{order.total.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`admin-badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    style={{ padding: '4px', borderRadius: '4px' }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
