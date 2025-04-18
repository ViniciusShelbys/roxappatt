import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Transacoes from './Transacoes';

const App = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.body.style.background = darkMode ? '#121212' : '#f0f0f0';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div style={{ color: darkMode ? '#fff' : '#000' }}>
      <header style={{ padding: 16, background: darkMode ? '#1f1f1f' : '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Rox App</h1>
        <button onClick={() => setDarkMode(!darkMode)} style={{ fontSize: 18 }}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard darkMode={darkMode} />} />
        <Route path="/transacoes" element={<Transacoes darkMode={darkMode} />} />
      </Routes>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around',
        background: darkMode ? '#1f1f1f' : '#fff',
        padding: '12px 0', borderTop: '1px solid #ccc'
      }}>
        <Link to="/" style={{ color: location.pathname === '/' ? '#6C4AB6' : '#888' }}>🏠</Link>
        <Link to="/transacoes" style={{ color: location.pathname === '/transacoes' ? '#6C4AB6' : '#888' }}>📄</Link>
      </nav>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router><App /></Router>
);