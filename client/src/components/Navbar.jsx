import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/Navbar.css";

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout, messages } = useAuth();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      // remember where we wanted to go
      navigate("/login", { state: { from: path } });
    }
  };

  const handleLogout = () => {
    logout(() => navigate("/"));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="navbar-wrapper">

      {/* TOP HEADER */}
      <div className="top-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">

          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="logo" />
          </Link>

          {/* Searc
              type="text" 
              placeholder="Search for more than 20,000 products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <button onClick={handleSearch}sName="search-container">
            <select>
              <option>All Categories</option>
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
            <input type="text" placeholder="Search for more than 20,000 products" />
            <button>🔍</button>
          </div>

          {/* Right Section */}
          <div className="right-section d-flex align-items-center gap-4">

  {/* support number removed per request */}

  <div className="profile-wrapper">
            {/* show login/signup when not authenticated */}
            {!user ? (
              <div className="auth-links">
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-indigo-500 font-semibold mr-2">Hi, {user.firstName}</span>
                <div className="profile-wrapper" ref={dropdownRef}>
                  <button
                    className="profile-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    👤
                  </button>

                  {profileOpen && (
                    <div className="profile-dropdown">
                      <Link to="/dashboard">View Dashboard</Link>
                      <Link to="/profile">Edit Profile</Link>
                      <button onClick={handleLogout} className="logout-btn">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
            
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="bottom-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">

          <ul className="nav-tabs d-flex gap-28">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop Now</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/">About</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/messages">Messages</Link></li>
          </ul>

          {/* Cart */}
          {/* RIGHT SIDE BUTTONS */}
<div className="d-flex align-items-center">
  
  <Link
    to="/sell"
    className="sell-btn"
    onClick={(e) => handleProtectedClick(e, "/sell")}
  >
    + Sell
  </Link>

  <Link
    to="/cart"
    className="cart-btn"
    onClick={(e) => handleProtectedClick(e, "/cart")}
  >
    🛒 View Cart
    {/* badge removed until dynamic count is implemented */}
  </Link>

  <Link
    to="/orderhistory"
    className="cart-btn ml-3"
    onClick={(e) => handleProtectedClick(e, "/orderhistory")}
  >
    📋 Order History
    {/* badge removed until dynamic count is implemented */}
  </Link>

</div>

        </div>
      </div>

    </header>
  );
}

export default Navbar;