import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, getAverageRating, getProductReviews } = useAuth();
  const navigate = useNavigate();

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

    fetch("https://thriftify-j4ll.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Filter products by current user
        const userProducts = data.filter((item) =>
          matchesSeller(item.seller) || matchesSeller(item.sellerId)
        );
        setProducts(userProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <section className="my-products-page container py-5">
        <div className="text-center">
          <h1>Loading your products...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="my-products-page container py-5">
      <div className="products-header mb-4">
        <h1>My Products</h1>
        <p>Manage and view your listed items</p>
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
              <div className="product-card-seller" key={product._id}>
                <div className="product-image">
                  <img src={product.image || product.img} alt={product.title || product.name} />
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
                        {avgRating > 0 ? `${avgRating}/5 (${reviews} reviews)` : 'No ratings'}
                      </span>
                    </div>
                  </div>

                  <div className="actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewProduct(product._id)}
                    >
                      View Product
                    </button>
                    <button className="btn-edit">Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .my-products-page h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .products-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .empty-products {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .empty-products h3 {
          margin-bottom: 12px;
          color: #374151;
        }

        .empty-products p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .btn-add-product {
          background: #6367ff;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-add-product:hover {
          background: #8494ff;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .product-card-seller {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
          transition: transform 0.3s ease;
        }

        .product-card-seller:hover {
          transform: translateY(-4px);
        }

        .product-image {
          height: 200px;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          padding: 24px;
        }

        .product-info h3 {
          margin-bottom: 8px;
          color: #111827;
        }

        .category {
          color: #6367ff;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .pricing {
          margin-bottom: 16px;
        }

        .original-price {
          color: #999;
          text-decoration: line-through;
          margin-right: 12px;
        }

        .selling-price {
          color: #6367ff;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .stats {
          margin-bottom: 20px;
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
          font-size: 0.9rem;
        }

        .star.filled {
          color: #fbbf24;
        }

        .rating-text {
          font-size: 0.85rem;
          color: #666;
          font-weight: 600;
        }

        .actions {
          display: flex;
          gap: 12px;
        }

        .btn-view, .btn-edit {
          flex: 1;
          padding: 10px 16px;
          border-radius: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view {
          background: white;
          border: 2px solid #6367ff;
          color: #6367ff;
        }

        .btn-view:hover {
          background: #f3f1ff;
        }

        .btn-edit {
          background: #6367ff;
          border: 2px solid #6367ff;
          color: white;
        }

        .btn-edit:hover {
          background: #8494ff;
          border-color: #8494ff;
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}

export default MyProducts;
