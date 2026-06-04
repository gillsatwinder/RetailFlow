import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Phone, Store } from 'lucide-react';
import AddBuyerForm from '../components/AddBuyerForm';

export default function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchBuyers = async () => {
    try {
      const res = await fetch('http://localhost:8000/buyers/');
      const data = await res.json();
      setBuyers(data);
    } catch (error) {
      console.error("Failed to fetch buyers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this buyer?')) {
      try {
        await fetch(`http://localhost:8000/buyers/${id}`, { method: 'DELETE' });
        fetchBuyers();
      } catch(err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Buyers</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Buyer
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading buyers...</div>
        ) : buyers.length === 0 ? (
          <div className="empty-state">
            <p>No buyers found. Add your first buyer.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Contact</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Store size={16} style={{ color: 'var(--accent-blue)' }} />
                      <span className="font-medium">{b.shop_name}</span>
                    </div>
                  </td>
                  <td>{b.name}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <Mail size={12} style={{ color: 'var(--text-secondary)' }} />
                        {b.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <Phone size={12} style={{ color: 'var(--text-secondary)' }} />
                        {b.phone}
                      </div>
                    </div>
                  </td>
                  <td>{b.city}, {b.country}</td>
                  <td>
                    <span className={`badge ${b.account_status === 'active' ? 'active' : 'warning'}`}>
                      {b.account_status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => handleDelete(b.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddBuyerForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(data) => {
          console.log('New buyer:', data);
          setShowAddModal(false);
        }}
      />
    </div>
  );
}
