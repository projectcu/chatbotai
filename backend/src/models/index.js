const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'agent'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [
    {
      type: {
        type: String,
        enum: ['user', 'bot', 'agent'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      intent: String,
      entities: [String],
      confidence: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ['active', 'closed', 'escalated'],
    default: 'active',
  },
  assignedAgent: String,
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
  satisfaction: Number,
  channel: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web',
  },
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

// Intent Schema
const intentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: String,
  trainingPhrases: [String],
  responses: [String],
  entities: [String],
  confidence_threshold: {
    type: Number,
    default: 0.7,
  },
  fallback: Boolean,
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Response Template Schema
const responseTemplateSchema = new mongoose.Schema({
  id: String,
  intentId: String,
  template: String,
  variables: [String],
  language: {
    type: String,
    default: 'en',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  sessionId: String,
  userId: String,
  intent: String,
  botResponse: String,
  userRating: Number,
  responseTime: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  success: Boolean,
  channel: String,
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: String,
  token: String,
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  userAgent: String,
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Conversation: mongoose.model('Conversation', conversationSchema),
  Intent: mongoose.model('Intent', intentSchema),
  ResponseTemplate: mongoose.model('ResponseTemplate', responseTemplateSchema),
  Analytics: mongoose.model('Analytics', analyticsSchema),
  Session: mongoose.model('Session', sessionSchema),
};
