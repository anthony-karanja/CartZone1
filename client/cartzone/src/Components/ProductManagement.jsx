import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "./Auth";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function AdminProductManagement() {
  const { user, token, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const API_BASE_URL = "http://localhost:5555";

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');

    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Failed to fetch products');
          });
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        setError(err.message || 'An unexpected error occurred.');
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (user && user.role === 'admin' && token) {
      fetchProducts();
    } else if (!user || user.role !== 'admin') {
      setError('You must be logged in as an admin to view this page.');
      setLoading(false);
    } else if (user && user.role === 'admin' && !token) {
      setError('Authentication token missing. Please log in again.');
      setLoading(false);
      logout();
    }
  }, [user, token, logout, fetchProducts]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStockQuantity('');
    setImageUrl('');
    setFormMessage('');
    setEditingProduct(null);
  };

  const handleAddEditSubmit = (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!name.trim() || !description.trim() || !price || !stockQuantity || !imageUrl.trim()) {
      setFormMessage('Please fill in all fields.');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stockQuantity, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormMessage('Price must be a valid positive number.');
      return;
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      setFormMessage('Stock quantity must be a valid non-negative number.');
      return;
    }

    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
    if (!urlRegex.test(imageUrl.trim())) {
      setFormMessage('Image URL must be a valid URL.');
      return;
    }

    if (!token) {
      setFormMessage('Authentication token is missing. Please log in.');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      stock_quantity: parsedStock,
      image_url: imageUrl.trim(),
    };

    console.log("Submitting product payload:", payload);

    const method = editingProduct ? 'PATCH' : 'POST';
    const url = editingProduct ? `${API_BASE_URL}/products/${editingProduct.id}` : `${API_BASE_URL}/products`;

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || 'Failed to submit');
          });
        }
        return response.json();
      })
      .then(() => {
        setFormMessage(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
        fetchProducts();
        resetForm();
        setShowAddForm(false);
      })
      .catch(err => {
        setFormMessage(err.message || 'An unexpected error occurred.');
        console.error("Error adding/editing product:", err);
      });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStockQuantity(product.stock_quantity);
    setImageUrl(product.image_url);
    setShowAddForm(true);
  };

  const handleDeleteClick = (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    setError('');
    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
    }

    fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || 'Failed to delete product');
          });
        }
        return response.json();
      })
      .then(data => {
        alert(data.message || 'Product deleted successfully!');
        fetchProducts();
      })
      .catch(err => {
        setError(err.message || 'An unexpected error occurred.');
        console.error("Error deleting product:", err);
      });
  };

  if (loading) return <p className="text-center mt-5">Loading admin panel...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!user || user.role !== 'admin') return <p className="text-danger text-center mt-5">Access Denied. Admins only.</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Product Management</h2>

      <button
        className={`btn ${showAddForm ? 'btn-danger' : 'btn-primary'} mb-4`}
        onClick={() => { setShowAddForm(!showAddForm); resetForm(); }}
      >
        {showAddForm ? 'Cancel Add/Edit' : 'Add New Product'}
      </button>

      {showAddForm && (
        <div className="card p-4 mb-4">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleAddEditSubmit}>
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                className="form-control"
                placeholder="Stock Quantity"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {formMessage && <p className="text-success mt-3">{formMessage}</p>}
          </form>
        </div>
      )}

      <hr />

      <h3>Current Products</h3>
      <div className="row">
        {products.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card">
                <img src={product.image_url} alt={product.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{product.name} (KES {product.price.toLocaleString()})</h5>
                  <p className="card-text">Stock: {product.stock_quantity}</p>
                  <p className="card-text">{product.description.substring(0, 70)}...</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminProductManagement;