import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChatDetails } from '../api/chats';
import type { ChatDetail } from '../types';

const ChatWindow: React.FC = () => {
  const { chatId } = useParams();
  const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  if (!chatId) {
    return (
      <div className="chat-placeholder">
        <p>Select a chat to view details</p>
      </div>
    );
  }

  if (loading) {
    return <div className="chat-loading">Loading messages...</div>;
  }

  return (
    <div className="chat-window">
      <div className="messages-container">
        {chatDetail?.prompts.map((item) => (
          <React.Fragment key={item.id}>
            {/* User Message */}
            <div className="message user">
              <div className="bubble user-bubble">
                {item.prompt}
              </div>
              <span className="timestamp">{new Date(item.created_at).toLocaleTimeString()}</span>
            </div>

            {/* AI Response */}
            {item.response && (
              <div className="message ai">
                <div className="avatar">AI</div>
                <div className="bubble ai-bubble">
                  {item.type === 'image' ? (
                    <img src={item.response} alt="AI Generated" style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
                  ) : (
                    item.response
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        {chatDetail?.prompts.length === 0 && (
          <div className="no-messages">No messages yet.</div>
        )}
        <div ref={bottomRef} />
      </div>
      <style>{`
        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(20px);
        }
        .chat-placeholder {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 1.2rem;
        }
        .chat-loading {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
        }
        .messages-container {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .message {
          display: flex;
          flex-direction: column;
          max-width: 80%;
          gap: 0.25rem;
        }
        .message.user {
          align-self: flex-end;
          align-items: flex-end;
        }
        .message.ai {
          align-self: flex-start;
          flex-direction: row;
          align-items: flex-start;
          gap: 1rem;
        }
        .bubble {
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          line-height: 1.5;
          position: relative;
        }
        .user-bubble {
          background: var(--accent-primary);
          color: white;
          border-bottom-right-radius: 0.25rem;
        }
        .ai-bubble {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-bottom-left-radius: 0.25rem;
        }
        .avatar {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          flex-shrink: 0;
        }
        .timestamp {
          font-size: 0.75rem;
          color: var(--text-secondary);
          opacity: 0.7;
        }
        .no-messages {
            text-align: center;
            color: var(--text-secondary);
            margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
