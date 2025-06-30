import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './Components/Auth';

import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import Cart from './Components/Cart';
import Orders from './Components/Orders';
import AdminProductManagement from './Components/ProductManagement';
import Checkout from './Components/Checkout';
import Navbar from './Components/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/adminproducts" element={<AdminProductManagement />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;