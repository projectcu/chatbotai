const express = require('express');
const router = express.Router();
const { ChatService, NLPService } = require('../services/chatService');
const { Conversation } = require('../models');
const { v4: uuidv4 } = require('uuid');

const chatService = new ChatService();

/**
 * POST /api/chat/message
 * Process user message and return bot response
 */
router.post('/message', async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: 'Missing required fields: userId, message',
      });
    }

    const finalSessionId = sessionId || uuidv4();

    // Ensure conversation exists
    const conversation = await Conversation.findOneAndUpdate(
      { sessionId: finalSessionId },
      {
        userId,
        sessionId: finalSessionId,
        status: 'active',
      },
      { upsert: true, new: true }
    );

    // Process message
    const result = await chatService.processMessage(userId, finalSessionId, message);

    res.json({
      success: true,
      sessionId: finalSessionId,
      ...result,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Error processing message',
      message: error.message,
    });
  }
});

/**
 * POST /api/chat/session
 * Create new chat session
 */
router.post('/session', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId',
      });
    }

    const sessionId = uuidv4();
    const conversation = await Conversation.create({
      userId,
      sessionId,
      status: 'active',
      messages: [],
      channel: 'web',
    });

    res.json({
      success: true,
      sessionId,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      error: 'Error creating session',
      message: error.message,
    });
  }
});

/**
 * GET /api/chat/history/:sessionId
 * Get conversation history
 */
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
      });
    }

    res.json({
      success: true,
      sessionId,
      messages: conversation.messages,
      status: conversation.status,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({
      error: 'Error retrieving conversation history',
      message: error.message,
    });
  }
});

/**
 * POST /api/chat/feedback
 * Submit user satisfaction feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, rating',
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      {
        satisfaction: rating,
        $push: {
          messages: {
            type: 'system',
            content: `User feedback: ${rating}/5${comment ? ' - ' + comment : ''}`,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Feedback recorded',
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      error: 'Error submitting feedback',
      message: error.message,
    });
  }
});

/**
 * POST /api/chat/escalate
 * Escalate to live agent
 */
router.post('/escalate', async (req, res) => {
  try {
    const { sessionId, reason } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'Missing sessionId',
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      {
        status: 'escalated',
        $push: {
          messages: {
            type: 'system',
            content: `Escalated to live agent. Reason: ${reason || 'No reason provided'}`,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Escalated to live agent',
      sessionId,
    });
  } catch (error) {
    console.error('Escalation error:', error);
    res.status(500).json({
      error: 'Error escalating to agent',
      message: error.message,
    });
  }
});

module.exports = router;
