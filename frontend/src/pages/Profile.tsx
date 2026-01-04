import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className="profile">
            <h1 className="page-title">Профиль</h1>

            <div className="profile-card">
                <div className="profile-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                </div>
                <div className="profile-info">
                    <div className="profile-name">Пользователь #{userId}</div>
                    <div className="profile-status">Активен</div>
                </div>
            </div>

            <div className="profile-section">
                <h2>Настройки</h2>
                <div className="settings-list">
                    <div className="list-item">
                        <div className="list-item-content">
                            <div className="list-item-title">Уведомления</div>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                    <div className="list-item">
                        <div className="list-item-content">
                            <div className="list-item-title">Язык</div>
                            <div className="list-item-subtitle">Русский</div>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                    <div className="list-item">
                        <div className="list-item-content">
                            <div className="list-item-title">О приложении</div>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Выйти
            </button>

            <style>{`
        .profile {
          padding: 1rem;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .profile-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .profile-avatar {
          width: 64px;
          height: 64px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .profile-info {
          flex: 1;
        }
        .profile-name {
          font-size: 1.125rem;
          font-weight: 600;
        }
        .profile-status {
          font-size: 0.875rem;
          color: #10b981;
          margin-top: 0.25rem;
        }
        .profile-section {
          margin-bottom: 1.5rem;
        }
        .profile-section h2 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }
        .settings-list {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .settings-list .list-item {
          padding: 1rem;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          color: #ef4444;
          font-weight: 500;
          transition: background 0.2s;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
        </div>
    );
};

export default Profile;
