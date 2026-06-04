import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, ClipboardList } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Users size={20} /> },
    { name: 'Buyers', path: '/buyers', icon: <ShoppingCart size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ClipboardList size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">RF</span>
        <span className="logo-text">RetailFlow<span className="accent">AI</span></span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
