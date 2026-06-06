import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Phone } from 'lucide-react';
import AddSupplierForm from '../components/AddSupplierForm';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:8000/suppliers/');
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await fetch(`http://localhost:8000/suppliers/${id}`, { method: 'DELETE' });
        fetchSuppliers();
      } catch(err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading suppliers...</div>
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <p>No suppliers found. Add your first supplier.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.contact_person}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} style={{ color: 'var(--text-secondary)' }} />
                      {s.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} style={{ color: 'var(--text-secondary)' }} />
                      {s.phone}
                    </div>
                  </td>
                  <td>{s.city}, {s.country}</td>
                  <td>
                    <button className="btn-icon" onClick={() => handleDelete(s.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddSupplierForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data) => {
          try {
            const res = await fetch('http://localhost:8000/suppliers/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            if (res.ok) {
              fetchSuppliers();
              setShowAddModal(false);
            } else {
              const err = await res.json();
              alert(`Error: ${err.detail || 'Could not add supplier'}`);
            }
          } catch (error) {
            console.error("Failed to add supplier", error);
          }
        }}
      />
    </div>
  );
}

