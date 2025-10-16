import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="sidebar">
      <div className="brand">marketdo</div>
      <nav>
        <ul>
          <li><Link to="/">lista de compras</Link></li>
          <li><Link to="/fazendo-compras">fazendo compras</Link></li>
          <li><Link to="/historico">historico de compras</Link></li>
          <li><Link to="/dashboard">dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}
