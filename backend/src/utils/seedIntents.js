/**
 * Seed script to populate initial intents into MongoDB
 * Run automatically on server startup in development mode
 */
const { Intent } = require('../models');
const trainingData = require('../nlp/trainingData');

/**
 * Seed intents from trainingData.js into the database
 * Updates existing intents if training phrases or responses changed
 */
async function seedIntents() {
  try {
    console.log('🌱 Checking for intent data...');

    const existingIntents = await Intent.find().lean();
    const existingNames = new Set(existingIntents.map(i => i.name));

    let created = 0;
    let updated = 0;

    for (const intent of trainingData.intents) {
      const intentData = {
        name: intent.name,
        category: intent.category,
        trainingPhrases: intent.trainingPhrases,
        responses: intent.responses,
        entities: intent.entities || [],
        confidence_threshold: intent.confidence_threshold || 0.7,
      };

      if (existingNames.has(intent.name)) {
        // Update existing intent
        await Intent.findOneAndUpdate(
          { name: intent.name },
          intentData,
          { new: true }
        );
        updated++;
      } else {
        // Create new intent
        await Intent.create(intentData);
        created++;
      }
    }

    if (created > 0 || updated > 0) {
      console.log(`✅ Seeded ${created} new intents, updated ${updated} existing intents`);
    } else {
      console.log(`✅ ${existingIntents.length} intents already up to date`);
    }
  } catch (error) {
    console.error('❌ Error seeding intents:', error.message);
  }
}

module.exports = { seedIntents };
