import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import '../../assets/style/RecentActivities.css';

const API_URL = '/api';

function RecentActivities({ onClose }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const fetchAllActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/history?limit=1000`);
      if (response.data.success) {
        setActivities(response.data.history);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
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

  const getActivityName = (activity) => {
    if (activity.resident_f_name) {
      const suffix = activity.resident_suffix && activity.resident_suffix !== 'NA' ? ` ${activity.resident_suffix}` : '';
      const mName = activity.resident_m_name ? ` ${activity.resident_m_name}` : '';
      return `${activity.resident_l_name}, ${activity.resident_f_name}${mName}${suffix}`;
    }
    
    if (activity.household_name) {
      return activity.household_name;
    }
    
    if (activity.description) {
      if (activity.description.includes('Deleted resident: ')) {
        return activity.description.replace('Deleted resident: ', '');
      }
      if (activity.description.includes('Added new resident: ')) {
        return activity.description.replace('Added new resident: ', '');
      }
      if (activity.description.includes('Deleted household: ')) {
        return activity.description.replace('Deleted household: ', '');
      }
      if (activity.description.includes('Added new household: ')) {
        return activity.description.replace('Added new household: ', '');
      }
    }
    
    return 'N/A';
  };

  const getUserName = (activity) => {
    if (!activity.user_first_name) return 'Unknown User';
    return `${activity.user_first_name} ${activity.user_last_name}`;
  };

  return (
    <div className="recent-activities-overlay" onClick={onClose}>
      <div className="recent-activities-modal" onClick={(e) => e.stopPropagation()}>
        <div className="recent-activities-header">
          <h2 className="recent-activities-title">All Activities</h2>
          <button className="recent-activities-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="recent-activities-content">
          {loading ? (
            <div className="loading-state">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="empty-state">No activities found</div>
          ) : (
            <div className="activities-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-content">
                    <div className="activity-description">
                      <strong>{getUserName(activity)}</strong> {activity.description}
                    </div>
                    <div className="activity-resident">
                      {activity.household_name ? `Household: ${activity.household_name}` : `Resident: ${getActivityName(activity)}`}
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

export default RecentActivities;

