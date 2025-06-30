// src/Pages/Home.jsx
import React, { useState, useEffect } from "react";
import ProductCard from '../Components/ProductCard';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');

        fetch('http://localhost:5555/products') 
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.message || 'Failed to fetch products.');
                    });
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
            })
            .catch(err => {
                setError(err.message);
                console.error("Error fetching products:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;

    return (
        <div className="home-wrapper">
            <div className="hero">
                <div className="hero-text">
                    <h1>Welcome to CartZone</h1>
                    <p>Your one-stop shop for everything you love. Affordable, reliable, and stylish.</p>
                    <button className="hero-btn">Shop Now</button>
                </div>
            </div>

            <div className="features">
                <h2>Why Shop With Us?</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>Fast Delivery</h3>
                        <p>We deliver your orders quickly and on time.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Trusted Products</h3>
                        <p>All our items are verified and high quality.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Affordable Prices</h3>
                        <p>Shop top products at competitive prices.</p>
                    </div>
                </div>
            </div>

            <div className="products-section">
                <h2 className="section-title">Our Products</h2>
                {products.length === 0 ? (
                    <p>No products available at the moment.</p>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;