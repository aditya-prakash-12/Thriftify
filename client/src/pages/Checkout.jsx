import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { user, cart, setCart } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.firstName || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [orderNotes, setOrderNotes] = useState('');

  // Fetch seller information when component mounts or cart changes
  useEffect(() => {
    if (cart.length > 0) {
      // Check if seller info is already in the product
      if (cart[0].seller && typeof cart[0].seller === 'object') {
        setSellerInfo(cart[0].seller);
      } else if (cart[0].seller) {
        // If seller is just an ID, fetch the seller details
        fetchSellerInfo(cart[0].seller);
      }
    }
  }, [cart]);

  const fetchSellerInfo = async (sellerId) => {
    try {
      const response = await fetch(`https://thriftify-j4ll.onrender.com/api/user/${sellerId}`);
      if (response.ok) {
        const data = await response.json();
        setSellerInfo(data);
      }
    } catch (error) {
      console.error('Error fetching seller info:', error);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.sellingPrice || item.price || 0;
    return sum + price; // Remove quantity multiplication since each item has quantity 1
  }, 0);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate shipping address
    const requiredFields = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field].trim());

    // Phone validation (10 digits)
if (!/^[0-9]{10}$/.test(shippingAddress.phone)) {
  alert('Phone number must be exactly 10 digits');
  return;
}

// Pincode validation (6 digits)
if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
  alert('Pincode must be exactly 6 digits');
  return;
}

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        buyerId: user._id,
        products: cart.map(item => ({
          productId: item._id,
          quantity: 1, // Always 1 since each product has only 1 quantity
          price: item.sellingPrice || item.price || 0,
        })),
        totalAmount: cartTotal,
        paymentMethod: 'cash_on_delivery',
        shippingAddress,
        orderNotes,
      };

      const response = await fetch('https://thriftify-j4ll.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Clear cart and redirect
      setCart([]);
      alert('Order placed successfully! You will pay cash on delivery.');
      navigate('/dashboard');

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="checkout-page container py-5">
        <div className="text-center">
          <h1>Please login to checkout</h1>
          <button onClick={() => navigate('/login')} className="btn-login">
            Login
          </button>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout-page container py-5">
        <div className="text-center">
          <h1>Your cart is empty</h1>
          <button onClick={() => navigate('/products')} className="btn-shop">
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page container py-5">
      <div className="checkout-header mb-4">
        <h1>Checkout</h1>
        <p>Complete your order with Cash on Delivery</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          <div className="form-section">
            <h3>Shipping Address</h3>
            <form onSubmit={handleSubmitOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  placeholder="Street address, apartment, etc."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleAddressChange}
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="orderNotes">Order Notes (Optional)</label>
                <textarea
                  id="orderNotes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions for delivery..."
                />
              </div>

              <div className="payment-section">
                <h4>Payment Method</h4>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cash_on_delivery"
                    checked={true}
                    readOnly
                  />
                  <label htmlFor="cod">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order is delivered to your doorstep</p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-place-order"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        <aside className="order-summary">
          <div className="summary-box">
            <h3>Order Summary</h3>

            <div className="order-items">
              {cart.map((item) => {
                const price = item.sellingPrice || item.price || 0;
                return (
                  <div className="order-item" key={item._id}>
                    <img src={item.image || item.img} alt={item.title || item.name} />
                    <div className="item-info">
                      <h5>{item.title || item.name}</h5>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{price.toFixed(2)} each</p>
                    </div>
                    <div className="item-total">
                      ₹{(price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {sellerInfo && (
              <div className="seller-info">
                <h4>Seller Address</h4>
                <div className="seller-details">
                  <p><strong>{sellerInfo.firstName || ''} {sellerInfo.lastName || ''}</strong></p>
                  {sellerInfo.address && <p>{sellerInfo.address}</p>}
                  <p>{sellerInfo.city || ''}{sellerInfo.state ? ', ' + sellerInfo.state : ''} {sellerInfo.country || ''}</p>
                  {sellerInfo.phone && <p>Phone: {sellerInfo.phone}</p>}
                </div>
              </div>
            )}

            <div className="summary-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final">
                <span><strong>Total:</strong></span>
                <span><strong>₹{cartTotal.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .checkout-page {
          background: linear-gradient(135deg, #f7f8ff 0%, #f0e6ff 100%);
          min-height: 100vh;
          padding: 40px 0;
        }

        .checkout-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .checkout-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
          align-items: start;
        }

        .checkout-form {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .form-section h3 {
          color: #111827;
          margin-bottom: 24px;
          font-size: 1.3rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6367ff;
        }

        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .payment-section {
          margin: 32px 0;
          padding: 24px;
          background: #f8fafc;
          border-radius: 16px;
        }

        .payment-section h4 {
          margin-bottom: 16px;
          color: #111827;
        }

        .payment-option {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .payment-option input[type="radio"] {
          margin-top: 4px;
          accent-color: #6367ff;
        }

        .payment-option label {
          flex: 1;
        }

        .payment-option strong {
          display: block;
          color: #111827;
          margin-bottom: 4px;
        }

        .payment-option p {
          color: #6b7280;
          margin: 0;
          font-size: 0.9rem;
        }

        .btn-place-order {
          width: 100%;
          background: #6367ff;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(99,103,255,0.25);
        }

        .btn-place-order:hover:not(:disabled) {
          background: #8494ff;
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(99,103,255,0.35);
        }

        .btn-place-order:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .order-summary {
          position: sticky;
          top: 20px;
        }

        .summary-box {
          background: white;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .summary-box h3 {
          color: #111827;
          margin-bottom: 24px;
          font-size: 1.3rem;
        }

        .order-items {
          margin-bottom: 24px;
        }

        .order-item {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .item-info h5 {
          margin: 0 0 4px 0;
          font-size: 0.9rem;
          color: #111827;
        }

        .item-info p {
          margin: 2px 0;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .item-total {
          font-weight: 600;
          color: #6367ff;
          margin-left: auto;
          align-self: center;
        }

        .summary-total {
          border-top: 2px solid #e5e7eb;
          padding-top: 16px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #6b7280;
        }

        .total-row.final {
          font-size: 1.1rem;
          color: #111827;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-login, .btn-shop {
          background: #6367ff;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
          margin-top: 20px;
        }

        .btn-login:hover, .btn-shop:hover {
          background: #8494ff;
        }

        .seller-info {
          margin: 20px 0;
          padding: 16px;
          background: #f0f4ff;
          border-radius: 12px;
          border-left: 4px solid #6367ff;
        }

        .seller-info h4 {
          margin: 0 0 12px 0;
          color: #111827;
          font-size: 0.95rem;
        }

        .seller-details {
          margin: 0;
        }

        .seller-details p {
          margin: 4px 0;
          color: #374151;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .seller-details strong {
          color: #111827;
        }

        @media (max-width: 992px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: static;
          }
        }

        @media (max-width: 576px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .checkout-form {
            padding: 20px;
          }

          .summary-box {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default Checkout;
