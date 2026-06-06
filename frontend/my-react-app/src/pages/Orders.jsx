import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AddOrderForm from '../components/AddOrderForm';
import './Orders.css';

function formatOrderId(id) {
  return `#ORD-${String(id).padStart(3, '0')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'completed': return 'badge active';
    case 'cancelled': return 'badge warning';
    case 'pending': return 'badge pending';
    default: return 'badge';
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/orders/');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? (This will restore item stock levels)')) {
      try {
        const res = await fetch(`http://localhost:8000/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchOrders();
        } else {
          const errData = await res.json();
          alert(`Failed to delete order: ${errData.detail || 'Unknown error'}`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      const res = await fetch('http://localhost:8000/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        fetchOrders();
        setShowAddModal(false);
      } else {
        const errData = await res.json();
        alert(`Failed to create order: ${errData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Failed to create order", err);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Order
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found. Create your first order.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium">{formatOrderId(order.id)}</td>
                  <td className="font-medium">{order.buyer_name}</td>
                  <td>{formatDate(order.order_date)}</td>
                  <td>{order.items_count} {order.items_count === 1 ? 'item' : 'items'}</td>
                  <td className="font-medium">{formatCurrency(order.total_amount)}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => handleDelete(order.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddOrderForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddOrder}
      />
    </div>
  );
}

