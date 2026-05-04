import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:4000/api/orders/user/${user._id}?type=buyer`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) {
    return (
      <section className="order-history-page container py-5">
        <div className="text-center">
          <h1>Loading your order history...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="order-history-page container py-5">
      <div className="order-history-header mb-4">
        <h1>Your Order History</h1>
        <p>Track your purchases and order status</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
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
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span className="total-amount">Total: ${order.totalAmount}</span>
                <span className="seller-info">Seller: {order.seller.firstName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .order-history-page h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .order-history-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .empty-orders {
          background: white;
          padding: 40px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: white;
          padding: 24px;
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.08);
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

        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .product-info h5 {
          margin: 0 0 4px 0;
          font-size: 1rem;
        }

        .product-info p {
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
        }

        .total-amount {
          font-weight: 700;
          color: #6367ff;
        }

        .seller-info {
          color: #6b7280;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .order-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </section>
  );
}

export default OrderHistory;