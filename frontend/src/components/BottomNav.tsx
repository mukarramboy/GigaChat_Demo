import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
    const location = useLocation();

    // Hide nav on chat detail pages
    if (location.pathname.match(/^\/chat\/\d+/)) {
        return null;
    }

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                <span>Главная</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>История</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
                <span>Профиль</span>
            </NavLink>
            <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          background: var(--bg-primary);
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 1000;
          max-width: 480px;
          margin: 0 auto;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          color: var(--text-muted);
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-item span {
          font-size: 0.75rem;
          font-weight: 500;
        }
        .nav-item.active {
          color: var(--text-primary);
        }
        .nav-item svg {
          width: 22px;
          height: 22px;
        }
      `}</style>
        </nav>
    );
};

export default BottomNav;
