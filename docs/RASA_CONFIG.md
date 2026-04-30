# Rasa Configuration for NLP

## Rasa NLU Configuration (config.yml)

```yaml
recipe: default.v1
language: en

pipeline:
  - name: WhitespaceTokenizer
  - name: RegexFeaturizer
  - name: LexicalSyntacticFeaturizer
  - name: CountVectorsFeaturizer
    analyzer: char_wb
    min_ngram: 1
    max_ngram: 4
  - name: CountVectorsFeaturizer
  - name: DIETClassifier
    epochs: 100
    constrain_similarities: true
  - name: EntitySynonymMapper
  - name: ResponseSelector
    epochs: 100
    constrain_similarities: true
  - name: FallbackClassifier
    threshold: 0.3
    ambiguity_threshold: 0.1

policies:
  - name: MemoizationPolicy
  - name: TEDPolicy
    max_history: 5
    epochs: 20
    constrain_similarities: true
  - name: FallbackPolicy
    nlu_threshold: 0.4
    core_threshold: 0.3
    fallback_action_name: action_default_fallback
  - name: FormPolicy

tracker_store:
  type: mongod
  host: localhost
  port: 27017
  db: rasa_tracker
  username: ''
  password: ''

event_broker:
  type: pika
  host: localhost
  port: 5672
  queues: [rasa_events]
```

## Training Data (nlu.yml)

```yaml
version: "3.1"

nlu:
# Greeting Intent
- intent: greet
  examples: |
    - hey
    - hello
    - hi
    - good morning
    - good evening
    - moin
    - welcome
    - howdy
    - hey there
    - what's up
    - greetings

# Goodbye Intent
- intent: goodbye
  examples: |
    - bye
    - goodbye
    - see you around
    - see you later
    - see you soon
    - talk to you later
    - thanks goodbye
    - have a good day
    - thank you and goodbye
    - ok bye

# Affirm Intent
- intent: affirm
  examples: |
    - yes
    - indeed
    - of course
    - that sounds good
    - correct
    - absolutely
    - you're right
    - that's right
    - ok
    - okay

# Deny Intent
- intent: deny
  examples: |
    - no
    - never
    - I don't think so
    - don't like that
    - no way
    - not really
    - nah
    - I don't want that

# Appointment Booking Intent
- intent: appointment_booking
  examples: |
    - I need to book an appointment
    - Can I schedule a meeting
    - I want to book a slot
    - I need to schedule a call
    - I want to book a consultation
    - Can you help me schedule something
    - I'd like to make an appointment
    - Book me in for an appointment

# Support Request Intent
- intent: support_request
  examples: |
    - I need help with my account
    - I have a problem with my order
    - Can you help me with something
    - I need technical support
    - I'm having an issue
    - Something's broken
    - I need assistance
    - Can you help me

# Complaint Intent
- intent: complaint
  examples: |
    - This is terrible
    - I'm very upset
    - I want to complain
    - This service is bad
    - I'm not satisfied
    - This product is broken
    - I want to speak to a manager
    - Your service is poor

# Question Intent
- intent: question
  examples: |
    - How does this work
    - Can you explain
    - What is this
    - How do I use this
    - Tell me more about
    - What's the price
    - Do you have information about

# Fallback Intent
- intent: fallback
  examples: |
    - I don't understand
    - Could you repeat that
    - What did you say
    - I didn't catch that

# Entity Examples
- intent: appointment_booking
  entities:
    - date
    - time
  examples: |
    - I want to book for [tomorrow](date) at [3 PM](time)
    - Can I schedule for [next Monday](date) at [2:30 PM](time)
    - Book an appointment for [April 29](date) at [10 AM](time)
    - I need [Friday](date) at [4 PM](time)

entities:
  - date
  - time
  - name
  - phone
  - email
  - location
```

## Dialogue Flow (stories.yml)

```yaml
version: "3.1"

stories:
- story: happy path appointment
  steps:
    - intent: greet
    - action: utter_greet
    - intent: appointment_booking
    - action: action_ask_date
    - intent: inform
      entities:
        - date
    - action: action_ask_time
    - intent: inform
      entities:
        - time
    - action: action_confirm_appointment
    - intent: affirm
    - action: utter_appointment_confirmed
    - intent: goodbye
    - action: utter_goodbye

- story: sad path appointment
  steps:
    - intent: greet
    - action: utter_greet
    - intent: appointment_booking
    - action: action_ask_date
    - intent: deny
    - action: utter_ask_help_else

- story: complaint escalation
  steps:
    - intent: greet
    - action: utter_greet
    - intent: complaint
    - action: utter_sorry
    - action: action_escalate_to_agent

- story: support request
  steps:
    - intent: support_request
    - action: action_check_issue
    - action: utter_help_provided

- story: goodbye
  steps:
    - intent: goodbye
    - action: utter_goodbye
```

## Domain File (domain.yml)

```yaml
version: "3.1"

intents:
  - greet
  - goodbye
  - affirm
  - deny
  - appointment_booking
  - support_request
  - complaint
  - question
  - fallback

entities:
  - date
  - time
  - name
  - phone
  - email
  - location

slots:
  appointment_date:
    type: text
  appointment_time:
    type: text
  user_name:
    type: text
  user_email:
    type: text
  user_phone:
    type: text

responses:
  utter_greet:
    - text: "Hey! How can I help you today?"
    - text: "Hello! What can I do for you?"

  utter_goodbye:
    - text: "Bye! Have a great day!"
    - text: "See you later!"

  utter_appointment_confirmed:
    - text: "Great! Your appointment has been confirmed."
    - text: "Perfect! I've scheduled your appointment."

  utter_sorry:
    - text: "I'm really sorry to hear that. Let me help you."

  utter_ask_help_else:
    - text: "Is there anything else I can help you with?"

  utter_help_provided:
    - text: "I hope I've been helpful!"

actions:
  - action_ask_date
  - action_ask_time
  - action_confirm_appointment
  - action_check_issue
  - action_escalate_to_agent
```

## Setup Instructions

### Installation

```bash
# Install Rasa
pip install rasa

# Create a new project
rasa init

# Train the NLU model
rasa train nlu

# Train the dialogue model
rasa train

# Start Rasa server
rasa run --enable-api
```

### Running Rasa

```bash
# Start NLU server on port 5000
rasa run nlu -m models/nlu-latest/ --port 5000

# Start Core dialogue server on port 5005
rasa run --port 5005 --enable-api

# Start shell for testing
rasa shell
```

### Integration with Backend

```python
import requests

def send_message_to_rasa(message, sender_id):
    """Send message to Rasa NLU server"""
    response = requests.post(
        "http://localhost:5000/model/parse",
        json={"text": message}
    )
    return response.json()

def get_rasa_response(message, sender_id):
    """Get bot response from Rasa Core"""
    response = requests.post(
        "http://localhost:5005/webhooks/rest/webhook",
        json={"message": message, "sender": sender_id}
    )
    return response.json()
```

---

**Last Updated**: April 28, 2026
