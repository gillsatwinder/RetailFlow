import React, { useState } from 'react';
import Modal from './Modal';
import './FormStyles.css';

const initialState = {
  name: '',
  sku: '',
  category: '',
  supplier: '',
  quantity: '',
  reorder_threshold: '',
  cost_price: '',
  selling_price: '',
};

export default function AddProductForm({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(initialState);
    onClose();
  };

  const handleCancel = () => {
    setForm(initialState);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add New Product">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">SKU</label>
            <input
              type="text"
              name="sku"
              className="form-input"
              placeholder="e.g. SKU-001"
              value={form.sku}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-input"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Supplier</label>
          <input
            type="text"
            name="supplier"
            className="form-input"
            placeholder="Supplier name"
            value={form.supplier}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              className="form-input"
              placeholder="0"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Reorder Threshold</label>
            <input
              type="number"
              name="reorder_threshold"
              className="form-input"
              placeholder="0"
              value={form.reorder_threshold}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Cost Price</label>
            <input
              type="number"
              name="cost_price"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              value={form.cost_price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Selling Price</label>
            <input
              type="number"
              name="selling_price"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              value={form.selling_price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Product
          </button>
        </div>
      </form>
    </Modal>
  );
}
