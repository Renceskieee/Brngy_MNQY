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

  const formatActivityDescription = (activity) => {
    const userName = getUserName(activity);
    let action = '';
    let entityType = '';
    let entityValue = '';

    if (activity.incident_reference_number) {
      entityType = 'Incident';
      entityValue = activity.incident_reference_number;
      if (activity.description.includes('Added new incident:')) {
        action = 'added an incident';
      } else if (activity.description.includes('Updated incident:')) {
        action = 'updated an incident';
      } else if (activity.description.includes('Deleted incident:')) {
        action = 'deleted an incident';
      }
    } else if (activity.household_name) {
      entityType = 'Household';
      entityValue = activity.household_name;
      if (activity.description.includes('Added new household:')) {
        action = 'added a household';
      } else if (activity.description.includes('Updated household:')) {
        action = 'updated a household';
      } else if (activity.description.includes('Deleted household:')) {
        action = 'deleted a household';
      }
    } else if (activity.resident_f_name) {
      entityType = 'Resident';
      const suffix = activity.resident_suffix && activity.resident_suffix !== 'NA' ? ` ${activity.resident_suffix}` : '';
      const mName = activity.resident_m_name ? ` ${activity.resident_m_name}` : '';
      entityValue = `${activity.resident_l_name}, ${activity.resident_f_name}${mName}${suffix}`;
      if (activity.description.includes('Added new resident:')) {
        action = 'added a resident';
      } else if (activity.description.includes('Updated resident:')) {
        action = 'updated a resident';
      } else if (activity.description.includes('Deleted resident:')) {
        action = 'deleted a resident';
      }
    }

    if (!action) {
      return {
        description: `${userName} ${activity.description}`,
        entityLine: null
      };
    }

    return {
      description: `${userName} ${action}.`,
      entityLine: entityType === 'Incident' 
        ? `${entityType} Reference Number: ${entityValue}`
        : `${entityType}: ${entityValue}`
    };
  };

  const getUserName = (activity) => {
    if (!activity.user_first_name) return 'Unknown User';
    return `${activity.user_first_name} ${activity.user_last_name}`;
  };

  return (
    <div className="recent-activities-overlay">
      <div className="recent-activities-modal">
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
            <div className="empty-state">No activities found.</div>
          ) : (
            <div className="activities-list">
              {activities.map((activity) => {
                const formatted = formatActivityDescription(activity);
                return (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-content">
                      <div className="activity-description">
                        {formatted.description}
                      </div>
                      {formatted.entityLine && (
                        <div className="activity-resident">
                          {formatted.entityLine}
                        </div>
                      )}
                      <div className="activity-time">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentActivities;

