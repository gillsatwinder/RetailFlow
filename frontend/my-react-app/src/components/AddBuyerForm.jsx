import React, { useState } from 'react';
import Modal from './Modal';
import './FormStyles.css';

const initialState = {
  name: '',
  shop_name: '',
  contact_person: '',
  email: '',
  phone: '',
  credit_limit: '',
  address: '',
  city: '',
  country: '',
};

export default function AddBuyerForm({ isOpen, onClose, onSubmit }) {
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
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add New Buyer">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Buyer Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Shop Name</label>
            <input
              type="text"
              name="shop_name"
              className="form-input"
              placeholder="Shop or business name"
              value={form.shop_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Contact Person</label>
            <input
              type="text"
              name="contact_person"
              className="form-input"
              placeholder="Contact person"
              value={form.contact_person}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Credit Limit</label>
            <input
              type="number"
              name="credit_limit"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              value={form.credit_limit}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className="form-input"
            placeholder="Street address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              className="form-input"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              name="country"
              className="form-input"
              placeholder="Country"
              value={form.country}
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
            Add Buyer
          </button>
        </div>
      </form>
    </Modal>
  );
}
