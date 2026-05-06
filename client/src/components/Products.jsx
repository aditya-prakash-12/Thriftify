import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const { user, addToCart, cart } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://thriftify-j4ll.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
        // Initialize quantity selector for each product
        const quantities = {};
        data.forEach(p => quantities[p._id] = 1);
        setSelectedQuantity(quantities);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
    alert("Product added to cart!");
  };

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  const isInCart = (id) => cart.some((item) => item._id === id);
  const cartCount = cart.length;

  return (
    <section style={{ background: "#FFDBFD", padding: "60px 20px" }}>
      <div className="container">
        {/* Header with Cart Counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h2 style={{ textAlign: "left", color: "#6367FF", marginBottom: "10px", fontSize: "2.5rem", fontWeight: "bold" }}>
              Shop Products
            </h2>
            <p style={{ textAlign: "left", color: "#999", marginBottom: "0" }}>
              {loading ? "Loading..." : `${products.length} products available`}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            style={{
              padding: "12px 24px",
              backgroundColor: cartCount > 0 ? "#6367FF" : "#ddd",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: cartCount > 0 ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1rem"
            }}
            disabled={cartCount === 0}
          >
            🛒 Cart ({cartCount})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>No products available</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {products.map(product => (
              <div
                key={product._id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  border: isInCart(product._id) ? "2px solid #4CAF50" : "none"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(99,103,255,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                {/* Product Image */}
                <div style={{ height: "220px", overflow: "hidden", background: "#f9f9f9", position: "relative" }}>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "15px",
                      transition: "transform 0.3s"
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  {isInCart(product._id) && (
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#4CAF50",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      ✓ In Cart
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.05rem", margin: "0 0 8px 0", color: "#333", fontWeight: "700", lineHeight: "1.3" }}>
                    {product.title}
                  </h3>
                  
                 

                  {/* Price Section */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#6367FF" }}>
                      ₹{product.sellingPrice}
                    </span>
                    {product.originalPrice && (
                      <span style={{
                        fontSize: "0.95rem",
                        textDecoration: "line-through",
                        color: "#999",
                        fontWeight: "500"
                      }}>
                        ₹{product.originalPrice}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span style={{
                        fontSize: "0.85rem",
                        background: "#FFE8E8",
                        color: "#D32F2F",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: "600"
                      }}>
                        {Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  {product.category && (
                    <div style={{ marginBottom: "10px" }}>
                      <span style={{
                        display: "inline-block",
                        background: "#F0F0FF",
                        color: "#6367FF",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textTransform: "capitalize"
                      }}>
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Quantity Selector */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#666" }}>Qty:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={selectedQuantity[product._id] || 1}
                      onChange={(e) => setSelectedQuantity({...selectedQuantity, [product._id]: parseInt(e.target.value) || 1})}
                      style={{
                        width: "50px",
                        padding: "6px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        textAlign: "center",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleViewProduct(product._id)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "2px solid #6367FF",
                        background: "white",
                        color: "#6367FF",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontSize: "0.95rem"
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = "#F0F0FF";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = "white";
                      }}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "none",
                        background: isInCart(product._id) ? "#4CAF50" : "#6367FF",
                        color: "white",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontSize: "0.95rem"
                      }}
                      onMouseEnter={e => {
                        if (!isInCart(product._id)) {
                          e.target.style.background = "#8494FF";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isInCart(product._id)) {
                          e.target.style.background = "#6367FF";
                        }
                      }}
                    >
                      {isInCart(product._id) ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </section>
  );
}

export default Products;
