import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>📚 Digital Storybook</h1>
      <ul className="nav-links">
        <li><Link to="/">Write</Link></li>
        <li><Link to="/mystories">My Stories</Link></li>
      </ul>
    </nav>
  );
}
