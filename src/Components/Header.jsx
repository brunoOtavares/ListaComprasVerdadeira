import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'lista de compras', icon: '📝' },
    { path: '/fazendo-compras', label: 'fazendo compras', icon: '🛒' },
    { path: '/historico', label: 'historico de compras', icon: '📊' },
    { path: '/dashboard', label: 'dashboard', icon: '📈' }
  ];

  return (
    <header className="sidebar">
      <div className="brand">marketdo</div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
