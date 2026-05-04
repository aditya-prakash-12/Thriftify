import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useAuth();
  const navigate = useNavigate();
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.sellingPrice || item.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <section className="cart-page container py-5">
      <div className="cart-header mb-4">
        <h1>Shopping Cart</h1>
        <p className="text-muted">
          {cart.length
            ? `You have ${cart.length} item(s) in your cart.`
            : 'Your shopping cart is currently empty.'}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-card">
          <p>There are no items in your cart yet.</p>
          <Link to="/products" className="browse-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => {
              const price = item.sellingPrice || item.price || 0;
              return (
                <div className="cart-item" key={item._id}>
                  <img src={item.image || item.img} alt={item.name || item.title} />
                  <div className="item-details">
                    <h4>{item.title || item.name}</h4>
                    <p>₹{price.toFixed(2)} each</p>
                    <p className="quantity-display">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-actions">
                    <p className="item-total">₹{(price * item.quantity).toFixed(2)}</p>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <div className="summary-box">
              <h3>Order Summary</h3>
              <p>{cart.length} item(s)</p>
              <div className="summary-total">
                <span>Total:</span>
                <strong>₹{cartTotal.toFixed(2)}</strong>
              </div>
              <button className="checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .cart-page h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .cart-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .empty-cart-card {
          background: white;
          padding: 40px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .browse-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 26px;
          border-radius: 999px;
          background: #6367FF;
          color: white;
          text-decoration: none;
          font-weight: 700;
          transition: background 0.3s ease;
        }

        .browse-btn:hover {
          background: #8494FF;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 2.25fr 1fr;
          gap: 30px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 110px 1fr auto;
          gap: 18px;
          align-items: center;
          padding: 24px;
          border-radius: 24px;
          background: white;
          box-shadow: 0 18px 40px rgba(99,103,255,0.08);
        }

        .cart-item img {
          width: 100%;
          border-radius: 18px;
          object-fit: cover;
          height: 110px;
        }

        .item-details h4 {
          margin-bottom: 8px;
          font-size: 1.05rem;
        }

        .item-details p {
          color: #6367FF;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-control input {
          width: 70px;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 0.95rem;
        }

        .item-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }

        .item-total {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
        }

        .remove-btn {
          background: transparent;
          border: 1px solid #e5e7eb;
          color: #374151;
          padding: 10px 18px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .remove-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .cart-summary {
          position: sticky;
          top: 24px;
          align-self: start;
        }

        .summary-box {
          background: white;
          padding: 28px;
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .summary-box h3 {
          margin-bottom: 18px;
        }

        .summary-box p {
          color: #6b7280;
          margin-bottom: 18px;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          font-size: 1.05rem;
        }

        .checkout-btn {
          width: 100%;
          padding: 14px 0;
          border: none;
          border-radius: 999px;
          background: #6367FF;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .checkout-btn:hover {
          background: #8494FF;
        }

        @media (max-width: 992px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .cart-item {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .item-actions {
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}

export default CartPage;
