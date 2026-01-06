import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';

const Dashboard: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        if (!storedId) {
            navigate('/login');
        } else {
            setUserId(parseInt(storedId, 10));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    if (!userId) return null;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h3>GigaChat Dashboard</h3>
                <button onClick={handleLogout} className="logout-btn">Disconnect</button>
            </header>
            <div className="dashboard-content">
                <ChatList userId={userId} />
                <main className="main-view">
                    <Outlet />
                </main>
            </div>
            <style>{`
        .dashboard {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: radial-gradient(circle at top right, #1e293b, #0f172a);
        }
        .dashboard-header {
            height: 60px;
            background: rgba(15, 23, 42, 0.8);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
        }
        .dashboard-header h3 {
            margin: 0;
            background: linear-gradient(to right, #818cf8, #c4b5fd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .dashboard-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .main-view {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .logout-btn {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-secondary);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
