const { Conversation, Intent, ResponseTemplate, Analytics } = require('../models');
const { v4: uuidv4 } = require('uuid');
const natural = require('natural');
const TfIdf = natural.TfIdf;

class NLPService {
  constructor() {
    this.tfIdf = new TfIdf();
  }

  /**
   * Preprocess user input
   */
  async preprocessInput(userInput) {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(userInput.toLowerCase());

    // Remove common stopwords
    const stopwords = ['the', 'a', 'is', 'in', 'to', 'of', 'and', 'for', 'on', 'with', 'as', 'at', 'by', 'be', 'this', 'that', 'it', 'i', 'me', 'my'];
    const filteredTokens = tokens.filter(token => !stopwords.includes(token));

    return {
      original: userInput,
      tokens,
      filtered: filteredTokens,
      length: userInput.length,
    };
  }

  /**
   * Recognize intent from user input
   */
  async recognizeIntent(userInput) {
    try {
      const preprocessed = await this.preprocessInput(userInput);
      const normalizedInput = userInput.toLowerCase().trim();

      // Fetch all intents from database
      const intents = await Intent.find().lean();

      if (intents.length === 0) {
        return {
          intent: 'fallback',
          confidence: 0,
          entities: [],
        };
      }

      // Calculate similarity scores using multiple methods
      let bestMatch = { intent: 'fallback', confidence: 0, entities: [] };

      for (const intent of intents) {
        const score = await this.calculateSimilarity(normalizedInput, preprocessed.filtered, intent.trainingPhrases);

        if (score > bestMatch.confidence) {
          bestMatch = {
            intent: intent.name,
            confidence: score,
            category: intent.category,
            entities: intent.entities || [],
            responses: intent.responses || [],
          };
        }
      }

      // Apply threshold AFTER finding best match to allow lower thresholds for close matches
      const threshold = 0.45;
      if (bestMatch.confidence < threshold) {
        return {
          intent: 'fallback',
          confidence: bestMatch.confidence,
          entities: [],
          matchedIntent: bestMatch.intent,
        };
      }

      return bestMatch;
    } catch (error) {
      console.error('Intent recognition error:', error);
      return {
        intent: 'error',
        confidence: 0,
        error: error.message,
      };
    }
  }

  /**
   * Extract entities from user input
   */
  async extractEntities(userInput, intent) {
    const entities = {};
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      date: /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{4}\b/g,
      number: /\b\d+\b/g,
      time: /\b\d{1,2}:\d{2}(?::\d{2})?\s?(?:AM|PM|am|pm)?\b/g,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      const matches = userInput.match(pattern);
      if (matches) {
        entities[type] = matches;
      }
    }

    return entities;
  }

  /**
   * Calculate similarity using multiple methods:
   * 1. Direct substring containment (phrase included in input or vice versa)
   * 2. Jaro-Winkler distance for fuzzy string matching
   * 3. Token overlap ratio
   */
  async calculateSimilarity(normalizedInput, filteredTokens, trainingPhrases) {
    let maxScore = 0;

    for (const phrase of trainingPhrases) {
      const normalizedPhrase = phrase.toLowerCase().trim();
      let score = 0;

      // Method 1: Direct substring match (highest weight)
      if (normalizedInput.includes(normalizedPhrase) || normalizedPhrase.includes(normalizedInput)) {
        score = Math.max(score, 0.92);
      }

      // Method 2: Jaro-Winkler distance (good for typos and variations)
      const jwDistance = natural.JaroWinklerDistance(normalizedInput, normalizedPhrase);
      score = Math.max(score, jwDistance * 0.85);

      // Method 3: Token overlap with stemmed/lemmatized tokens
      const phraseTokenizer = new natural.WordTokenizer();
      const phraseTokens = phraseTokenizer.tokenize(normalizedPhrase);
      const stopwords = ['the', 'a', 'is', 'in', 'to', 'of', 'and', 'for', 'on', 'with', 'as', 'at', 'by', 'be', 'this', 'that', 'it', 'i', 'me', 'my', 'you', 'your', 'do', 'does', 'did', 'can', 'could', 'would', 'should', 'will', 'shall', 'have', 'has', 'had'];
      const filteredPhraseTokens = phraseTokens.filter(token => !stopwords.includes(token));
      const filteredInputTokens = filteredTokens.filter(token => !stopwords.includes(token));

      if (filteredPhraseTokens.length > 0 && filteredInputTokens.length > 0) {
        const commonTokens = filteredInputTokens.filter(token =>
          filteredPhraseTokens.includes(token)
        );
        const tokenSimilarity = (commonTokens.length / Math.max(filteredInputTokens.length, filteredPhraseTokens.length));
        score = Math.max(score, tokenSimilarity * 0.8);
      }

      // Method 4: Check if any significant word from phrase appears in input
      if (filteredPhraseTokens.length > 0) {
        const significantWords = filteredPhraseTokens.filter(t => t.length > 3);
        if (significantWords.length > 0) {
          const matchedWords = significantWords.filter(word => normalizedInput.includes(word));
          const wordMatchRatio = matchedWords.length / significantWords.length;
          if (wordMatchRatio >= 0.5) {
            score = Math.max(score, 0.6 + (wordMatchRatio * 0.25));
          }
        }
      }

      maxScore = Math.max(maxScore, score);
    }

    return Math.min(maxScore, 1);
  }
}

class ChatService {
  /**
   * Process user message and generate response
   */
  async processMessage(userId, sessionId, userMessage) {
    const startTime = Date.now();
    try {
      const nlpService = new NLPService();

      // Step 1: Preprocess input
      const preprocessed = await nlpService.preprocessInput(userMessage);

      // Step 2: Recognize intent
      const intentResult = await nlpService.recognizeIntent(userMessage);

      // Step 3: Extract entities
      const entities = await nlpService.extractEntities(userMessage, intentResult.intent);

      // Step 4: Get response
      let response = await this.getResponse(intentResult.intent, entities);

      // Step 5: Log conversation
      const responseTime = Date.now() - startTime;
      await this.logConversation(userId, sessionId, userMessage, response, intentResult, entities, responseTime);

      return {
        success: true,
        response,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        entities,
        sessionId,
      };
    } catch (error) {
      console.error('Message processing error:', error);
      return {
        success: false,
        response: "I'm sorry, I encountered an error. Please try again.",
        error: error.message,
      };
    }
  }

  /**
   * Get response for recognized intent
   */
  async getResponse(intent, entities = {}) {
    try {
      const intentDoc = await Intent.findOne({ name: intent });

      if (!intentDoc || !intentDoc.responses || intentDoc.responses.length === 0) {
        // If we have a fallback intent in DB, use it
        const fallbackIntent = await Intent.findOne({ name: 'fallback' });
        if (fallbackIntent && fallbackIntent.responses && fallbackIntent.responses.length > 0) {
          return fallbackIntent.responses[Math.floor(Math.random() * fallbackIntent.responses.length)];
        }
        return "I'm not sure how to respond to that. Could you please rephrase?";
      }

      // Select random response from available options
      const response = intentDoc.responses[
        Math.floor(Math.random() * intentDoc.responses.length)
      ];

      // Replace variables with extracted entities
      let finalResponse = response;
      for (const [key, value] of Object.entries(entities)) {
        if (Array.isArray(value) && value.length > 0) {
          finalResponse = finalResponse.replace(`{${key}}`, value[0]);
        }
      }

      return finalResponse;
    } catch (error) {
      console.error('Response generation error:', error);
      return "I'm unable to generate a response at the moment.";
    }
  }

  /**
   * Log conversation to database
   */
  async logConversation(userId, sessionId, userMessage, botResponse, intentResult, entities, responseTime) {
    try {
      const conversation = await Conversation.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            messages: [
              {
                type: 'user',
                content: userMessage,
                intent: intentResult.intent,
                entities: Object.keys(entities),
                confidence: intentResult.confidence,
                timestamp: new Date(),
              },
              {
                type: 'bot',
                content: botResponse,
                timestamp: new Date(),
              },
            ],
          },
        },
        { new: true, upsert: true }
      );

      // Log to analytics
      await Analytics.create({
        sessionId,
        userId,
        intent: intentResult.intent,
        botResponse,
        responseTime: responseTime || 0,
        timestamp: new Date(),
        success: intentResult.confidence > 0.5,
        channel: 'web',
      });
    } catch (error) {
      console.error('Conversation logging error:', error);
    }
  }
}

module.exports = {
  NLPService,
  ChatService,
};

