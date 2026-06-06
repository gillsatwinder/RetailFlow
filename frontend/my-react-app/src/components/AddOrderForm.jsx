import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from './Modal';
import './FormStyles.css';

export default function AddOrderForm({ isOpen, onClose, onSubmit }) {
  const [buyers, setBuyers] = useState([]);
  const [products, setProducts] = useState([]);
  const [buyerId, setBuyerId] = useState('');
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch buyers and products on open
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          const [buyersRes, productsRes] = await Promise.all([
            fetch('http://localhost:8000/buyers/'),
            fetch('http://localhost:8000/products/'),
          ]);
          const buyersData = await buyersRes.json();
          const productsData = await productsRes.json();
          setBuyers(buyersData);
          setProducts(productsData);
        } catch (err) {
          console.error("Failed to load buyers/products", err);
          setError("Failed to load buyers and products. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ product_id: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const getProductDetails = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  // Calculate total amount
  const orderTotal = items.reduce((sum, item) => {
    const product = getProductDetails(item.product_id);
    if (product) {
      return sum + (product.selling_price * (parseInt(item.quantity) || 0));
    }
    return sum;
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!buyerId) {
      setError('Please select a customer/buyer.');
      return;
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product_id) {
        setError(`Please select a product for line ${i + 1}.`);
        return;
      }
      const product = getProductDetails(item.product_id);
      const qty = parseInt(item.quantity);
      if (!qty || qty <= 0) {
        setError(`Quantity must be greater than 0 on line ${i + 1}.`);
        return;
      }
      if (product && product.quantity < qty) {
        setError(`Insufficient stock for '${product.name}' on line ${i + 1}. Available: ${product.quantity}, Requested: ${qty}`);
        return;
      }
    }

    // Map payload
    const payload = {
      buyer_id: parseInt(buyerId),
      status: status,
      items: items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity),
      })),
    };

    onSubmit(payload);
    // Reset state
    setBuyerId('');
    setStatus('pending');
    setItems([{ product_id: '', quantity: 1 }]);
    onClose();
  };

  const handleCancel = () => {
    setBuyerId('');
    setStatus('pending');
    setItems([{ product_id: '', quantity: 1 }]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Create New Sales Order">
      {loading ? (
        <div className="loading-state">Loading products and buyers...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer / Buyer</label>
              <select
                className="form-input"
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                required
              >
                <option value="">Select Buyer</option>
                {buyers.map(b => (
                  <option key={b.id} value={b.id}>{b.shop_name} ({b.name})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Order Items</label>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleAddItem}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '13px' }}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {items.map((item, index) => {
              const product = getProductDetails(item.product_id);
              const subtotal = product ? product.selling_price * (parseInt(item.quantity) || 0) : 0;

              return (
                <div key={index} className="form-row" style={{ alignItems: 'flex-end', marginBottom: '12px', gap: '10px' }}>
                  <div className="form-group" style={{ flex: 3, marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Product</label>
                    <select
                      className="form-input"
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                          {p.name} (${p.selling_price.toFixed(2)} - {p.quantity} left)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Qty</label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1.2, marginBottom: 0, textAlign: 'right' }}>
                    <label className="form-label" style={{ fontSize: '12px', display: 'block' }}>Subtotal</label>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-block', padding: '10px 0' }}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div style={{ flex: 0.5, display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => handleRemoveItem(index)}
                      style={{ padding: '10px', color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Amount: </span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-blue)', marginLeft: '8px' }}>
                ${orderTotal.toFixed(2)}
              </span>
            </div>
            <div className="form-actions" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Order
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
