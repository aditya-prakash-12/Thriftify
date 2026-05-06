import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active tab from URL params, default to 'overview'
  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const matchesSeller = (sellerValue) => {
    if (!sellerValue) return false;
    if (typeof sellerValue === 'string') return sellerValue === user._id;
    if (sellerValue._id) return sellerValue._id.toString() === user._id;
    if (typeof sellerValue.toString === 'function') return sellerValue.toString() === user._id;
    return false;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user's products (for seller functionality)
    fetch("https://thriftify-j4ll.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Filter products by current user
        const userProducts = data.filter((item) =>
          matchesSeller(item.seller) || matchesSeller(item.sellerId)
        );
        setProducts(userProducts);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });

    // Fetch orders where user is seller
    fetch(`https://thriftify-j4ll.onrender.com/api/orders/user/${user._id}?type=seller`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching seller orders:', err);
        setLoading(false);
      });
  }, [user, navigate]);

  const toggleProductStatus = (productId, statusType) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId
          ? {
              ...product,
              [statusType]: !product[statusType]
            }
          : product
      )
    );
  };

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleEditProduct = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://thriftify-j4ll.onrender.com/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, sellerId: user._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <section className="dashboard-page container py-5">
        <div className="text-center">
          <h1>Loading your dashboard...</h1>
        </div>
      </section>
    );
  }

  const activeProducts = products; // All products are active since we don't have inactive status
  const totalReviews = products.reduce((sum, p) => sum + (p.totalReviews || 0), 0);
  const averageRating = products.length > 0
    ? products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length
    : 0;

  // Order statistics
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const packedOrders = orders.filter(o => o.status === 'packed');
  const dispatchedOrders = orders.filter(o => o.status === 'dispatched');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <section className="dashboard-page container py-5">
      <div className="dashboard-header mb-4">
        <h1>My Dashboard</h1>
        <p>Manage your products, orders, and account</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid mb-5">
        {/* Seller Stats */}
        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>My Products</p>
        </div>
        <div className="stat-card">
          <h3>{activeProducts.length}</h3>
          <p>Active Products</p>
        </div>
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Sales Orders</p>
        </div>
        <div className="stat-card">
          <h3>₹{totalRevenue.toFixed(2)}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>{pendingOrders.length}</h3>
          <p>Pending Orders</p>
        </div>
        <div className="stat-card">
          <h3>{processingOrders.length}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{packedOrders.length}</h3>
          <p>Packed</p>
        </div>
        <div className="stat-card">
          <h3>{dispatchedOrders.length}</h3>
          <p>Dispatched</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs mb-4">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          My Products ({products.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'seller-orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('seller-orders')}
        >
          Sales Orders ({orders.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="overview-grid">
            {/* Seller Overview */}
            <div className="overview-card">
              <h3>Seller Activity</h3>
              <div className="overview-stats">
                <div className="stat-item">
                  <span className="stat-label">Products Listed:</span>
                  <span className="stat-value">{products.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Products:</span>
                  <span className="stat-value">{activeProducts.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Sales:</span>
                  <span className="stat-value">₹{totalRevenue.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Orders to Fulfill:</span>
                  <span className="stat-value">{pendingOrders.length + processingOrders.length + packedOrders.length + dispatchedOrders.length}</span>
                </div>
              </div>
              <button
                className="btn-manage"
                onClick={() => setActiveTab('products')}
              >
                Manage Products
              </button>
            </div>

            {/* Quick Actions */}
            <div className="overview-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button
                  className="btn-action"
                  onClick={() => navigate('/sell')}
                >
                  + Add Product
                </button>
                <button
                  className="btn-action"
                  onClick={() => setActiveTab('seller-orders')}
                >
                  📦 Manage Orders
                </button>
                <button
                  className="btn-action"
                  onClick={() => navigate('/orderhistory')}
                >
                  📋 View My Orders
                </button>
                <button
                  className="btn-action"
                  onClick={() => navigate('/messages')}
                >
                  💬 View Messages
                </button>
                {user.role === 'admin' && (
                  <button
                    className="btn-action"
                    onClick={() => navigate('/admin')}
                  >
                    🛠️ Admin Panel
                  </button>
                )}
                <button
                  className="btn-action"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="products-management">
          <div className="section-header">
            <h2>My Products</h2>
            <button
              className="btn-add-product"
              onClick={() => navigate('/sell')}
            >
              Add New Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="empty-products">
              <h3>No products listed yet</h3>
              <p>Start selling by adding your first product!</p>
              <button
                className="btn-add-product"
                onClick={() => navigate('/sell')}
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const avgRating = product.averageRating || 0;
                const reviews = product.totalReviews || 0;

                return (
                  <div className={`product-card-dashboard ${product.isInactive ? 'inactive' : ''}`} key={product._id}>
                    <div className="product-image">
                      <img src={product.image || product.img} alt={product.title || product.name} />
                      {product.isInactive && <div className="inactive-overlay">Inactive</div>}
                    </div>

                    <div className="product-info">
                      <h3>{product.title || product.name}</h3>
                      <p className="category">{product.category}</p>

                      <div className="pricing">
                        {product.originalPrice && product.sellingPrice ? (
                          <>
                            <span className="original-price">₹{product.originalPrice}</span>
                            <span className="selling-price">₹{product.sellingPrice}</span>
                          </>
                        ) : (
                          <span className="selling-price">₹{product.price || product.sellingPrice}</span>
                        )}
                      </div>

                      <div className="stats">
                        <div className="rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(avgRating) ? 'star filled' : 'star'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="rating-text">
                            {avgRating > 0 ? `${avgRating.toFixed(1)} (${reviews})` : 'No ratings'}
                          </span>
                        </div>
                      </div>

                      {/* <div className="product-status">
                        <div className="status-toggle">
                          <label>
                            <input
                              type="checkbox"
                              checked={!product.isInactive}
                              onChange={() => toggleProductStatus(product._id, 'isInactive')}
                            />
                            Active
                          </label>
                        </div>
                        <div className="status-toggle">
                          <label>
                            <input
                              type="checkbox"
                              checked={!product.outOfStock}
                              onChange={() => toggleProductStatus(product._id, 'outOfStock')}
                            />
                            In Stock
                          </label>
                        </div>
                      </div> */}

                      <div className="actions">
                        <button
                          className="btn-view"
                          onClick={() => handleViewProduct(product._id)}
                        >
                          View
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditProduct(product._id)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'seller-orders' && (
        <div className="orders-management">
          <div className="section-header">
            <h2>Sales Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <h3>No sales orders yet</h3>
              <p>Orders for your products will appear here.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div className="order-card" key={order._id}>
                  <div className="order-header">
                    <span className="order-id">Order #{order._id.slice(-8)}</span>
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-products">
                    {order.products.map((item, index) => (
                      <div className="product-item" key={index}>
                        <img src={item.image} alt={item.title} className="product-image" />
                        <div className="product-info">
                          <h5>{item.title}</h5>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span className="shipping-address">Shipping Address: {order.shippingAddress ? `${order.shippingAddress.name}, ${order.shippingAddress.phone}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : 'Not provided'}</span><br />
                    <span className="total-amount">Total: ₹{order.totalAmount}</span>
                    <span className="buyer-info">Buyer: {order.buyer.firstName}</span>
                  </div>
                  <div className="order-actions">
                    {order.status === 'pending' && (
                      <button
                        className="btn-status"
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      >
                        Confirm Order
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        className="btn-status"
                        onClick={() => updateOrderStatus(order._id, 'processing')}
                      >
                        Start Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        className="btn-status"
                        onClick={() => updateOrderStatus(order._id, 'packed')}
                      >
                        Mark as Packed
                      </button>
                    )}
                    {order.status === 'packed' && (
                      <button
                        className="btn-status"
                        onClick={() => updateOrderStatus(order._id, 'dispatched')}
                      >
                        Mark as Dispatched
                      </button>
                    )}
                    {order.status === 'dispatched' && (
                      <button
                        className="btn-status"
                        onClick={() => updateOrderStatus(order._id, 'delivered')}
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing' || order.status === 'packed') && (
                      <button
                        className="btn-cancel"
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .dashboard-page h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(99,103,255,0.1);
          text-align: center;
        }

        .stat-card h3 {
          font-size: 2rem;
          color: #6367ff;
          margin-bottom: 8px;
        }

        .stat-card p {
          color: #6b7280;
          margin: 0;
        }

        .products-management {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .section-header h2 {
          margin: 0;
          color: #111827;
        }

        .btn-add-product {
          background: #6367ff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-add-product:hover {
          background: #8494ff;
        }

        .empty-products {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-products h3 {
          margin-bottom: 12px;
          color: #374151;
        }

        .empty-products p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .product-card-dashboard {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(99,103,255,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .product-card-dashboard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(99,103,255,0.15);
        }

        .product-card-dashboard.inactive {
          opacity: 0.7;
        }

        .product-image {
          height: 200px;
          overflow: hidden;
          position: relative;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .inactive-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .product-info {
          padding: 20px;
        }

        .product-info h3 {
          margin-bottom: 8px;
          color: #111827;
          font-size: 1.1rem;
        }

        .category {
          color: #6367ff;
          font-weight: 600;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }

        .pricing {
          margin-bottom: 12px;
        }

        .original-price {
          color: #999;
          text-decoration: line-through;
          margin-right: 8px;
          font-size: 0.9rem;
        }

        .selling-price {
          color: #6367ff;
          font-weight: 700;
        }

        .stats {
          margin-bottom: 16px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #ddd;
          font-size: 0.8rem;
        }

        .star.filled {
          color: #fbbf24;
        }

        .rating-text {
          font-size: 0.8rem;
          color: #666;
          font-weight: 600;
        }

        .product-status {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .status-toggle {
          display: flex;
          align-items: center;
        }

        .status-toggle label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
        }

        .status-toggle input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #6367ff;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-view, .btn-edit {
          flex: 1;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }

        .btn-view {
          background: white;
          border: 1px solid #6367ff;
          color: #6367ff;
        }

        .btn-view:hover {
          background: #f3f1ff;
        }

        .btn-edit {
          background: #6367ff;
          border: 1px solid #6367ff;
          color: white;
        }

        .btn-edit:hover {
          background: #8494ff;
        }

        /* Orders Management Styles */
        .orders-management {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .empty-orders {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-orders h3 {
          margin-bottom: 12px;
          color: #374151;
        }

        .empty-orders p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .order-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 25px rgba(99,103,255,0.08);
          border: 1px solid #e5e7eb;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-id {
          font-weight: 700;
          color: #6367ff;
        }

        .order-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-pending { background: #fef3c7; color: #d97706; }
        .status-confirmed { background: #dbeafe; color: #2563eb; }
        .status-processing { background: #fef3c7; color: #d97706; }
        .status-packed { background: #dbeafe; color: #2563eb; }
        .status-dispatched { background: #e0e7ff; color: #3730a3; }
        .status-delivered { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }

        .order-date {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .order-products {
          margin: 16px 0;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .product-item:last-child {
          border-bottom: none;
        }

        .product-item .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .product-item .product-info h5 {
          margin: 0 0 4px 0;
          font-size: 1rem;
        }

        .product-item .product-info p {
          margin: 2px 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }

        .total-amount {
          font-weight: 700;
          color: #6367ff;
        }

        .buyer-info {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .order-actions {
          text-align: center;
        }

        .btn-status {
          background: #6367ff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-status:hover {
          background: #8494ff;
        }

        .btn-cancel {
          background: #dc2626;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
          margin-left: 10px;
        }

        .btn-cancel:hover {
          background: #b91c1c;
        }

        /* Overview Styles */
        .overview-section {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .overview-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
        }

        .overview-card h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .overview-stats {
          margin-bottom: 20px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .stat-value {
          font-weight: 600;
          color: #1f2937;
        }

        .btn-manage {
          background: #6367ff;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
          width: 100%;
        }

        .btn-manage:hover {
          background: #8494ff;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .btn-action {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 10px 12px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }

        .btn-action:hover {
          background: #f3f4f6;
          border-color: #6367ff;
          color: #6367ff;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .product-status {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </section>
  );
}

export default Dashboard;
