import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiThumbsUp, FiThumbsDown, FiCopy } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const MessageList = ({ messages, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = React.useState({});

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <h3>Welcome to AI Chatbot!</h3>
          <p>How can I help you today?</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={message.id} className={`message message-${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' && <span>👤</span>}
              {message.type === 'bot' && <span>🤖</span>}
              {message.type === 'agent' && <span>👨‍💼</span>}
              {message.type === 'system' && <span>ℹ️</span>}
            </div>

            <div className="message-content">
              <div className="message-bubble">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>

              <div className="message-meta">
                <span className="timestamp">
                  {formatDistanceToNow(new Date(message.timestamp), {
                    addSuffix: true,
                  })}
                </span>

                {message.confidence && (
                  <span className="confidence">
                    Confidence: {(message.confidence * 100).toFixed(0)}%
                  </span>
                )}

                {message.type === 'bot' && !feedbackGiven[message.id] && (
                  <div className="feedback-buttons">
                    <button
                      onClick={() => {
                        onFeedback(5);
                        setFeedbackGiven({ ...feedbackGiven, [message.id]: true });
                      }}
                      title="Helpful"
                      className="feedback-btn"
                    >
                      <FiThumbsUp size={14} />
                    </button>
                    <button
                      onClick={() => {
                        onFeedback(1);
                        setFeedbackGiven({ ...feedbackGiven, [message.id]: true });
                      }}
                      title="Not helpful"
                      className="feedback-btn"
                    >
                      <FiThumbsDown size={14} />
                    </button>
                    <button
                      onClick={() => handleCopyMessage(message.content)}
                      title="Copy"
                      className="feedback-btn"
                    >
                      <FiCopy size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
