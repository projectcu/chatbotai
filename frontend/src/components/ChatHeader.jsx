import React from 'react';
import { FiLogOut, FiRotateCcw, FiSettings } from 'react-icons/fi';

const ChatHeader = ({ onClear, onEscalate }) => {
  return (
    <div className="chat-header">
      <div className="header-info">
        <h2>AI Assistant</h2>
        <p className="status">Online • Ready to help</p>
      </div>
      <div className="header-actions">
        <button onClick={onEscalate} title="Talk to an agent" className="header-btn">
          👨‍💼 Connect to Agent
        </button>
        <button onClick={onClear} title="Clear chat" className="header-btn">
          <FiRotateCcw size={18} />
        </button>
        <button title="Settings" className="header-btn">
          <FiSettings size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
