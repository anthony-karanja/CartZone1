// src/Components/Checkout.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "./Auth";

function Checkout({ cartItems = [], onOrderSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useContext(AuthContext);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const handlePlaceOrder = () => { // No 'async' keyword here
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("You must be logged in to place an order.");
      setLoading(false);
      return;
    }

    const orderPayload = {
      total_amount: total,
      order_items: cartItems.map((item) => ({
        product_id: item.product_id, // This should be available from the backend cart item
        quantity: item.quantity,
        price_at_purchase: item.product?.price,
      })),
    };

    fetch("http://localhost:5555/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      })
      .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || "Failed to place order");
            });
          }
          return response.json();
      })
      .then(() => { // Assuming success doesn't return much
        setMessage("Order placed successfully!");
        onOrderSuccess?.();
      })
      .catch((error) => {
        console.error("Order error:", error);
        setMessage(error.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="checkout">
      <h2 className="section-title">Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty. Add items before checking out.</p>
      ) : (
        <div>
          <ul className="checkout-list">
            {cartItems.map((item) => (
              <li key={item.id} className="checkout-item">
                <span>{item.product?.name}</span>
                <span>x{item.quantity}</span>
                <span>
                  KES {((item.product?.price || 0) * (item.quantity || 0)).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="checkout-total">
            Total: KES {total.toLocaleString()}
          </h3>

          <button
            onClick={handlePlaceOrder}
            className="place-order-btn"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          {message && <p className="checkout-message">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default Checkout;