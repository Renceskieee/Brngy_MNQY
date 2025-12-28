import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/style/HomeAdmin.css';

const API_URL = '/api';

function HomeAdmin() {
  const [residentCount, setResidentCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [countResponse, historyResponse] = await Promise.all([
        axios.get(`${API_URL}/residents/count`),
        axios.get(`${API_URL}/history?limit=10`)
      ]);

      if (countResponse.data.success) {
        setResidentCount(countResponse.data.count);
      }

      if (historyResponse.data.success) {
        setRecentActivities(historyResponse.data.history);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getResidentName = (activity) => {
    if (!activity.resident_f_name) return 'Unknown Resident';
    const suffix = activity.resident_suffix && activity.resident_suffix !== 'NA' ? ` ${activity.resident_suffix}` : '';
    const mName = activity.resident_m_name ? ` ${activity.resident_m_name}` : '';
    return `${activity.resident_l_name}, ${activity.resident_f_name}${mName}${suffix}`;
  };

  const getUserName = (activity) => {
    if (!activity.user_first_name) return 'Unknown User';
    return `${activity.user_first_name} ${activity.user_last_name}`;
  };

  return (
    <div className="home-admin">
      <div className="home-admin-header">
        <h1 className="home-admin-title">Dashboard</h1>
        <p className="home-admin-subtitle">Welcome to the Admin Dashboard</p>
      </div>

      <div className="home-admin-content">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-label">Total Residents</div>
              <div className="stat-value">
                {loading ? 'Loading...' : residentCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="activities-section">
          <h2 className="section-title">Recent Activities</h2>
          {loading ? (
            <div className="loading-state">Loading activities...</div>
          ) : recentActivities.length === 0 ? (
            <div className="empty-state">No recent activities</div>
          ) : (
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-content">
                    <div className="activity-description">
                      <strong>{getUserName(activity)}</strong> {activity.description}
                    </div>
                    <div className="activity-resident">
                      Resident: {getResidentName(activity)}
                    </div>
                    <div className="activity-time">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
