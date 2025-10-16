import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="sidebar">
      <div className="brand">marketdo</div>
      <nav>
        <ul>
          <li><Link to="/"><span>🛒</span> lista de compras</Link></li>
          <li><Link to="/fazendo-compras"><span>🛍️</span> fazendo compras</Link></li>
          <li><Link to="/historico"><span>📜</span> historico de compras</Link></li>
          <li><Link to="/dashboard"><span>📊</span> dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}
