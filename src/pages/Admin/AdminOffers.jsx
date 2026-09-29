import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminOffers() {
  const [offers, setOffers] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/offers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return navigate('/admin/login');
      const data = await res.json();
      setOffers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(offers)
      });
      if (res.ok) {
        alert('Offers updated successfully!');
      }
    } catch (e) {
      alert('Error updating offers');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (category, field, value) => {
    setOffers(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  if (!offers) return <div>Loading...</div>;

  return (
    <div className="admin-offers page-enter">
      <div className="admin-header">
        <h1>Manage Offers</h1>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSave}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>T-Shirts Offer</h2>
            <div className="admin-form-row">
              <div className="form-group">
                <label>Active</label>
                <select 
                  value={offers.tshirts.active} 
                  onChange={e => handleChange('tshirts', 'active', e.target.value === 'true')}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Target Quantity</label>
                <input 
                  type="number" 
                  value={offers.tshirts.quantity} 
                  onChange={e => handleChange('tshirts', 'quantity', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Offer Price (₹)</label>
                <input 
                  type="number" 
                  value={offers.tshirts.price} 
                  onChange={e => handleChange('tshirts', 'price', parseInt(e.target.value))}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>Jeans Offer</h2>
            <div className="admin-form-row">
              <div className="form-group">
                <label>Active</label>
                <select 
                  value={offers.jeans.active} 
                  onChange={e => handleChange('jeans', 'active', e.target.value === 'true')}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Target Quantity</label>
                <input 
                  type="number" 
                  value={offers.jeans.quantity} 
                  onChange={e => handleChange('jeans', 'quantity', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Offer Price (₹)</label>
                <input 
                  type="number" 
                  value={offers.jeans.price} 
                  onChange={e => handleChange('jeans', 'price', parseInt(e.target.value))}
                  min="0"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Offers Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
}
