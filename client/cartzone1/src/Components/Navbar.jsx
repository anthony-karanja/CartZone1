import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "./Auth"; 

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">CartZone</Link> 
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Shop</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        {user ? (
          <>
            <li><Link to="/orders">My Orders</Link></li>
            {user.role === 'admin' && (
              <li><Link to="/adminproducts">Admin Products</Link></li>
            )}
            <li>
              <button onClick={onLogoutClick} >
                Logout ({user.role}) 
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;