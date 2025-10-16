import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header({ isOpen, setIsOpen }) {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'lista de compras' },
    { path: '/fazendo-compras', label: 'fazendo compras' },
    { path: '/historico', label: 'historico de compras' },
    { path: '/dashboard', label: 'dashboard' }
  ];

  return (
    <>
      {/* Botão de minimizar para mobile */}
      <button
        className={`minimize-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <header className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand"><img src="/vite.svg" alt="MarketDo Logo" className="brand-logo" /><span>MarketDo</span></div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
    </>
  );
}
