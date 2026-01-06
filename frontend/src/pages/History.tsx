import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChats, deleteChat } from '../api/chats';
import type { Chat } from '../types';

const History: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const userIdNum = userId ? parseInt(userId, 10) : null;

    useEffect(() => {
        console.log('History: localStorage userId =', userId);

        if (!userId) {
            console.log('History: No userId found, redirecting to login');
            navigate('/login');
            return;
        }

        console.log('History: Parsed userId =', userIdNum);

        if (!userIdNum || isNaN(userIdNum)) {
            console.log('History: Invalid userId, redirecting to login');
            navigate('/login');
            return;
        }

        const fetchChats = async () => {
            try {
                console.log('History: Fetching chats for userId:', userIdNum);
                const data = await getChats(userIdNum);
                console.log('History: Received chats:', data);
                setChats(data);
            } catch (error) {
                console.error('History: Failed to load chats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, [navigate, userId, userIdNum]);

    const handleDeleteClick = (e: React.MouseEvent, chat: Chat) => {
        e.stopPropagation();
        setChatToDelete(chat);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!chatToDelete || !userIdNum) return;

        setDeleting(true);
        try {
            await deleteChat(chatToDelete.chat_id, userIdNum);
            setChats(chats.filter(c => c.chat_id !== chatToDelete.chat_id));
            setDeleteModalOpen(false);
            setChatToDelete(null);
        } catch (error) {
            console.error('Failed to delete chat:', error);
            alert(error instanceof Error ? error.message : 'Ошибка при удалении чата');
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setChatToDelete(null);
    };

    if (loading) {
        return (
            <div className="history-loading">
                <div className="spinner"></div>
                <p>Загрузка истории...</p>
            </div>
        );
    }

    return (
        <div className="history">
            <h1 className="page-title">История</h1>

            <div className="chat-list">
                {chats.map((chat, index) => (
                    <div
                        key={chat.chat_id}
                        className="list-item animate-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => navigate(`/chat/${chat.chat_id}`)}
                    >
                        <div className="list-item-content">
                            <div className="list-item-title">Чат #{chat.chat_id}</div>
                            <div className="list-item-subtitle">
                                {new Date(chat.created_at).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                        <button
                            className="icon-btn delete-btn"
                            onClick={(e) => handleDeleteClick(e, chat)}
                            title="Удалить чат"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    </div>
                ))}

                {chats.length === 0 && (
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <p>История пуста</p>
                        <span>Начните новый чат</span>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={handleCancelDelete}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 className="modal-title">Удалить чат?</h2>
                        <p className="modal-text">
                            Вы уверены, что хотите удалить <strong>Чат #{chatToDelete?.chat_id}</strong>?
                            <br />
                            Все сообщения будут безвозвратно удалены.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={handleCancelDelete}
                                disabled={deleting}
                            >
                                Отмена
                            </button>
                            <button
                                className="modal-btn delete-confirm-btn"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .history {
          padding: 1rem;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .chat-list {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .history-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 1rem;
          color: var(--text-secondary);
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          color: var(--text-secondary);
          text-align: center;
        }
        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        .empty-state p {
          font-weight: 500;
          color: var(--text-primary);
        }
        .empty-state span {
          font-size: 0.875rem;
        }
        
        /* Delete button styles */
        .delete-btn {
          color: var(--text-secondary);
          transition: color 0.2s, transform 0.2s;
        }
        .delete-btn:hover {
          color: #ef4444;
          transform: scale(1.1);
        }
        
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          max-width: 320px;
          width: 100%;
          text-align: center;
          animation: slideUp 0.3s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .modal-icon {
          margin-bottom: 1rem;
          color: #f59e0b;
        }
        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .modal-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .modal-text strong {
          color: var(--text-primary);
        }
        .modal-actions {
          display: flex;
          gap: 0.75rem;
        }
        .modal-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cancel-btn {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .cancel-btn:hover:not(:disabled) {
          background: var(--border-color);
        }
        .delete-confirm-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }
        .delete-confirm-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
        }
      `}</style>
        </div>
    );
};

export default History;
