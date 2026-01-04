import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

interface MobileLayoutProps {
    showHeader?: boolean;
    title?: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
    children?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
    showHeader = true,
    title = 'GigaChat',
    showBack = false,
    rightAction,
    children
}) => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="page">
                {showHeader && (
                    <header className="header">
                        <div className="header-title">
                            {showBack ? (
                                <button className="icon-btn" onClick={() => navigate(-1)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            ) : (
                                <>
                                    {title}
                                    <span className="verified">✓</span>
                                </>
                            )}
                        </div>
                        <div className="header-actions">
                            {rightAction || (
                                <>
                                    <button className="icon-btn">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="12" cy="5" r="1" />
                                            <circle cx="12" cy="19" r="1" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </header>
                )}
                <div className="page-content">
                    {children || <Outlet />}
                </div>
                <BottomNav />
            </div>
        </div>
    );
};

export default MobileLayout;
