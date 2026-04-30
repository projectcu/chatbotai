// Enhanced training data for intent and entity recognition
module.exports = {
  intents: [
    {
      id: "intent_001",
      name: "greeting",
      category: "engagement",
      trainingPhrases: [
        "Hello",
        "Hi there",
        "Hey",
        "Good morning",
        "Good afternoon",
        "Good evening",
        "What's up",
        "How are you",
        "Howdy",
        "Hey there",
        "Greetings",
        "Welcome",
        "Hi bot",
        "Hey assistant",
        "Hello there",
        "Hiya",
        "Yo",
        "Sup"
      ],
      responses: [
        "Hello! How can I help you today?",
        "Hi there! What can I do for you?",
        "Hey! How are you doing?",
        "Welcome! What brings you here today?",
        "Hi! What can I assist you with?"
      ],
      entities: ["greeting_type"],
      confidence_threshold: 0.6,
      examples: 50
    },
    {
      id: "intent_002",
      name: "appointment_booking",
      category: "service",
      trainingPhrases: [
        "I want to book an appointment",
        "Can I schedule a meeting",
        "I need to book a slot",
        "Schedule a consultation",
        "Book me an appointment",
        "I want to schedule a call",
        "Can you help me book something",
        "Make an appointment for me",
        "I'd like to schedule a time",
        "Set up a meeting",
        "Book a demo",
        "I want to book a session",
        "Can I reserve a time",
        "Schedule an appointment for tomorrow",
        "I need to set up a call"
      ],
      responses: [
        "I'd be happy to help you book an appointment! What date works best for you?",
        "Sure! Let me help you schedule that. When would you like to meet?",
        "Great! I can help with that. What date and time do you prefer?",
        "I'll help you book an appointment. What time slot works for you?"
      ],
      entities: ["date", "time", "service_type"],
      confidence_threshold: 0.7,
      examples: 45
    },
    {
      id: "intent_003",
      name: "support_request",
      category: "support",
      trainingPhrases: [
        "I need help with my account",
        "I have a problem",
        "Can you help me",
        "I need technical support",
        "I'm having an issue",
        "Something's not working",
        "I need assistance",
        "Can you troubleshoot this",
        "I'm stuck",
        "Help me with this",
        "I need you to do something for me",
        "Can you do something for me",
        "I need a favor",
        "Please help me out",
        "I have an issue to resolve",
        "Something is broken",
        "I need guidance"
      ],
      responses: [
        "I'm here to help! Can you describe what issue you're facing?",
        "Of course! I'll do my best to assist you. What's the problem?",
        "I'm sorry you're having trouble. Let me help you resolve this.",
        "I'd be happy to help. Can you tell me more about the issue?"
      ],
      entities: ["issue_type", "affected_service"],
      confidence_threshold: 0.7,
      examples: 40
    },
    {
      id: "intent_004",
      name: "complaint",
      category: "support",
      trainingPhrases: [
        "I want to file a complaint",
        "This is unacceptable",
        "I'm not satisfied",
        "This service is poor",
        "I want to speak to a manager",
        "I'm very upset",
        "This is terrible",
        "I have a complaint",
        "This product is broken",
        "I want to escalate this",
        "I am disappointed",
        "This is frustrating",
        "I want to report an issue",
        "Your service is bad"
      ],
      responses: [
        "I'm sincerely sorry you're experiencing this. Let me escalate this to our team.",
        "Thank you for bringing this to our attention. I'll make sure this is addressed.",
        "I apologize for the inconvenience. Let me connect you with a manager.",
        "I understand your frustration. Let me help resolve this for you."
      ],
      entities: ["complaint_type", "affected_area"],
      confidence_threshold: 0.75,
      examples: 35
    },
    {
      id: "intent_005",
      name: "question",
      category: "information",
      trainingPhrases: [
        "How does this work",
        "Can you explain",
        "What is this",
        "Tell me more about",
        "Do you have information about",
        "What's the process",
        "How do I use this",
        "Can you provide details",
        "What are the options",
        "How much does it cost",
        "Can you walk me through this",
        "I want to learn more",
        "Explain how this works",
        "What are the steps"
      ],
      responses: [
        "I'd be happy to explain! Here's what you need to know...",
        "Sure! Let me provide you with the details.",
        "Great question! Here's the information you're looking for.",
        "Let me walk you through how this works."
      ],
      entities: ["topic", "question_type"],
      confidence_threshold: 0.7,
      examples: 38
    },
    {
      id: "intent_006",
      name: "order_status",
      category: "order",
      trainingPhrases: [
        "Where's my order",
        "What's the status of my delivery",
        "Track my package",
        "When will my order arrive",
        "Has my order shipped",
        "Can you check my order",
        "I want to know about my shipment",
        "Is my order on the way",
        "Order tracking",
        "Where is my package",
        "Delivery status",
        "My order hasn't arrived"
      ],
      responses: [
        "Let me check your order status for you. Can you provide your order number?",
        "I'll look up your order. What's your order ID?",
        "Sure! Let me track that for you. Order number please?"
      ],
      entities: ["order_id"],
      confidence_threshold: 0.7,
      examples: 25
    },
    {
      id: "intent_007",
      name: "billing_inquiry",
      category: "billing",
      trainingPhrases: [
        "I have a billing question",
        "Can you explain my charges",
        "Why was I charged",
        "What's this charge",
        "I have a payment issue",
        "Can I get an invoice",
        "How do I pay my bill",
        "What are the payment options",
        "My bill looks wrong",
        "I need help with payment"
      ],
      responses: [
        "I can help with your billing question. What specifically would you like to know?",
        "Let me assist you with your billing. What's your concern?",
        "I'm here to help with billing. Can you provide more details?"
      ],
      entities: ["charge_amount", "invoice_id"],
      confidence_threshold: 0.7,
      examples: 20
    },
    {
      id: "intent_008",
      name: "goodbye",
      category: "engagement",
      trainingPhrases: [
        "Bye",
        "Goodbye",
        "See you",
        "See you later",
        "Talk to you later",
        "Bye for now",
        "Take care",
        "Farewell",
        "See you soon",
        "Thanks and bye",
        "Catch you later",
        "Have a good day",
        "Peace out",
        "Later"
      ],
      responses: [
        "Goodbye! Have a great day!",
        "See you later!",
        "Thank you for visiting. Come back soon!",
        "Bye! Take care!"
      ],
      entities: [],
      confidence_threshold: 0.6,
      examples: 30
    },
    {
      id: "intent_009",
      name: "product_inquiry",
      category: "products",
      trainingPhrases: [
        "What products do you have",
        "Tell me about your products",
        "Do you sell",
        "What do you offer",
        "Show me your catalog",
        "What are your features",
        "Do you have in stock",
        "Product availability",
        "Do you know about azure",
        "What services do you provide",
        "Tell me about your software",
        "What solutions do you offer",
        "Do you have cloud services",
        "What platforms do you support",
        "Can you tell me about your offerings"
      ],
      responses: [
        "We have a great selection of products and services. What are you interested in?",
        "Let me help you find what you're looking for.",
        "What type of product or service are you interested in?"
      ],
      entities: ["product_name", "product_category"],
      confidence_threshold: 0.7,
      examples: 22
    },
    {
      id: "intent_010",
      name: "refund_request",
      category: "service",
      trainingPhrases: [
        "I want a refund",
        "Can I return this",
        "What's your return policy",
        "I want my money back",
        "Can I exchange this",
        "How do I get a refund",
        "I need to return something",
        "What's the refund process",
        "I am not happy with my purchase",
        "This item is defective"
      ],
      responses: [
        "I understand. Let me help you with your refund request.",
        "I can assist with that. Can you provide your order details?",
        "Sure, I'll guide you through our return process."
      ],
      entities: ["order_id", "return_reason"],
      confidence_threshold: 0.75,
      examples: 18
    },
    {
      id: "intent_011",
      name: "bot_info",
      category: "engagement",
      trainingPhrases: [
        "What is your name",
        "Who are you",
        "Tell me about yourself",
        "What can you do",
        "Are you a bot",
        "What are your capabilities",
        "How do you work",
        "Are you human",
        "What is your purpose",
        "Introduce yourself",
        "Tell me more about you",
        "What kind of assistant are you",
        "Are you an AI",
        "What do you do"
      ],
      responses: [
        "I'm an AI-powered chatbot assistant designed to help you with questions, support requests, appointments, and more!",
        "I'm your virtual assistant! I can help with product inquiries, order tracking, booking appointments, and answering questions.",
        "Hello! I'm an intelligent chatbot here to assist you with our services. What can I help you with today?",
        "I'm an AI assistant built to make your experience smoother. I can help with support, orders, billing, and scheduling."
      ],
      entities: [],
      confidence_threshold: 0.6,
      examples: 25
    },
    {
      id: "intent_012",
      name: "connect_agent",
      category: "support",
      trainingPhrases: [
        "Connect me to an agent",
        "I want to talk to a human",
        "Transfer me to a person",
        "Let me speak to someone",
        "I need a real person",
        "Can I chat with an agent",
        "Human support please",
        "Talk to a representative",
        "I want to speak with customer service",
        "Get me an agent"
      ],
      responses: [
        "I'll connect you to a live agent right away. Please hold on...",
        "Sure! Let me transfer you to one of our support agents.",
        "Connecting you to a human agent now. They'll be with you shortly."
      ],
      entities: [],
      confidence_threshold: 0.7,
      examples: 20
    },
    {
      id: "intent_013",
      name: "gratitude",
      category: "engagement",
      trainingPhrases: [
        "Thank you",
        "Thanks",
        "Thanks a lot",
        "Thank you so much",
        "I appreciate it",
        "Thanks for your help",
        "Much appreciated",
        "Thank you very much",
        "Thanks again",
        "You are helpful"
      ],
      responses: [
        "You're very welcome! I'm glad I could help.",
        "Happy to help! Let me know if you need anything else.",
        "Anytime! Is there anything else I can assist you with?",
        "You're welcome! Feel free to ask if you have more questions."
      ],
      entities: [],
      confidence_threshold: 0.6,
      examples: 20
    },
    {
      id: "intent_014",
      name: "affirmation",
      category: "engagement",
      trainingPhrases: [
        "Yes",
        "Yeah",
        "Sure",
        "Okay",
        "Alright",
        "That sounds good",
        "Fine",
        "Cool",
        "Absolutely",
        "Definitely",
        "Of course",
        "Sure thing"
      ],
      responses: [
        "Great! Let me proceed with that.",
        "Perfect! I'll help you with that right away.",
        "Awesome! Let's get started."
      ],
      entities: [],
      confidence_threshold: 0.55,
      examples: 18
    },
    {
      id: "intent_015",
      name: "negation",
      category: "engagement",
      trainingPhrases: [
        "No",
        "Nope",
        "No thanks",
        "Not right now",
        "Maybe later",
        "I don't think so",
        "Not really",
        "No way",
        "Never mind",
        "Forget it"
      ],
      responses: [
        "No problem! Is there anything else I can help you with?",
        "Alright, let me know if you change your mind.",
        "Understood. Feel free to ask if you need help with something else."
      ],
      entities: [],
      confidence_threshold: 0.55,
      examples: 15
    },
    {
      id: "intent_016",
      name: "fallback",
      category: "system",
      trainingPhrases: [
        "food",
        "weather",
        "news",
        "joke",
        "random",
        "anything",
        "whatever",
        "xyz",
        "asdf",
        "something else"
      ],
      responses: [
        "I'm not sure I understood that. Can you rephrase?",
        "I didn't quite catch that. Could you say that differently?",
        "I'm having trouble understanding. Can you provide more details?",
        "I'm not familiar with that. Can you tell me more?",
        "Let me connect you with an agent who might be able to help better."
      ],
      entities: [],
      confidence_threshold: 0.4,
      examples: 10
    }
  ],

  entities: [
    {
      id: "entity_date",
      name: "date",
      type: "temporal",
      pattern: /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b|\b(tomorrow|today|next week|next month|january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
      examples: ["tomorrow", "2024-04-29", "April 29", "next Monday"]
    },
    {
      id: "entity_time",
      name: "time",
      type: "temporal",
      pattern: /\b\d{1,2}:\d{2}(?::\d{2})?\s?(?:AM|PM|am|pm)?\b|\b(morning|afternoon|evening|midnight|noon)\b/i,
      examples: ["3 PM", "15:00", "2:30 PM", "this morning"]
    },
    {
      id: "entity_email",
      name: "email",
      type: "contact",
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      examples: ["user@example.com", "john.doe@company.org"]
    },
    {
      id: "entity_phone",
      name: "phone",
      type: "contact",
      pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\d{10}\b|\+\d{1,3}\s?\d{1,14}\b/,
      examples: ["555-123-4567", "(555) 123-4567", "+1-555-123-4567"]
    },
    {
      id: "entity_number",
      name: "number",
      type: "quantity",
      pattern: /\b\d+(?:\.\d+)?\b/,
      examples: ["42", "3.14", "1000"]
    },
    {
      id: "entity_currency",
      name: "currency",
      type: "monetary",
      pattern: /[$€£¥₹]\s?\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s?(?:USD|EUR|GBP|INR)/i,
      examples: ["$100", "€50.99", "100 USD"]
    },
    {
      id: "entity_location",
      name: "location",
      type: "place",
      pattern: /\b(?:city|street|address|location|place)\b/i,
      examples: ["New York", "123 Main Street", "California"]
    },
    {
      id: "entity_order_id",
      name: "order_id",
      type: "identifier",
      pattern: /\b(?:order|order#|#|id|reference)[\s#]*([A-Z0-9-]{5,})\b/i,
      examples: ["ORDER-123456", "#ORD-789"]
    }
  ],

  fallbackResponses: [
    "I'm not sure I understood that. Can you rephrase?",
    "I didn't quite catch that. Could you say that differently?",
    "I'm having trouble understanding. Can you provide more details?",
    "I'm not familiar with that. Can you tell me more?",
    "Let me connect you with an agent who might be able to help better."
  ],

  clarificationQuestions: [
    "Can you provide more details about what you need?",
    "Could you clarify what you're asking?",
    "I want to make sure I understand correctly. Did you mean...?",
    "Let me confirm - are you asking about...?"
  ]
};
