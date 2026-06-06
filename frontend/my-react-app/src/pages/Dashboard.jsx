import React, { useState, useEffect } from 'react';
import { Package, Users, ClipboardList, DollarSign, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import './Dashboard.css';

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{payload[0].value} units</p>
      </div>
    );
  }
  return null;
};

function getDaysBadgeClass(days) {
  if (days <= 2) return 'days-badge danger';
  if (days <= 5) return 'days-badge warning';
  return 'days-badge';
}

export default function Dashboard() {
  const [summary, setSummary] = useState({ products: 0, suppliers: 0, buyers: 0, orders: 0, revenue: 0, costs: 0 });
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, trendRes, topRes, lowRes] = await Promise.all([
        fetch('http://localhost:8000/analytics/summary'),
        fetch('http://localhost:8000/analytics/sales-trend'),
        fetch('http://localhost:8000/analytics/top-products'),
        fetch('http://localhost:8000/analytics/low-stock'),
      ]);

      const summaryData = await summaryRes.json();
      const trendData = await trendRes.json();
      const topData = await topRes.json();
      const lowData = await lowRes.json();

      setSummary(summaryData);
      setSalesTrend(trendData);
      setTopProducts(topData);
      setLowStock(lowData);
    } catch (err) {
      console.error("Error fetching dashboard analytics", err);
      setError("Failed to load dashboard data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReorder = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8000/products/${productId}/reorder`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        alert(result.message);
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(`Failed to reorder: ${err.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error reordering product", error);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading dashboard analytics...</div>;
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 500 }}>{error}</div>}

      {/* Row 1: Summary Stat Cards */}
      <div className="dashboard-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon blue"><Package size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{summary.products}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon purple"><Users size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Active Suppliers</p>
            <h3 className="stat-value">{summary.suppliers}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon green"><ClipboardList size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{summary.orders}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon orange"><DollarSign size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Revenue</p>
            <h3 className="stat-value">{formatCurrency(summary.revenue)}</h3>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="charts-row">
        {/* Revenue Trend - AreaChart */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">Revenue Trend</h3>
          {salesTrend.length === 0 ? (
            <div className="empty-state" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>No transaction sales history yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Selling Products - BarChart */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <div className="empty-state" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>No sales recorded yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="units" fill="url(#colorBar)" radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 3: Smart Reorder Alerts */}
      <div className="alerts-section">
        <div className="glass-card">
          <div className="alerts-header">
            <AlertTriangle size={20} className="alerts-icon" />
            <h3 className="chart-title" style={{ marginBottom: 0 }}>Smart Reorder Alerts</h3>
          </div>
          <div className="alerts-list">
            {lowStock.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>All products are well stocked! No warnings.</p>
              </div>
            ) : (
              lowStock.map((item) => (
                <div className="alert-row" key={item.id}>
                  <div className="alert-product-info">
                    <span className="font-medium">{item.name}</span>
                    <span className="badge sku-badge">{item.sku}</span>
                  </div>
                  <div className="alert-stats">
                    <div className="alert-stat">
                      <span className="alert-stat-label">Stock</span>
                      <span className="alert-stat-value">{item.current_stock}</span>
                    </div>
                    <div className="alert-stat">
                      <span className="alert-stat-label">Daily Sales</span>
                      <span className="alert-stat-value">{item.daily_sales}/day</span>
                    </div>
                    <div className="alert-stat">
                      <span className="alert-stat-label">Stockout In</span>
                      <span className={getDaysBadgeClass(item.days_left)}>
                        {item.days_left === 999 ? 'N/A' : `${item.days_left} ${item.days_left === 1 ? 'day' : 'days'}`}
                      </span>
                    </div>
                  </div>
                  <button className="btn-primary btn-sm" onClick={() => handleReorder(item.id)}>Reorder Now</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

