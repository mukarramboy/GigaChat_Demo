import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatDetails, deleteChat } from '../api/chats';
import type { ChatDetail } from '../types';
import BottomNav from './BottomNav';

const ChatDetailView: React.FC = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const userId = localStorage.getItem('userId');
    const userIdNum = userId ? parseInt(userId, 10) : null;

    useEffect(() => {
        if (chatId) {
            setLoading(true);
            getChatDetails(Number(chatId))
                .then(setChatDetail)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatDetail]);

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!chatId || !userIdNum) return;

        setDeleting(true);
        try {
            await deleteChat(Number(chatId), userIdNum);
            navigate('/history');
        } catch (error) {
            console.error('Failed to delete chat:', error);
            alert(error instanceof Error ? error.message : 'Ошибка при удалении чата');
        } finally {
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    };

    if (loading) {
        return (
            <div className="container">
                <div className="chat-detail-page">
                    <div className="chat-loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="chat-detail-page">
                <header className="chat-header">
                    <button className="icon-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="chat-header-spacer"></div>
                    <button className="icon-btn delete-btn" onClick={handleDeleteClick} title="Удалить чат">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </button>
                </header>

                <div className="messages-scroll">
                    <div className="messages">
                        {chatDetail?.prompts.map((item, index) => (
                            <React.Fragment key={item.id}>
                                {/* User Message */}
                                <div className="message user animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="message-bubble">
                                        {item.prompt}
                                    </div>
                                </div>

                                {/* AI Response */}
                                {item.response && (
                                    <div className="message ai animate-in" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}>
                                        {item.type === 'image' ? (
                                            <div className="message-image">
                                                <img src={item.response} alt="AI Generated" />
                                            </div>
                                        ) : (
                                            <div className="message-bubble">
                                                <div className="ai-response-title">Ответ</div>
                                                <div className="ai-response-text">{item.response}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {chatDetail?.prompts.length === 0 && (
                            <div className="empty-chat">
                                <p>Нет сообщений</p>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>

                <div className="bottom-action">
                    <button onClick={() => window.open('https://t.me/gigachat_bot', '_blank')}>
                        Продолжить в Telegram
                    </button>
                </div>

                <BottomNav />

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
                                Вы уверены, что хотите удалить <strong>Чат #{chatId}</strong>?
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
            </div>

            <style>{`
        .chat-detail-page {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
        }
        .chat-header {
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.5rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-primary);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .chat-header-spacer {
          flex: 1;
        }
        .delete-btn {
          color: var(--text-secondary);
          transition: color 0.2s, transform 0.2s;
        }
        .delete-btn:hover {
          color: #ef4444;
          transform: scale(1.1);
        }
        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding-bottom: calc(var(--nav-height) + 80px);
        }
        .ai-response-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        .ai-response-text {
          font-size: 1rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .chat-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
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
        .empty-chat {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: var(--text-secondary);
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

export default ChatDetailView;
