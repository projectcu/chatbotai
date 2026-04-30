import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const IntentTester = () => {
  const [testMessage, setTestMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleTest = async (e) => {
    e.preventDefault();
    if (!testMessage.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/test-intent`, {
        message: testMessage,
      });
      setResult(response.data.result);
      toast.success('Test completed');
    } catch (error) {
      console.error('Error testing intent:', error);
      toast.error('Failed to test intent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intent-tester">
      <h1>Intent Recognition Tester</h1>

      <form onSubmit={handleTest} className="test-form">
        <div className="form-group">
          <label>Enter a test message:</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="e.g., 'I want to book an appointment tomorrow'"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Testing...' : 'Test Intent'}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <div className="result-card">
            <h2>Recognition Result</h2>
            <div className="result-item">
              <span className="label">Detected Intent:</span>
              <span className="value">{result.intent}</span>
            </div>
            <div className="result-item">
              <span className="label">Confidence:</span>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="percentage">{(result.confidence * 100).toFixed(1)}%</span>
            </div>

            {result.entities && Object.keys(result.entities).length > 0 && (
              <div className="result-item">
                <span className="label">Extracted Entities:</span>
                <div className="entities-list">
                  {Object.entries(result.entities).map(([key, values]) => (
                    <div key={key} className="entity">
                      <strong>{key}:</strong> {Array.isArray(values) ? values.join(', ') : values}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .intent-tester {
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }

        .intent-tester h1 {
          margin-bottom: 30px;
        }

        .test-form {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn {
          padding: 10px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn:hover:not(:disabled) {
          background: #5568d3;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .result-container {
          margin-bottom: 30px;
        }

        .result-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .result-card h2 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 18px;
        }

        .result-item {
          margin-bottom: 16px;
        }

        .label {
          display: block;
          font-weight: 500;
          color: #666;
          margin-bottom: 8px;
        }

        .value {
          display: inline-block;
          background: #f0f0f0;
          padding: 6px 12px;
          border-radius: 4px;
          color: #333;
          font-weight: 600;
        }

        .confidence-bar {
          width: 100%;
          height: 20px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #56ab2f, #a8e063);
          transition: width 0.3s ease;
        }

        .percentage {
          font-weight: 600;
          color: #667eea;
        }

        .entities-list {
          background: #f9f9f9;
          padding: 12px;
          border-radius: 4px;
          border-left: 4px solid #667eea;
        }

        .entity {
          padding: 6px 0;
          color: #333;
          font-size: 13px;
        }

        .entity strong {
          color: #667eea;
        }
      `}</style>
    </div>
  );
};

export default IntentTester;
