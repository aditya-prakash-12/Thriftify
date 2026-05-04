import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Admin.css';

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // Fetch all users
      const usersRes = await fetch('http://localhost:4000/api/user/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch all products
      const productsRes = await fetch('http://localhost:4000/api/products');
      const productsData = await productsRes.json();
      setProducts(productsData);

      // Fetch all orders
      const ordersRes = await fetch('http://localhost:4000/api/orders/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/user/details/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setUserDetails(data);
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:4000/api/user/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(users.filter(u => u._id !== userId));
        setSelectedUser(null);
        setUserDetails(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const updateUser = async (userId) => {
    if (!editingUser) return;
    try {
      const res = await fetch(`http://localhost:4000/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingUser)
      });
      if (!res.ok) throw new Error('Failed to update user');
      setUsers(users.map(u => u._id === userId ? { ...u, ...editingUser } : u));
      if (userDetails) {
        setUserDetails({ ...userDetails, ...editingUser });
      }
      setEditingUser(null);
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`http://localhost:4000/api/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:4000/api/orders/${orderId}/admin-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  const userProductCount = selectedUser ? products.filter(p => p.seller?._id === selectedUser || p.seller === selectedUser).length : 0;
  const userOrdersAsSellerCount = selectedUser ? orders.filter(o => o.seller?._id === selectedUser || o.seller === selectedUser).length : 0;
  const userOrdersAsBuyerCount = selectedUser ? orders.filter(o => o.buyer?._id === selectedUser || o.buyer === selectedUser).length : 0;

  return (
    <section className="admin-panel container py-5">
      <div className="admin-header mb-4">
        <h1>Admin Panel</h1>
        <p>Complete control of the site</p>
      </div>

      <div className="admin-tabs mb-4">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users ({users.length})</button>
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products ({products.length})</button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders ({orders.length})</button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{products.length}</h3>
              <p>Total Products</p>
            </div>
            <div className="stat-card">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
            <div className="stat-card">
              <h3>₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-users">
          <h2>Users Management</h2>
          <div className="users-list">
            {users.map(u => (
              <div key={u._id} className={`user-card ${selectedUser === u._id ? 'selected' : ''}`}>
                <div className="user-info">
                  <h3>{u.firstName} {u.lastName}</h3>
                  <p><strong>Username:</strong> {u.username}</p>
                  <p><strong>Email:</strong> {u.email}</p>
                  <p><strong>Role:</strong> <span className="role-badge">{u.role}</span></p>
                </div>
                <div className="user-actions">
                  <button className="btn-view" onClick={() => fetchUserDetails(u._id)} title="View full details and manage this user">
                    👁️ View & Manage
                  </button>
                  <button className="btn-delete" onClick={() => deleteUser(u._id)} title="Delete this user permanently">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {selectedUser && userDetails && (
            <div className="user-details-modal">
              <div className="modal-overlay" onClick={() => { setSelectedUser(null); setUserDetails(null); setEditingUser(null); }}></div>
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{userDetails.firstName} {userDetails.lastName}</h2>
                  <button className="close-btn" onClick={() => { setSelectedUser(null); setUserDetails(null); setEditingUser(null); }} title="Close">×</button>
                </div>
                
                {editingUser ? (
                  <div className="edit-form">
                    <h3>Edit User Information</h3>
                    <div className="form-group">
                      <label>First Name:</label>
                      <input type="text" value={editingUser.firstName} onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Last Name:</label>
                      <input type="text" value={editingUser.lastName} onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Phone:</label>
                      <input type="text" value={editingUser.phone} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>City:</label>
                      <input type="text" value={editingUser.city} onChange={(e) => setEditingUser({...editingUser, city: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>State:</label>
                      <input type="text" value={editingUser.state} onChange={(e) => setEditingUser({...editingUser, state: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Country:</label>
                      <input type="text" value={editingUser.country} onChange={(e) => setEditingUser({...editingUser, country: e.target.value})} />
                    </div>
                    <div className="form-actions">
                      <button className="btn-save" onClick={() => updateUser(userDetails._id)}>💾 Save Changes</button>
                      <button className="btn-cancel" onClick={() => setEditingUser(null)}>❌ Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="user-full-details">
                    <div className="details-section">
                      <h3>Personal Information</h3>
                      <div className="detail-item">
                        <strong>Username:</strong>
                        <span>{userDetails.username}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Email:</strong>
                        <span>{userDetails.email}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Phone:</strong>
                        <span>{userDetails.phone || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Gender:</strong>
                        <span>{userDetails.gender || 'Not specified'}</span>
                      </div>
                      <div className="detail-item">
                        <strong>City:</strong>
                        <span>{userDetails.city || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <strong>State:</strong>
                        <span>{userDetails.state || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Country:</strong>
                        <span>{userDetails.country || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Role:</strong>
                        <span className="role-badge">{userDetails.role}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Member Since:</strong>
                        <span>{new Date(userDetails.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="details-section">
                      <h3>Activity Summary</h3>
                      <div className="user-stats">
                        <div className="stat-box">
                          <div className="stat-number">{userProductCount}</div>
                          <div className="stat-label">Products Listed</div>
                        </div>
                        <div className="stat-box">
                          <div className="stat-number">{userOrdersAsSellerCount}</div>
                          <div className="stat-label">Orders as Seller</div>
                        </div>
                        <div className="stat-box">
                          <div className="stat-number">{userOrdersAsBuyerCount}</div>
                          <div className="stat-label">Orders as Buyer</div>
                        </div>
                      </div>
                    </div>

                    {userProductCount > 0 && (
                      <div className="details-section">
                        <h3>📦 Products Listed ({userProductCount})</h3>
                        <div className="items-list">
                          {products.filter(p => p.seller?._id === selectedUser || p.seller === selectedUser).map(p => (
                            <div key={p._id} className="item-card">
                              <strong>{p.title}</strong>
                              <span className="price">₹{p.sellingPrice}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userOrdersAsSellerCount > 0 && (
                      <div className="details-section">
                        <h3>🛒 Orders as Seller ({userOrdersAsSellerCount})</h3>
                        <div className="items-list">
                          {orders.filter(o => o.seller?._id === selectedUser || o.seller === selectedUser).map(o => (
                            <div key={o._id} className="item-card">
                              <strong>Order #{o._id.slice(-8)}</strong>
                              <span className="price">₹{o.totalAmount}</span>
                              <span className={`status status-${o.status}`}>{o.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userOrdersAsBuyerCount > 0 && (
                      <div className="details-section">
                        <h3>🛍️ Orders as Buyer ({userOrdersAsBuyerCount})</h3>
                        <div className="items-list">
                          {orders.filter(o => o.buyer?._id === selectedUser || o.buyer === selectedUser).map(o => (
                            <div key={o._id} className="item-card">
                              <strong>Order #{o._id.slice(-8)}</strong>
                              <span className="price">₹{o.totalAmount}</span>
                              <span className={`status status-${o.status}`}>{o.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="modal-actions">
                      <button className="btn-edit" onClick={() => setEditingUser(userDetails)}>✏️ Edit User</button>
                      <button className="btn-delete" onClick={() => deleteUser(userDetails._id)}>🗑️ Delete User</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-products">
          <h2>Products Management</h2>
          <div className="products-list">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.title} />
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>Price: ₹{product.sellingPrice}</p>
                  <p>Seller: {product.seller?.firstName || 'Unknown'}</p>
                </div>
                <div className="product-actions">
                  <button className="btn-delete" onClick={() => deleteProduct(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-orders">
          <h2>Orders Management</h2>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p>Buyer: {order.buyer?.firstName}</p>
                  <p>Seller: {order.seller?.firstName}</p>
                  <p>Total: ₹{order.totalAmount}</p>
                  <p>Status: {order.status}</p>
                </div>
                <div className="order-actions">
                  <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Admin;