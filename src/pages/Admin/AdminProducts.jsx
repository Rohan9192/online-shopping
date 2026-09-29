import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return navigate('/admin/login');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (product) => {
    setEditing({ ...product });
  };

  const handleCreate = () => {
    setEditing({
      name: '',
      category: 'tshirts',
      price: 0,
      originalPrice: 0,
      description: '',
      images: [''],
      colors: [],
      sizes: [],
      stock: 10,
      isActive: true
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchProducts();
    } catch (e) {
      alert('Error deleting');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const isNew = !editing.id;
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${editing.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editing)
      });
      if (res.ok) {
        setEditing(null);
        fetchProducts();
      }
    } catch (err) {
      alert('Error saving');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        const newImages = [...editing.images];
        newImages[0] = data.imageUrl; // Store first image
        setEditing({ ...editing, images: newImages });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload error');
    }
  };

  const handleArrayChange = (field, val) => {
    setEditing({ ...editing, [field]: val.split(',').map(s => s.trim()).filter(Boolean) });
  };

  return (
    <div className="admin-products page-enter">
      <div className="admin-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={handleCreate}>Add New Product</button>
      </div>

      {editing ? (
        <div className="admin-card">
          <h2>{editing.id ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSave} style={{ marginTop: '20px' }}>
            <div className="admin-form-row">
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})}>
                  <option value="tshirts">T-Shirts</option>
                  <option value="jeans">Jeans</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input required type="number" value={editing.price} onChange={e => setEditing({...editing, price: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input type="number" value={editing.originalPrice || ''} onChange={e => setEditing({...editing, originalPrice: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="form-group">
                <label>Stock</label>
                <input type="number" required value={editing.stock || 0} onChange={e => setEditing({...editing, stock: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editing.isActive !== false} onChange={e => setEditing({...editing, isActive: e.target.value === 'true'})}>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} rows="3"></textarea>
            </div>

            <div className="admin-form-row">
              <div className="form-group">
                <label>Sizes (comma separated)</label>
                <input type="text" value={(editing.sizes || []).join(', ')} onChange={e => handleArrayChange('sizes', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Colors (comma separated)</label>
                <input type="text" value={(editing.colors || []).join(', ')} onChange={e => handleArrayChange('colors', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Main Image</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="text" value={editing.images[0] || ''} onChange={e => {
                  const newImages = [...editing.images];
                  newImages[0] = e.target.value;
                  setEditing({...editing, images: newImages});
                }} placeholder="Image URL" style={{ flex: 1 }} />
                <span>OR</span>
                <input type="file" onChange={handleImageUpload} accept="image/*" />
              </div>
              {editing.images[0] && (
                <img src={editing.images[0]} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '4px' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">Save Product</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-card admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.images?.[0] || 'https://via.placeholder.com/50'} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>{p.stock !== undefined ? p.stock : 'N/A'}</td>
                  <td>
                    <span className={`admin-badge ${p.isActive !== false ? 'success' : 'danger'}`}>
                      {p.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
