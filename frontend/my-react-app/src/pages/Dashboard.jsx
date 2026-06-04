import React from 'react';
import { Package, Users, ClipboardList, DollarSign, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import './Dashboard.css';

const SUMMARY = { products: 156, suppliers: 24, buyers: 89, orders: 342, revenue: 128450.00, costs: 87200.00 };

const SALES_TREND = [
  { date: 'May 20', revenue: 3200 },
  { date: 'May 21', revenue: 4100 },
  { date: 'May 22', revenue: 2800 },
  { date: 'May 23', revenue: 5200 },
  { date: 'May 24', revenue: 4800 },
  { date: 'May 25', revenue: 3900 },
  { date: 'May 26', revenue: 6100 },
  { date: 'May 27', revenue: 5500 },
  { date: 'May 28', revenue: 4200 },
  { date: 'May 29', revenue: 7800 },
  { date: 'May 30', revenue: 6400 },
  { date: 'May 31', revenue: 5100 },
  { date: 'Jun 01', revenue: 8200 },
  { date: 'Jun 02', revenue: 7100 },
];

const TOP_PRODUCTS = [
  { name: 'Wireless Headphones', units: 245 },
  { name: 'USB-C Hub', units: 189 },
  { name: 'Organic Coffee Beans', units: 167 },
  { name: 'Running Shoes Pro', units: 134 },
  { name: 'Smart LED Bulbs', units: 112 },
];

const LOW_STOCK = [
  { name: 'Wireless Mouse', sku: 'WM-204', current_stock: 8, daily_sales: 4, days_left: 2, reorder_threshold: 10 },
  { name: 'Phone Case Premium', sku: 'PC-112', current_stock: 15, daily_sales: 3, days_left: 5, reorder_threshold: 20 },
  { name: 'HDMI Cable 2m', sku: 'HC-089', current_stock: 22, daily_sales: 5, days_left: 4, reorder_threshold: 25 },
  { name: 'Laptop Stand', sku: 'LS-045', current_stock: 6, daily_sales: 2, days_left: 3, reorder_threshold: 10 },
];

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
  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      {/* Row 1: Summary Stat Cards */}
      <div className="dashboard-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon blue"><Package size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{SUMMARY.products}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon purple"><Users size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Active Suppliers</p>
            <h3 className="stat-value">{SUMMARY.suppliers}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon green"><ClipboardList size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{SUMMARY.orders}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon orange"><DollarSign size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Revenue</p>
            <h3 className="stat-value">{formatCurrency(SUMMARY.revenue)}</h3>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="charts-row">
        {/* Revenue Trend - AreaChart */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={SALES_TREND} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
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
        </div>

        {/* Top Selling Products - BarChart */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={TOP_PRODUCTS}
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
            {LOW_STOCK.map((item, index) => (
              <div className="alert-row" key={index}>
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
                      {item.days_left} {item.days_left === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>
                <button className="btn-primary btn-sm">Reorder Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
