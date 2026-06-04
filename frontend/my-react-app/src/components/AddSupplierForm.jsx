import React, { useState } from 'react';
import Modal from './Modal';
import './FormStyles.css';

const initialState = {
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  payment_terms: '',
};

export default function AddSupplierForm({ isOpen, onClose, onSubmit }) {
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
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add New Supplier">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Company name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Person</label>
            <input
              type="text"
              name="contact_person"
              className="form-input"
              placeholder="Full name"
              value={form.contact_person}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
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

        <div className="form-group">
          <label className="form-label">Payment Terms</label>
          <select
            name="payment_terms"
            className="form-input"
            value={form.payment_terms}
            onChange={handleChange}
            required
          >
            <option value="">Select payment terms</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
            <option value="Net 90">Net 90</option>
            <option value="COD">COD</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Supplier
          </button>
        </div>
      </form>
    </Modal>
  );
}
