import React, { useEffect, useState } from 'react';
import { getChats } from '../api/chats';
import type { Chat } from '../types';
import { useNavigate, useParams } from 'react-router-dom';

interface ChatListProps {
    userId: number;
}

const ChatList: React.FC<ChatListProps> = ({ userId }) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { chatId } = useParams();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getChats(userId);
                setChats(data);
            } catch (error) {
                console.error('Failed to load chats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, [userId]);

    if (loading) {
        return <div className="chat-list-loading">Loading chats...</div>;
    }

    return (
        <div className="chat-list">
            <h2 className="chat-list-header">Chats</h2>
            <div className="chat-items">
                {chats.map((chat) => (
                    <div
                        key={chat.chat_id}
                        className={`chat-item ${Number(chatId) === chat.chat_id ? 'active' : ''}`}
                        onClick={() => navigate(`/chats/${chat.chat_id}`)}
                    >
                        <div className="chat-avatar">
                            Chat {chat.chat_id}
                        </div>
                        <div className="chat-info">
                            <span className="chat-date">
                                {new Date(chat.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
                {chats.length === 0 && (
                    <div className="empty-state">No chats found.</div>
                )}
            </div>
            <style>{`
        .chat-list {
          width: 300px;
          border-right: 1px solid var(--border-color);
          background: rgba(15, 23, 42, 0.3);
          display: flex;
          flex-direction: column;
        }
        .chat-list-header {
          padding: 1.5rem;
          margin: 0;
          font-size: 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }
        .chat-items {
          flex: 1;
          overflow-y: auto;
        }
        .chat-item {
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .chat-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .chat-item.active {
          background: rgba(99, 102, 241, 0.1);
          border-left: 3px solid var(--accent-primary);
        }
        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #475569, #334155);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .chat-date {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .chat-list-loading, .empty-state {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default ChatList;
