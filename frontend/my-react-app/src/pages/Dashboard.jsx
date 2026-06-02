import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, suppliers: 0, buyers: 0 });

  useEffect(() => {
    // In a real app, you'd fetch these from a summary endpoint
    // For now, we fetch all and count to simulate
    Promise.all([
      fetch('http://localhost:8000/products/').then(res => res.json()),
      fetch('http://localhost:8000/suppliers/').then(res => res.json()),
      fetch('http://localhost:8000/buyers/').then(res => res.json())
    ]).then(([products, suppliers, buyers]) => {
      setStats({
        products: products.length || 0,
        suppliers: suppliers.length || 0,
        buyers: buyers.length || 0
      });
    }).catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon blue"><Package size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{stats.products}</h3>
          </div>
        </div>
        
        <div className="stat-card glass-card">
          <div className="stat-icon purple"><Users size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Active Suppliers</p>
            <h3 className="stat-value">{stats.suppliers}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon green"><ShoppingCart size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Registered Buyers</p>
            <h3 className="stat-value">{stats.buyers}</h3>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon orange"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Revenue (MTD)</p>
            <h3 className="stat-value">$0.00</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-content mt-8">
        <div className="glass-card">
          <h2>Welcome to RetailFlow AI</h2>
          <p className="mt-4">
            Select a module from the sidebar to start managing your retail operations. 
            You can add products, manage supplier relationships, and track buyers.
          </p>
        </div>
      </div>
    </div>
  );
}
