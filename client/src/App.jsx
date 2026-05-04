import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home';
import Layout from "./components/Layout";
import {Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CartPage from './pages/CartPage';
import Sell from './pages/Sell';
import MyProducts from './pages/MyProducts';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Messages from './pages/Messages';
import OrderHistory from './pages/OrderHistory';
import Checkout from './pages/Checkout';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import ProductPage from './pages/ProductPage';
import EditProduct from './pages/EditProduct';
import Admin from './pages/Admin';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        <Route path="profile" element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        } />
        <Route path="cart" element={
          <RequireAuth>
            <CartPage />
          </RequireAuth>
        } />
        <Route path="checkout" element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        } />
        <Route path="sell" element={
          <RequireAuth>
            <Sell />
          </RequireAuth>
        } />
        <Route path="myproducts" element={
          <RequireAuth>
            <MyProducts />
          </RequireAuth>
        } />
         <Route path="products" element={
          <RequireAuth>
            <ProductPage />
          </RequireAuth>
        } />
        <Route path="contact" element={<Contact />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="messages" element={
          <RequireAuth>
            <Messages />
          </RequireAuth>
        } />
        <Route path="orderhistory" element={
          <RequireAuth>
            <OrderHistory />
          </RequireAuth>
        } />
        <Route path="edit-product/:id" element={
          <RequireAuth>
            <EditProduct />
          </RequireAuth>
        } />
        <Route path="admin" element={
          <RequireAuth>
            <Admin />
          </RequireAuth>
        } />
      </Route>
     
      

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
