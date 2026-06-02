import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search anything..." className="search-input" />
      </div>
      
      <div className="topbar-actions">
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  );
}