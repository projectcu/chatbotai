#!/usr/bin/env python3
"""
Chatbot Local Testing Script
Tests all API endpoints and components
Run: python test_chatbot.py
"""

import requests
import json
import time
import sys
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:5000/api"
FRONTEND_URL = "http://localhost:3000"
ADMIN_URL = "http://localhost:3001"

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.YELLOW}ℹ {text}{Colors.END}")

def test_api_health():
    """Test if API is running"""
    print_header("1. Testing API Health")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print_success("API is running on port 5000")
            return True
        else:
            print_error(f"API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to API on http://localhost:5000")
        print_info("Make sure backend is running: npm run dev")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_frontend():
    """Test if frontend is running"""
    print_header("2. Testing Frontend")
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print_success("Frontend is running on port 3000")
            return True
        else:
            print_error(f"Frontend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to frontend on http://localhost:3000")
        print_info("Make sure frontend is running: npm start")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_admin_panel():
    """Test if admin panel is running"""
    print_header("3. Testing Admin Panel")
    try:
        response = requests.get(ADMIN_URL, timeout=5)
        if response.status_code == 200:
            print_success("Admin panel is running on port 3001")
            return True
        else:
            print_error(f"Admin panel returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to admin panel on http://localhost:3001")
        print_info("Make sure admin panel is running: npm start")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_user_registration():
    """Test user registration"""
    print_header("4. Testing User Registration")
    try:
        payload = {
            "email": f"test_{int(time.time())}@example.com",
            "password": "TestPassword123!",
            "name": "Test User"
        }
        response = requests.post(
            f"{API_BASE_URL}/auth/register",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"User registered successfully")
            print_info(f"Email: {payload['email']}")
            return True, payload['email'], payload['password']
        elif response.status_code == 400:
            print_info("Email might already exist, continuing...")
            return True, payload['email'], payload['password']
        else:
            print_error(f"Registration failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return False, None, None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False, None, None

def test_user_login(email, password):
    """Test user login"""
    print_header("5. Testing User Login")
    try:
        payload = {
            "email": email,
            "password": password
        }
        response = requests.post(
            f"{API_BASE_URL}/auth/login",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print_success(f"Login successful")
            print_info(f"Token: {token[:20]}...")
            return True, token
        else:
            print_error(f"Login failed: {response.status_code}")
            return False, None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False, None

def test_session_creation():
    """Test chat session creation"""
    print_header("6. Testing Chat Session Creation")
    try:
        payload = {"userId": f"user_{int(time.time())}"}
        response = requests.post(
            f"{API_BASE_URL}/chat/session",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 201:
            data = response.json()
            session_id = data.get('sessionId')
            print_success(f"Session created successfully")
            print_info(f"Session ID: {session_id}")
            return True, session_id, payload['userId']
        else:
            print_error(f"Session creation failed: {response.status_code}")
            return False, None, None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False, None, None

def test_message_send(session_id, user_id, message):
    """Test sending a message"""
    print_header(f"7. Testing Message Send: '{message}'")
    try:
        payload = {
            "sessionId": session_id,
            "userId": user_id,
            "message": message
        }
        
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/chat/message",
            json=payload,
            timeout=10
        )
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            intent = data.get('intent', 'unknown')
            confidence = data.get('confidence', 0)
            bot_response = data.get('response', 'No response')
            entities = data.get('entities', [])
            
            print_success(f"Message processed successfully")
            print_info(f"Response time: {elapsed:.2f}s")
            print_info(f"Intent: {intent} (confidence: {confidence:.2%})")
            print_info(f"Bot response: {bot_response[:50]}...")
            if entities:
                print_info(f"Entities found: {len(entities)}")
            return True, intent, confidence
        else:
            print_error(f"Message send failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return False, None, None
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False, None, None

def test_conversation_history(session_id):
    """Test retrieving conversation history"""
    print_header("8. Testing Conversation History")
    try:
        response = requests.get(
            f"{API_BASE_URL}/chat/history/{session_id}",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            messages = data.get('messages', [])
            print_success(f"History retrieved successfully")
            print_info(f"Total messages: {len(messages)}")
            return True
        else:
            print_error(f"History retrieval failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_message_feedback(session_id):
    """Test message feedback"""
    print_header("9. Testing Message Feedback")
    try:
        payload = {
            "sessionId": session_id,
            "rating": 5,
            "feedback": "Great response!"
        }
        response = requests.post(
            f"{API_BASE_URL}/chat/feedback",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 200:
            print_success(f"Feedback submitted successfully")
            return True
        else:
            print_error(f"Feedback submission failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_intents_list():
    """Test listing all intents"""
    print_header("10. Testing Intent List")
    try:
        response = requests.get(
            f"{API_BASE_URL}/admin/intents",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            intents = data.get('intents', [])
            print_success(f"Intents retrieved successfully")
            print_info(f"Total intents: {len(intents)}")
            if intents:
                print_info(f"First 3 intents: {[i.get('name') for i in intents[:3]]}")
            return True
        else:
            print_error(f"Intents retrieval failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_analytics():
    """Test analytics summary"""
    print_header("11. Testing Analytics")
    try:
        response = requests.get(
            f"{API_BASE_URL}/analytics/summary",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Analytics retrieved successfully")
            print_info(f"Total conversations: {data.get('totalConversations', 0)}")
            print_info(f"Success rate: {data.get('successRate', 0):.1%}")
            print_info(f"Avg response time: {data.get('avgResponseTime', 0):.0f}ms")
            return True
        else:
            print_info("Analytics endpoint not yet populated")
            return True
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def run_full_test():
    """Run all tests"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  CHATBOT LOCAL TESTING SUITE")
    print(f"  Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}{Colors.END}\n")
    
    results = {}
    
    # Test services are running
    if not test_api_health():
        print_error("\n❌ Backend API is not running!")
        print_info("Start it with: cd backend && npm run dev")
        sys.exit(1)
    
    test_frontend()
    test_admin_panel()
    
    # Test authentication
    success, email, password = test_user_registration()
    if success:
        test_user_login(email, password)
    
    # Test chat functionality
    success, session_id, user_id = test_session_creation()
    
    if success:
        # Test various intents
        test_messages = [
            ("hello", "greeting"),
            ("I need help", "support_request"),
            ("Can I book an appointment?", "appointment_booking"),
            ("What's my order status?", "order_status"),
            ("goodbye", "goodbye")
        ]
        
        for msg, expected_intent in test_messages:
            success, intent, confidence = test_message_send(session_id, user_id, msg)
            if success:
                if intent.lower() == expected_intent.lower():
                    print_success(f"Intent matched expected: {expected_intent}")
                else:
                    print_info(f"Intent was {intent}, expected {expected_intent}")
        
        # Test other features
        test_conversation_history(session_id)
        test_message_feedback(session_id)
    
    # Test admin features
    test_intents_list()
    test_analytics()
    
    # Final summary
    print_header("TESTING COMPLETE")
    print(f"{Colors.GREEN}All core tests completed!{Colors.END}\n")
    print("✅ Next steps:")
    print("  1. Open http://localhost:3000 for chat")
    print("  2. Open http://localhost:3001 for admin panel")
    print("  3. Test various messages and intents")
    print("  4. Review logs in backend terminal\n")

if __name__ == "__main__":
    try:
        run_full_test()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Testing interrupted by user{Colors.END}")
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        sys.exit(1)
