const express = require('express');
const router = express.Router();
const { Intent, ResponseTemplate } = require('../models');

/**
 * GET /api/admin/intents
 * Get all intents
 */
router.get('/intents', async (req, res) => {
  try {
    const intents = await Intent.find();
    res.json({
      success: true,
      count: intents.length,
      intents,
    });
  } catch (error) {
    console.error('Error fetching intents:', error);
    res.status(500).json({
      error: 'Error fetching intents',
      message: error.message,
    });
  }
});

/**
 * POST /api/admin/intents
 * Create new intent
 */
router.post('/intents', async (req, res) => {
  try {
    const { name, category, trainingPhrases, responses, entities, confidence_threshold } = req.body;

    if (!name || !trainingPhrases || !responses) {
      return res.status(400).json({
        error: 'Missing required fields: name, trainingPhrases, responses',
      });
    }

    const intent = new Intent({
      name,
      category,
      trainingPhrases,
      responses,
      entities,
      confidence_threshold: confidence_threshold || 0.7,
    });

    await intent.save();

    res.status(201).json({
      success: true,
      message: 'Intent created successfully',
      intent,
    });
  } catch (error) {
    console.error('Error creating intent:', error);
    res.status(500).json({
      error: 'Error creating intent',
      message: error.message,
    });
  }
});

/**
 * PUT /api/admin/intents/:id
 * Update intent
 */
router.put('/intents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const intent = await Intent.findByIdAndUpdate(id, updates, { new: true });

    if (!intent) {
      return res.status(404).json({
        error: 'Intent not found',
      });
    }

    res.json({
      success: true,
      message: 'Intent updated successfully',
      intent,
    });
  } catch (error) {
    console.error('Error updating intent:', error);
    res.status(500).json({
      error: 'Error updating intent',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/admin/intents/:id
 * Delete intent
 */
router.delete('/intents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const intent = await Intent.findByIdAndDelete(id);

    if (!intent) {
      return res.status(404).json({
        error: 'Intent not found',
      });
    }

    res.json({
      success: true,
      message: 'Intent deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting intent:', error);
    res.status(500).json({
      error: 'Error deleting intent',
      message: error.message,
    });
  }
});

/**
 * POST /api/admin/test-intent
 * Test intent recognition
 */
router.post('/test-intent', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    const { NLPService } = require('../services/chatService');
    const nlpService = new NLPService();
    
    const result = await nlpService.recognizeIntent(message);
    const entities = await nlpService.extractEntities(message, result.intent);

    res.json({
      success: true,
      input: message,
      result: {
        ...result,
        entities,
      },
    });
  } catch (error) {
    console.error('Error testing intent:', error);
    res.status(500).json({
      error: 'Error testing intent',
      message: error.message,
    });
  }
});

module.exports = router;
