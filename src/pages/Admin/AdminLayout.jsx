import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [navigate, location]);

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>StyleHub <span>Admin</span></h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
          <Link to="/admin/products" className={location.pathname.includes('/products') ? 'active' : ''}>Products</Link>
          <Link to="/admin/orders" className={location.pathname.includes('/orders') ? 'active' : ''}>Orders</Link>
          <Link to="/admin/offers" className={location.pathname.includes('/offers') ? 'active' : ''}>Offers</Link>
        </nav>
        <div className="admin-logout">
          <button onClick={handleLogout} className="btn btn-secondary btn-full">Logout</button>
          <Link to="/" className="back-to-store">Back to Store</Link>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
