import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiTrendingUp, FiUsers, FiMessageCircle, FiSmile } from 'react-icons/fi';

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [summaryRes, trendsRes, ratingsRes] = await Promise.all([
        axios.get(`${API_URL}/analytics/summary`),
        axios.get(`${API_URL}/analytics/trends?period=7`),
        axios.get(`${API_URL}/analytics/user-ratings`),
      ]);

      setSummary(summaryRes.data.summary);
      setTrends(trendsRes.data.trends);
      setRatings(ratingsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`stat-card ${color}`}>
      <Icon size={24} />
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h1>Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Conversations"
          value={summary?.totalConversations || 0}
          icon={FiMessageCircle}
          color="blue"
        />
        <StatCard
          title="Success Rate"
          value={`${summary?.successRate || 0}%`}
          icon={FiTrendingUp}
          color="green"
        />
        <StatCard
          title="Avg Response Time"
          value={`${summary?.avgResponseTime || 0}ms`}
          icon={FiUsers}
          color="purple"
        />
        <StatCard
          title="User Satisfaction"
          value={`${ratings?.averageRating || 0}/5`}
          icon={FiSmile}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Trend Chart */}
        <div className="chart-container">
          <h2>Conversation Trends (7 days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="conversations"
                stroke="#667eea"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="successRate"
                stroke="#764ba2"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Intents Chart */}
        <div className="chart-container">
          <h2>Top Intents</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary?.topIntents || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="intent" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Ratings Distribution */}
        <div className="chart-container">
          <h2>User Satisfaction Ratings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: '1 Star', value: ratings?.distribution['1'] || 0 },
                  { name: '2 Stars', value: ratings?.distribution['2'] || 0 },
                  { name: '3 Stars', value: ratings?.distribution['3'] || 0 },
                  { name: '4 Stars', value: ratings?.distribution['4'] || 0 },
                  { name: '5 Stars', value: ratings?.distribution['5'] || 0 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#ff6b6b" />
                <Cell fill="#ffa94d" />
                <Cell fill="#ffd93d" />
                <Cell fill="#95e1d3" />
                <Cell fill="#667eea" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .analytics-dashboard {
          padding: 40px 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .analytics-dashboard h1 {
          margin-bottom: 30px;
          color: #333;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          padding: 20px;
          border-radius: 8px;
          color: white;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .stat-card.blue {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .stat-card.green {
          background: linear-gradient(135deg, #56ab2f, #a8e063);
        }

        .stat-card.purple {
          background: linear-gradient(135deg, #7b2ff7, #f107f1);
        }

        .stat-card.yellow {
          background: linear-gradient(135deg, #f5af19, #f12711);
        }

        .stat-card p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .stat-card h3 {
          margin: 5px 0 0 0;
          font-size: 28px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .chart-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chart-container h2 {
          margin: 0 0 20px 0;
          font-size: 18px;
          color: #333;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 18px;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
