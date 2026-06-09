import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Package, Store, Users } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load database entities when user focuses on the search bar
  const handleFocus = async () => {
    try {
      const [pRes, bRes, sRes] = await Promise.all([
        fetch('http://localhost:8000/products/'),
        fetch('http://localhost:8000/buyers/'),
        fetch('http://localhost:8000/suppliers/')
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (bRes.ok) setBuyers(await bRes.json());
      if (sRes.ok) setSuppliers(await sRes.json());
      setShowDropdown(true);
    } catch (error) {
      console.error("Failed to load search index", error);
    }
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter lists based on query
  const filteredProducts = query
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.sku.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredBuyers = query
    ? buyers.filter(b => 
        b.name.toLowerCase().includes(query.toLowerCase()) || 
        b.shop_name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredSuppliers = query
    ? suppliers.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const hasResults = filteredProducts.length > 0 || filteredBuyers.length > 0 || filteredSuppliers.length > 0;

  const handleSelect = (path) => {
    navigate(path);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <header className="topbar">
      <div className="search-container" ref={searchRef}>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products, buyers, suppliers..." 
            className="search-input" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
          />
        </div>

        {showDropdown && query && (
          <div className="search-dropdown">
            {!hasResults ? (
              <div className="dropdown-no-results">No matches found for "{query}"</div>
            ) : (
              <>
                {filteredProducts.length > 0 && (
                  <div className="dropdown-group">
                    <div className="group-title"><Package size={13} /> Products</div>
                    {filteredProducts.map(p => (
                      <div key={p.id} className="dropdown-item" onClick={() => handleSelect('/products')}>
                        <span className="item-name">{p.name}</span>
                        <span className="badge sku-badge">{p.sku}</span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredBuyers.length > 0 && (
                  <div className="dropdown-group">
                    <div className="group-title"><Store size={13} /> Buyers / Customers</div>
                    {filteredBuyers.map(b => (
                      <div key={b.id} className="dropdown-item" onClick={() => handleSelect('/buyers')}>
                        <span className="item-name">{b.shop_name}</span>
                        <span className="item-sub">({b.name})</span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredSuppliers.length > 0 && (
                  <div className="dropdown-group">
                    <div className="group-title"><Users size={13} /> Suppliers</div>
                    {filteredSuppliers.map(s => (
                      <div key={s.id} className="dropdown-item" onClick={() => handleSelect('/suppliers')}>
                        <span className="item-name">{s.name}</span>
                        <span className="item-sub">({s.contact_person})</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
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