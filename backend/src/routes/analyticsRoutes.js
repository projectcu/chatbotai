const express = require('express');
const router = express.Router();
const { Analytics, Conversation } = require('../models');

/**
 * GET /api/analytics/summary
 * Get analytics summary
 */
router.get('/summary', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Total conversations
    const totalConversations = await Conversation.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Average conversation length
    const conversations = await Conversation.find({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const avgLength = conversations.reduce((sum, conv) => sum + conv.messages.length, 0) / conversations.length || 0;

    // Analytics data
    const analyticsData = await Analytics.find({
      timestamp: { $gte: thirtyDaysAgo },
    });

    // Success rate
    const successCount = analyticsData.filter(a => a.success).length;
    const successRate = (successCount / analyticsData.length) * 100 || 0;

    // Average response time
    const avgResponseTime = analyticsData.reduce((sum, a) => sum + a.responseTime, 0) / analyticsData.length || 0;

    // Top intents
    const intentCounts = {};
    analyticsData.forEach(a => {
      intentCounts[a.intent] = (intentCounts[a.intent] || 0) + 1;
    });
    const topIntents = Object.entries(intentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([intent, count]) => ({ intent, count }));

    res.json({
      success: true,
      period: '30 days',
      summary: {
        totalConversations,
        avgConversationLength: Math.round(avgLength),
        successRate: Math.round(successRate),
        avgResponseTime: Math.round(avgResponseTime),
        topIntents,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Error fetching analytics',
      message: error.message,
    });
  }
});

/**
 * GET /api/analytics/trends
 * Get trend data
 */
router.get('/trends', async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const trends = await Analytics.aggregate([
      {
        $match: { timestamp: { $gte: startDate } },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] },
          },
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      period: `${days} days`,
      trends: trends.map(t => ({
        date: t._id,
        conversations: t.count,
        successRate: Math.round((t.successCount / t.count) * 100),
        avgResponseTime: Math.round(t.avgResponseTime),
      })),
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      error: 'Error fetching trends',
      message: error.message,
    });
  }
});

/**
 * GET /api/analytics/user-ratings
 * Get user satisfaction ratings
 */
router.get('/user-ratings', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      satisfaction: { $exists: true, $ne: null },
    });

    const ratings = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    conversations.forEach(conv => {
      const rating = Math.round(conv.satisfaction);
      if (rating >= 1 && rating <= 5) {
        ratings[rating]++;
      }
    });

    const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);
    const avgRating = totalRatings > 0
      ? (Object.entries(ratings).reduce((sum, [rating, count]) => sum + rating * count, 0) / totalRatings).toFixed(2)
      : 0;

    res.json({
      success: true,
      totalRatings,
      averageRating: parseFloat(avgRating),
      distribution: ratings,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      error: 'Error fetching ratings',
      message: error.message,
    });
  }
});

module.exports = router;
