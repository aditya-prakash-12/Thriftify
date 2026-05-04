import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored authentication on app initialization
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await fetch('https://thriftify-j4ll.onrender.com/api/user/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          // Don't clear storage on network errors - keep user logged in
          // Only clear if there's an actual 401 from server
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Load messages when user logs in
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:4000/api/messages/user/${user._id}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const login = (userData, token, callback) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (callback) callback();
  };

  const logout = (callback) => {
    setUser(null);
    setCart([]);
    setMessages([]);
    setReviews({});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (callback) callback();
    else navigate("/");
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const addToCart = (product) => {
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        // Since each product has only 1 quantity, don't increase quantity
        return prev; // Item already in cart, don't add again
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const sendMessage = async (productId, message, receiverId) => {
    if (!user || !receiverId) return;

    try {
      const response = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: user._id,
          receiverId,
          productId,
          message,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [newMessage, ...prev]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const addReview = async (productId, rating, reviewText) => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:4000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
          rating,
          reviewText,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prev) => ({
          ...prev,
          [productId]: [...(prev[productId] || []), newReview],
        }));
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const getProductReviews = async (productId) => {
    if (reviews[productId]) {
      return reviews[productId];
    }

    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}`);
      const data = await response.json();
      setReviews((prev) => ({
        ...prev,
        [productId]: data,
      }));
      return data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  const getAverageRating = async (productId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${productId}/average`);
      const data = await response.json();
      return data.averageRating || 0;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return 0;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        messages,
        sendMessage,
        reviews,
        addReview,
        getProductReviews,
        getAverageRating,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
