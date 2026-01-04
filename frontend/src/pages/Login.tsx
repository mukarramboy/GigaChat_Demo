import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already logged in
        const existingUserId = localStorage.getItem('userId');
        if (existingUserId) {
            navigate('/');
            return;
        }

        // Check for user_id from Telegram query parameter
        const params = new URLSearchParams(window.location.search);
        const idFromTelegram = params.get('user_id');
        if (idFromTelegram) {
            localStorage.setItem('userId', idFromTelegram);
            navigate('/'); // Auto-redirect after saving
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            localStorage.setItem('userId', userId);
            navigate('/');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="11" fill="url(#gradient)" />
                            <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="24" y2="24">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1>GigaChat</h1>
                    <p>Введите ваш ID для входа</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="User ID"
                        autoFocus
                        required
                    />
                    <button type="submit">Войти</button>
                </form>

                <div className="login-footer">
                    <p>Powered by GigaChat API</p>
                </div>
            </div>




            <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 1rem;
        }
        .login-container {
          width: 100%;
          max-width: 400px;
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          padding: 2.5rem 2rem;
          box-shadow: var(--shadow-lg);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo {
          margin-bottom: 1rem;
        }
        .login-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-form input {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: var(--bg-secondary);
          outline: none;
        }
        .login-form input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .login-form button {
          width: 100%;
          padding: 1rem;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .login-form button:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }
        .login-form button:active {
          transform: translateY(0);
        }
        .login-footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
};

export default Login;
