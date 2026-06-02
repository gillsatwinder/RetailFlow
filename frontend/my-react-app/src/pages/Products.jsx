import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/products/');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`http://localhost:8000/products/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch(err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <button className="btn-primary">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Add your first product.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td className="font-medium">{p.name}</td>
                  <td><span className="badge">{p.sku}</span></td>
                  <td>{p.category}</td>
                  <td>${p.price?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.quantity <= p.reorder_threshold ? 'warning' : 'active'}`}>
                      {p.quantity} in stock
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
