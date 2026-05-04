import React from 'react';
import { useAuth } from '../context/AuthContext';

function Messages() {
  const { messages } = useAuth();

  return (
    <section className="messages-page container py-5">
      <div className="messages-header mb-4">
        <h1>Your Messages</h1>
        <p>Communicate with sellers about products</p>
      </div>

      {messages.length === 0 ? (
        <div className="empty-messages">
          <p>No messages yet. Start a conversation by contacting sellers from product pages.</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div className="message-card" key={msg._id}>
              <div className="message-header">
                <span className="sender">From: {msg.sender.firstName} ({msg.sender.email})</span>
                <span className="timestamp">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <div className="message-content">
                <p><strong>Product:</strong> {msg.product.title}</p>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .messages-page h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .messages-header p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .empty-messages {
          background: white;
          padding: 40px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 18px 40px rgba(99,103,255,0.12);
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .message-card {
          background: white;
          padding: 24px;
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(99,103,255,0.08);
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .sender {
          font-weight: 700;
          color: #6367ff;
        }

        .timestamp {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .message-content p {
          margin: 8px 0;
          color: #374151;
        }

        .message-content p:first-child {
          color: #6367ff;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .message-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </section>
  );
}

export default Messages;