// src/Components/Orders.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./Auth";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      setMessage("Please log in to view your orders.");
      setLoading(false);
      console.log("Cart/Orders: No token available."); 
      return;
    }
    console.log("Cart/Orders: Token present. Fetching data.")

    setMessage("");
    setLoading(true);

    fetch("http://localhost:5555/orders", {
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
          } else {
            return res.json().then(errData => {
                throw new Error(errData.message || `Failed to fetch orders: ${res.statusText}`);
            });
          }
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setMessage("");
      })
      .catch((err) => {
        setMessage(err.message || "Could not load your orders. Please try again.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="orders">
      <h2 className="section-title">My Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : message ? (
        <p className="orders-error">{message}</p>
      ) : orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div>
                <strong>Order ID:</strong> {order.id}
              </div>
              <div>
                <strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}
              </div>
              <div>
                <strong>Status:</strong> {order.status}
              </div>
              <div>
                <strong>Total:</strong> KES {order.total_amount.toLocaleString()}
              </div>
              <div className="ordered-items">
                {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item, index) => (
                        <div key={index}>
                            {item.product_name} x{item.quantity} (KES {item.price_at_purchase.toLocaleString()})
                        </div>
                    ))
                ) : (
                    <div>No items found for this order.</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;