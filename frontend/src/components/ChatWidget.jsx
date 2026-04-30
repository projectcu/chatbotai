import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FiSend, FiMapPin, FiSmile, FiTrash2 } from 'react-icons/fi';
import MessageList from './MessageList';
import InputField from './InputField';
import ChatHeader from './ChatHeader';
import useChatStore from '../store/chatStore';
import '../styles/ChatWidget.css';

const ChatWidget = () => {
  const {
    sessionId,
    messages,
    isLoading,
    setSessionId,
    addMessage,
    setLoading,
    clearMessages,
  } = useChatStore();

  const [userId] = useState(() => localStorage.getItem('userId') || uuidv4());
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Initialize chat session
  useEffect(() => {
    localStorage.setItem('userId', userId);
    if (!sessionId) {
      initializeSession();
    }
  }, [userId, sessionId]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const response = await axios.post(`${API_URL}/chat/session`, { userId });
      setSessionId(response.data.sessionId);
    } catch (error) {
      console.error('Failed to initialize session:', error);
      // Create a temporary session ID if API fails
      setSessionId(uuidv4());
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message to UI
    addMessage({
      id: uuidv4(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/message`, {
        userId,
        sessionId,
        message: userMessage,
      });

      const { response: botResponse, intent, confidence, entities } = response.data;

      // Add bot response to UI
      addMessage({
        id: uuidv4(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        intent,
        confidence,
        entities,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        id: uuidv4(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    try {
      await axios.post(`${API_URL}/chat/escalate`, {
        sessionId,
        reason: 'User requested escalation',
      });

      addMessage({
        id: uuidv4(),
        type: 'system',
        content: 'You have been connected to a live agent. They will be with you shortly.',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error escalating:', error);
    }
  };

  const handleFeedback = async (rating) => {
    try {
      await axios.post(`${API_URL}/chat/feedback`, {
        sessionId,
        rating,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="chat-widget">
      <ChatHeader
        onClear={clearMessages}
        onEscalate={handleEscalate}
      />

      <div className="chat-messages">
        <MessageList
          messages={messages}
          onFeedback={handleFeedback}
        />
        <div ref={messagesEndRef} />
      </div>

      <InputField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSubmit={sendMessage}
        isLoading={isLoading}
        placeholder="Type your message here..."
      />
    </div>
  );
};

export default ChatWidget;
