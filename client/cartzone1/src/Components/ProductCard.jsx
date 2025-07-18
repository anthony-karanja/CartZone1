import React, { useContext } from 'react';
import { AuthContext } from './Auth';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductCard({ product }) {
  const { user, token } = useContext(AuthContext);

  const handleAddToCart = () => { 
    if (!user || !token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    fetch('http://localhost:5555/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      })
      .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Failed to add item to cart');
            });
          }
          return response.json();
      })
      .then(data => {
        console.log('Item added to cart:', data);
        alert('Item added to cart!');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <div className="card h-100 shadow-sm product-card">
  <img 
    src={product.image_url} 
    alt={product.name} 
    className="card-img-top"
  />
  <div className="card-body">
    <h5 className="card-title">{product.name}</h5>
    <p className="card-text">KES {product.price.toLocaleString()}</p>
    <div className="d-grid">
      {user ? (
        <button className="btn btn-success" onClick={handleAddToCart}>Add to Cart</button>
      ) : (
        <button className="btn btn-secondary" disabled title="Log in to add to cart">Add to Cart</button>
      )}
    </div>
  </div>
</div>
  );
}

export default ProductCard;