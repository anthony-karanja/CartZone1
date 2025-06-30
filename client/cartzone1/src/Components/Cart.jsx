// src/Components/Cart.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./Auth";

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token, user } = useContext(AuthContext);
  

  useEffect(() => {
    if (!token) {
      setItems([]);
      setLoading(false);
      setError("Please log in to view your cart.");
      console.log("Cart/Orders: No token available.")
      return;
    }
    console.log("Cart/Orders: Token present. Fetching data.")

    setLoading(true);
    setError('');

    fetch("http://localhost:5555/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Authentication required. Please log in.");
          } else if (res.status === 403) {
            throw new Error("Access denied to cart.");
          } else {
            return res.json().then(errData => { // Try to get more specific error from backend
                throw new Error(errData.message || `Failed to fetch cart: ${res.statusText}`);
            });
          }
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
          console.warn("Cart data is not an array:", data);
          setError("Failed to load cart items correctly.");
        }
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setError(error.message);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]); 

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (!token) {
      setError("Please log in to update your cart.");
      return;
    }
    setError('');

    fetch(`http://localhost:5555/cart/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((res) => {
          if (!res.ok) {
            return res.json().then(errData => {
                throw new Error(errData.message || "Failed to update quantity");
            });
          }
          return res.json();
      })
      .then((updatedItem) => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
      })
      .catch(error => {
        console.error("Error updating cart item:", error);
        setError(error.message);
      });
  };

  const handleRemoveFromCart = (itemId) => {
    if (!token) {
      setError("Please log in to remove items from your cart.");
      return;
    }
    setError('');

    fetch(`http://localhost:5555/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(errData => {
            throw new Error(errData.message || "Failed to remove item from cart");
        });
      }
      return res.json();
    })
    .then(() => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    })
    .catch(error => {
      console.error("Error removing cart item:", error);
      setError(error.message);
    });
  };

  const total = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0)
    : 0;

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div id="cart" className="cart">
      <h2 className="section-title">Your Cart</h2>
      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.product?.image_url} alt={item.product?.name} className="cart-img" />
              <div className="cart-details">
                <h3>{item.product?.name}</h3>
                <p>KES {(item.product?.price || 0).toLocaleString()}</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(item.id, parseInt(e.target.value))
                  }
                />
                <button onClick={() => handleRemoveFromCart(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3 className="cart-total">Total: KES {total.toLocaleString()}</h3>
        </div>
      )}
    </div>
  );
}

export default Cart;