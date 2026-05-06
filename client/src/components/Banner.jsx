import React from "react";
import "../assets/css/Banner.css"; // adjust path if needed
import { Link } from "react-router-dom";

function Banner() {
  return (
    <section
      className="banner-section"
      style={{
        backgroundImage: 'url("/images/background-pattern.jpg")'
      }}
    >
      <div className="banner-grid">

        {/* Large Banner */}
        <div className="banner-large">
          <div className="banner-content">
            <span className="tag">Curated Pre-Owned Finds</span>
            <h2>Vintage & Designer Clothing Collections</h2>
            <p>
             Discover unique style with our curated collection of vintage and designer clothing. Shop sustainably and express your individuality with timeless pieces that tell a story.
            </p>
            <Link to="/products"> <button className="primary-btn">Shop Now</button> </Link>
          </div>

          <img
            src="/images/product-thumb-1.png"
            alt="Smoothie"
            className="banner-img-large"
          />
        </div>

        {/* Fruits Banner */}
        <div className="banner-small green">
          <div className="banner-content">
            <span className="sale">20% Off</span>
            <h4>Sustainable Fashion</h4>
            <Link to="/products">Shop Collection →</Link>
          </div>

          <img
            src="/images/ad-image-1.png"
            alt="Fruits"
            className="banner-img-small"
          />
        </div>

        {/* Baked Banner */}
        <div className="banner-small pink">
          <div className="banner-content">
            <span className="sale">15% Off</span>
            <h4>Leather Products</h4>
            <Link to="/products">Shop Collection →</Link>
          </div>

          <img
            src="/images/ad-image-2.png"
            alt="Bread"
            className="banner-img-small"
          />
        </div>

      </div>
    </section>
  );
}

export default Banner;