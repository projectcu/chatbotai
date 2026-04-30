const express = require('express');
const router = express.Router();
const { Conversation } = require('../models');

/**
 * GET /api/agents/queue
 * Get pending conversations queue
 */
router.get('/queue', async (req, res) => {
  try {
    const escalatedConversations = await Conversation.find({
      status: 'escalated',
      assignedAgent: null,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      queueLength: escalatedConversations.length,
      conversations: escalatedConversations,
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({
      error: 'Error fetching queue',
      message: error.message,
    });
  }
});

/**
 * POST /api/agents/accept
 * Agent accepts conversation
 */
router.post('/accept', async (req, res) => {
  try {
    const { sessionId, agentId } = req.body;

    if (!sessionId || !agentId) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, agentId',
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      {
        assignedAgent: agentId,
        status: 'active',
        $push: {
          messages: {
            type: 'system',
            content: `Agent ${agentId} has accepted the conversation`,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Conversation accepted',
      conversation,
    });
  } catch (error) {
    console.error('Error accepting conversation:', error);
    res.status(500).json({
      error: 'Error accepting conversation',
      message: error.message,
    });
  }
});

/**
 * POST /api/agents/message
 * Agent sends message
 */
router.post('/message', async (req, res) => {
  try {
    const { sessionId, agentId, message } = req.body;

    if (!sessionId || !agentId || !message) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, agentId, message',
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: {
            type: 'agent',
            content: message,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Message sent',
    });
  } catch (error) {
    console.error('Error sending agent message:', error);
    res.status(500).json({
      error: 'Error sending message',
      message: error.message,
    });
  }
});

/**
 * POST /api/agents/close
 * Close conversation
 */
router.post('/close', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'Missing sessionId',
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      {
        status: 'closed',
        endTime: new Date(),
        $push: {
          messages: {
            type: 'system',
            content: 'Conversation closed',
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Conversation closed',
    });
  } catch (error) {
    console.error('Error closing conversation:', error);
    res.status(500).json({
      error: 'Error closing conversation',
      message: error.message,
    });
  }
});

module.exports = router;
