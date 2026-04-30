import React from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';

const InputField = ({ value, onChange, onSubmit, isLoading, placeholder }) => {
  return (
    <form onSubmit={onSubmit} className="input-form">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Type your message...'}
        disabled={isLoading}
        className="message-input"
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="send-button"
      >
        {isLoading ? <FiLoader className="spinning" /> : <FiSend />}
      </button>
    </form>
  );
};

export default InputField;
