import React from 'react';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';
import './Orders.css';

const MOCK_ORDERS = [
  { id: 1, buyer_name: 'TechMart Electronics', order_date: '2026-05-28', status: 'completed', items_count: 3, total_amount: 2450.00 },
  { id: 2, buyer_name: 'GreenLeaf Grocers', order_date: '2026-05-30', status: 'completed', items_count: 5, total_amount: 1890.50 },
  { id: 3, buyer_name: 'StyleHub Fashion', order_date: '2026-06-01', status: 'pending', items_count: 2, total_amount: 3200.00 },
  { id: 4, buyer_name: 'HomeBase Supplies', order_date: '2026-06-01', status: 'pending', items_count: 4, total_amount: 980.75 },
  { id: 5, buyer_name: 'SportZone Outlet', order_date: '2026-06-02', status: 'cancelled', items_count: 1, total_amount: 540.00 },
  { id: 6, buyer_name: 'TechMart Electronics', order_date: '2026-06-02', status: 'pending', items_count: 6, total_amount: 4100.25 },
];

function formatOrderId(id) {
  return `#ORD-${String(id).padStart(3, '0')}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
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
  const orders = MOCK_ORDERS;
  const loading = false;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      console.log('Delete order:', id);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button className="btn-primary">
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
    </div>
  );
}
