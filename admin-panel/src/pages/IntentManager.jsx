import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const IntentManager = () => {
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    trainingPhrases: [],
    responses: [],
    entities: [],
    confidence_threshold: 0.7,
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/intents`);
      setIntents(response.data.intents);
    } catch (error) {
      console.error('Error fetching intents:', error);
      toast.error('Failed to load intents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/admin/intents/${editingId}`, formData);
        toast.success('Intent updated successfully');
      } else {
        await axios.post(`${API_URL}/admin/intents`, formData);
        toast.success('Intent created successfully');
      }
      fetchIntents();
      resetForm();
    } catch (error) {
      console.error('Error saving intent:', error);
      toast.error('Failed to save intent');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/admin/intents/${id}`);
        toast.success('Intent deleted successfully');
        fetchIntents();
      } catch (error) {
        console.error('Error deleting intent:', error);
        toast.error('Failed to delete intent');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      trainingPhrases: [],
      responses: [],
      entities: [],
      confidence_threshold: 0.7,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="intent-manager">
      <h1>Intent Management</h1>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <FiPlus /> Create New Intent
        </button>
      ) : (
        <form onSubmit={handleCreateOrUpdate} className="intent-form">
          <div className="form-group">
            <label>Intent Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Training Phrases (comma-separated)</label>
            <textarea
              value={formData.trainingPhrases.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                trainingPhrases: e.target.value.split(',').map(p => p.trim())
              })}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Responses (comma-separated)</label>
            <textarea
              value={formData.responses.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                responses: e.target.value.split(',').map(r => r.trim())
              })}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Confidence Threshold</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={formData.confidence_threshold}
              onChange={(e) => setFormData({
                ...formData,
                confidence_threshold: parseFloat(e.target.value)
              })}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              <FiSave /> Save Intent
            </button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="intents-list">
        {intents.map((intent) => (
          <div key={intent._id} className="intent-card">
            <div className="intent-header">
              <h3>{intent.name}</h3>
              <span className="category">{intent.category}</span>
            </div>
            <p className="intent-phrases">
              Phrases: {intent.trainingPhrases.join(', ').substring(0, 100)}...
            </p>
            <div className="intent-actions">
              <button
                onClick={() => {
                  setFormData(intent);
                  setEditingId(intent._id);
                  setShowForm(true);
                }}
                className="btn btn-small btn-info"
              >
                <FiEdit2 /> Edit
              </button>
              <button
                onClick={() => handleDelete(intent._id)}
                className="btn btn-small btn-danger"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .intent-manager {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .intent-manager h1 {
          margin-bottom: 20px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #667eea;
          color: white;
          margin-bottom: 20px;
        }

        .btn-primary:hover {
          background: #5568d3;
        }

        .intent-form {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-success {
          background: #56ab2f;
          color: white;
        }

        .btn-secondary {
          background: #ddd;
          color: #333;
        }

        .intents-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .intent-card {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .intent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .intent-header h3 {
          margin: 0;
          color: #333;
        }

        .category {
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
        }

        .intent-phrases {
          color: #666;
          font-size: 13px;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .intent-actions {
          display: flex;
          gap: 8px;
        }

        .btn-small {
          padding: 6px 12px;
          font-size: 12px;
        }

        .btn-info {
          background: #667eea;
          color: white;
        }

        .btn-danger {
          background: #ff6b6b;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default IntentManager;
