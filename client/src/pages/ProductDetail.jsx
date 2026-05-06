import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const { user, addToCart, cart, sendMessage, addReview, getProductReviews, getAverageRating } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDetails, setExpandedDetails] = useState('description');
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const res = await fetch(`https://thriftify-j4ll.onrender.com/api/products/${id}`);
        const found = await res.json();
        setProduct(found);

        if (found) {
          const reviewsData = await getProductReviews(id);
          setReviews(reviewsData);
          const avg = await getAverageRating(id);
          setAverageRating(avg);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id, getProductReviews, getAverageRating]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const isInCart = product && cart.some((item) => item._id === product._id);
  const discount = product
    ? Math.round(
        ((product.originalPrice - product.sellingPrice) /
          product.originalPrice) *
          100
      )
    : 0;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    if (messageText.trim() && product?.seller?._id) {
      sendMessage(id, messageText, product.seller._id);
      setMessageText('');
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    if (reviewText.trim()) {
      await addReview(id, reviewRating, reviewText);
      setReviewText('');
      setReviewRating(5);
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
      // Refresh reviews
      const reviewsData = await getProductReviews(id);
      setReviews(reviewsData);
      const avg = await getAverageRating(id);
      setAverageRating(avg);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <section className="product-detail-page">
      <div className="container py-5">
        <div className="breadcrumb mb-4">
          <button onClick={() => navigate('/products')}>← Back to Products</button>
        </div>

        <div className="product-detail-grid">
          <aside className="product-image-section">
            <div className="product-image-container">
              <img src={product.image || product.img} alt={product.title || product.name} />
              {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
            </div>
          </aside>

          <main className="product-info-section">
            <div className="product-header">
              <h1>{product.title || product.name}</h1>
              <p className="category">{product.category}</p>
            </div>

            <div className="price-section">
              {product.originalPrice && product.sellingPrice ? (
                <>
                  <div className="price-group">
                    <span className="original-price">₹{product.originalPrice}</span>
                    <span className="selling-price">₹{product.sellingPrice}</span>
                    {discount > 0 && <span className="discount-savings">Save {discount}%</span>}
                  </div>
                </>
              ) : (
                <span className="selling-price">₹{product.price || product.sellingPrice}</span>
              )}
            </div>

            <div className="action-buttons">
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                {isInCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            <div className="shipping-info">
              <div className="info-item">
                <span className="icon">🚚</span>
                <div><strong>Free Shipping</strong><p>On orders above ₹500</p></div>
              </div>
              <div className="info-item">
                <span className="icon">↩️</span>
                <div><strong>Easy Returns</strong><p>15-day return policy</p></div>
              </div>
              <div className="info-item">
                <span className="icon">🛡️</span>
                <div><strong>Secure Payment</strong><p>Safe & encrypted</p></div>
              </div>
            </div>
          </main>
        </div>

        <div className="messaging-section">
          <div className="seller-info">
            <h3>Seller Information</h3>
            <div className="seller-details">
              <p><strong>Seller:</strong> {product.seller?.firstName || 'Unknown'}</p>
              {product.sellerRating > 0 && (
                <div className="seller-rating">
                  <strong>Seller Rating:</strong>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.sellerRating) ? 'star filled' : 'star'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {product.sellerRating.toFixed(1)}/5 ({product.sellerTotalReviews} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          <h3>Contact Seller</h3>
          <p>Have questions about this product? Send a message to the seller.</p>
          <form className="message-form" onSubmit={handleSendMessage}>
            <textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              required
            />
            <button type="submit" className="btn-send-message">Send Message</button>
          </form>
          {messageSent && <p className="message-success">Message sent successfully!</p>}
        </div>

        <div className="product-details-tabs">
          <div className="tabs-header">
            <button className={expandedDetails === 'description' ? 'active' : ''} onClick={() => setExpandedDetails('description')}>
              Description
            </button>
            <button className={expandedDetails === 'details' ? 'active' : ''} onClick={() => setExpandedDetails('details')}>
              Details
            </button>
            <button className={expandedDetails === 'reviews' ? 'active' : ''} onClick={() => setExpandedDetails('reviews')}>
              Reviews
            </button>
          </div>

          <div className="tabs-content">
            {expandedDetails === 'description' && (
              <div className="tab-pane">
                <p>{product.description || 'Premium quality product carefully selected for you. Enjoy excellent performance and durability.'}</p>
              <p style={{ fontSize: "1rem", color: "#666", margin: "0 0 10px 0", flex: 1, lineHeight: "2" }}>
                    {product.shortDescription}
                  </p>
              </div>
            )}
            {expandedDetails === 'details' && (
              <div className="tab-pane">
                <ul>
                  <li><strong>Category:</strong> {product.category}</li>
                  <li><strong>SKU:</strong> {product._id}</li>
                  <li><strong>Availability:</strong> In Stock</li>
                  <li><strong>Shipping Weight:</strong> 0.5 kg</li>
                  <li><strong>Dimensions:</strong> 20x15x5 cm</li>
                </ul>
              </div>
            )}
            {expandedDetails === 'reviews' && (
              <div className="tab-pane">
                <div className="reviews-section">
                  <div className="reviews-header">
                    <h4>Customer Reviews</h4>
                    <div className="rating-summary">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(getAverageRating(id)) ? 'star filled' : 'star'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-text">
                        {averageRating > 0 ? `${averageRating.toFixed(1)}/5 (${reviews.length} reviews)` : 'No ratings yet'}
                      </span>
                    </div>
                  </div>

                  {user && (
                    <div className="review-form">
                      <h5>Write a Review</h5>
                      <form onSubmit={handleSubmitReview}>
                        <div className="rating-input">
                          <label>Rating:</label>
                          <div className="stars-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={star <= reviewRating ? 'star filled' : 'star'}
                                onClick={() => setReviewRating(star)}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <textarea
                          placeholder="Share your experience with this product..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        />
                        <button type="submit" className="btn-submit-review">Submit Review</button>
                      </form>
                      {reviewSubmitted && <p className="review-success">Review submitted successfully!</p>}
                    </div>
                  )}

                  <div className="reviews-list">
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <div key={index} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <span className="reviewer-name">{review.userName}</span>
                              <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <p className="review-text">{review.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-page {
          background: linear-gradient(135deg, #f7f8ff 0%, #f0e6ff 100%);
          padding: 40px 0 60px;
          min-height: 100vh;
        }

        .breadcrumb button {
          background: transparent;
          border: none;
          color: #6367ff;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s ease;
          padding: 0;
        }

        .breadcrumb button:hover {
          opacity: 0.7;
        }

        .product-detail-container {
          padding: 40px;
          text-align: center;
        }

        .loading, .not-found {
          background: white;
          padding: 60px 20px;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(99,103,255,0.12);
        }

        .not-found button {
          margin-top: 20px;
          padding: 12px 28px;
          background: #6367ff;
          color: white;
          border: none;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .not-found button:hover {
          background: #8494ff;
        }

        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 60px;
          align-items: start;
        }

        .product-image-section {
          position: sticky;
          top: 20px;
        }

        .product-image-container {
          background: white;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 22px 50px rgba(99,103,255,0.12);
          position: relative;
        }

        .product-image-container img {
          width: 100%;
          height: auto;
          border-radius: 20px;
          object-fit: contain;
        }

        .discount-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 10px 18px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: 0 12px 30px rgba(239,68,68,0.3);
        }

        .product-info-section {
          background: white;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 22px 50px rgba(99,103,255,0.12);
        }

        .product-header h1 {
          font-size: 2.2rem;
          margin-bottom: 8px;
          color: #111827;
        }

        .category {
          color: #6367ff;
          font-weight: 700;
          text-transform: capitalize;
        }

        .price-section {
          margin: 24px 0 32px;
          padding: 24px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .price-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .original-price {
          font-size: 1.3rem;
          color: #999;
          text-decoration: line-through;
        }

        .selling-price {
          font-size: 2.2rem;
          font-weight: 800;
          color: #6367ff;
        }

        .discount-savings {
          background: #dcfce7;
          color: #15803d;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .quantity-section {
          margin: 32px 0;
        }

        .quantity-section label {
          display: block;
          font-weight: 700;
          margin-bottom: 12px;
          color: #111827;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          width: fit-content;
        }

        .quantity-control button {
          background: transparent;
          border: none;
          padding: 10px 16px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .quantity-control button:hover {
          background: #f3f1ff;
        }

        .quantity-control input {
          width: 60px;
          border: none;
          text-align: center;
          font-weight: 700;
          font-size: 1rem;
          outline: none;
        }

        .stock-info {
          margin-top: 8px;
          color: #15803d;
          font-weight: 600;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 12px;
          margin: 32px 0;
        }

        .btn-add-to-cart {
          background: #6367ff;
          color: white;
          border: none;
          padding: 16px 28px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(99,103,255,0.25);
        }

        .btn-add-to-cart:hover {
          background: #8494ff;
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(99,103,255,0.35);
        }

        .btn-wishlist {
          background: white;
          color: #6367ff;
          border: 2px solid #6367ff;
          padding: 16px 28px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .btn-wishlist:hover {
          background: #f3f1ff;
        }

        .shipping-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          padding: 24px 0;
          border-top: 1px solid #e5e7eb;
        }

        .info-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .info-item .icon {
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .info-item strong {
          display: block;
          color: #111827;
          margin-bottom: 4px;
        }

        .info-item p {
          color: #6b7280;
          font-size: 0.65rem;
          line-height: 1.3;
        }

        .product-details-tabs {
          background: white;
          border-radius: 24px;
          box-shadow: 0 22px 50px rgba(99,103,255,0.12);
          overflow: hidden;
        }

        .tabs-header {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
        }

        .tabs-header button {
          flex: 1;
          padding: 20px 24px;
          background: transparent;
          border: none;
          font-weight: 700;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tabs-header button.active {
          color: #6367ff;
        }

        .tabs-header button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: #6367ff;
        }

        .tabs-content {
          padding: 40px;
        }

        .tab-pane {
          color: #4b5563;
          line-height: 1.8;
        }

        .tab-pane p {
          margin: 0;
        }

        .tab-pane ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tab-pane li {
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .tab-pane li:last-child {
          border-bottom: none;
        }

        @media (max-width: 992px) {
          .product-detail-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .product-image-section {
            position: static;
          }

          .product-header h1 {
            font-size: 1.8rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .shipping-info {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 576px) {
          .product-info-section {
            padding: 24px;
          }

          .product-image-container {
            padding: 20px;
          }

          .product-header h1 {
            font-size: 1.5rem;
          }

          .selling-price {
            font-size: 1.8rem;
          }

          .tabs-header {
            flex-wrap: wrap;
            gap: 0;
          }

          .tabs-header button {
            flex: 0 1 33.333%;
            padding: 16px 12px;
            font-size: 0.9rem;
          }

          .tabs-content {
            padding: 24px;
          }

          .shipping-info {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .info-item small {
            display: block;
            font-size: 0.7rem;
          }
        }

        .messaging-section {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin: 40px 0;
          box-shadow: 0 22px 50px rgba(99,103,255,0.12);
        }

        .seller-info {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .seller-details {
          margin-top: 16px;
        }

        .seller-details p {
          margin: 8px 0;
          color: #4b5563;
        }

        .seller-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .seller-rating .stars {
          display: flex;
          gap: 2px;
        }

        .seller-rating .star {
          color: #ddd;
          font-size: 0.9rem;
        }

        .seller-rating .star.filled {
          color: #fbbf24;
        }

        .seller-rating .rating-text {
          font-size: 0.85rem;
          color: #666;
          font-weight: 600;
        }

        .messaging-section h3 {
          margin-bottom: 8px;
          color: #111827;
        }

        .messaging-section p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .message-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-form textarea {
          width: 100%;
          min-height: 120px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          font-family: inherit;
          font-size: 1rem;
          resize: vertical;
          transition: border-color 0.2s ease;
        }

        .message-form textarea:focus {
          outline: none;
          border-color: #6367ff;
        }

        .btn-send-message {
          background: #6367ff;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
          align-self: flex-start;
        }

        .btn-send-message:hover {
          background: #8494ff;
        }

        .message-success {
          color: #15803d;
          font-weight: 600;
          margin-top: 12px;
        }

        .reviews-section {
          max-width: none;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .reviews-header h4 {
          margin: 0;
          color: #111827;
          font-size: 1.3rem;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rating-summary .stars {
          display: flex;
          gap: 2px;
        }

        .rating-summary .star {
          color: #ddd;
          font-size: 1.1rem;
        }

        .rating-summary .star.filled {
          color: #fbbf24;
        }

        .rating-summary .rating-text {
          font-weight: 600;
          color: #4b5563;
        }

        .review-form {
          background: #f8fafc;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 32px;
        }

        .review-form h5 {
          margin-bottom: 16px;
          color: #111827;
        }

        .rating-input {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .rating-input label {
          font-weight: 600;
          color: #374151;
        }

        .stars-input {
          display: flex;
          gap: 4px;
          cursor: pointer;
        }

        .stars-input .star {
          color: #ddd;
          font-size: 1.2rem;
          transition: color 0.2s ease;
        }

        .stars-input .star.filled {
          color: #fbbf24;
        }

        .review-form textarea {
          width: 100%;
          min-height: 100px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          resize: vertical;
          margin-bottom: 16px;
          transition: border-color 0.2s ease;
        }

        .review-form textarea:focus {
          outline: none;
          border-color: #6367ff;
        }

        .btn-submit-review {
          background: #6367ff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-submit-review:hover {
          background: #8494ff;
        }

        .review-success {
          color: #15803d;
          font-weight: 600;
          margin-top: 12px;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .review-item {
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reviewer-name {
          font-weight: 600;
          color: #111827;
        }

        .review-rating {
          display: flex;
          gap: 2px;
        }

        .review-rating .star {
          color: #ddd;
          font-size: 0.9rem;
        }

        .review-rating .star.filled {
          color: #fbbf24;
        }

        .review-date {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .review-text {
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }

        .no-reviews {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 40px 20px;
        }
      `}</style>
    </section>
  );
}

export default ProductDetail;
