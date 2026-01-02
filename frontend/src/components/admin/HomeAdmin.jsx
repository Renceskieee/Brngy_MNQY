import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { Users, Home, OctagonAlert } from 'lucide-react';
import RecentActivities from '../modals/RecentActivities';
import '../../assets/style/HomeAdmin.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_URL = '/api';

function HomeAdmin() {
  const [residentCount, setResidentCount] = useState(0);
  const [householdCount, setHouseholdCount] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [sexDistribution, setSexDistribution] = useState({ male: 0, female: 0 });
  const [civilStatusDistribution, setCivilStatusDistribution] = useState({
    single: 0,
    married: 0,
    widowed: 0,
    separated: 0,
    annulled: 0
  });
  const [loading, setLoading] = useState(true);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [countResponse, householdCountResponse, incidentCountResponse, historyResponse, residentsResponse] = await Promise.all([
        axios.get(`${API_URL}/residents/count`),
        axios.get(`${API_URL}/households/count`),
        axios.get(`${API_URL}/incidents/count`),
        axios.get(`${API_URL}/history?limit=5`),
        axios.get(`${API_URL}/residents`)
      ]);

      if (countResponse.data.success) {
        setResidentCount(countResponse.data.count);
      }

      if (householdCountResponse.data.success) {
        setHouseholdCount(householdCountResponse.data.count);
      }

      if (incidentCountResponse.data.success) {
        setIncidentCount(incidentCountResponse.data.count);
      }

      if (historyResponse.data.success) {
        setRecentActivities(historyResponse.data.history);
      }

      if (residentsResponse.data.success) {
        const residents = residentsResponse.data.residents;
        const sexDist = {
          male: residents.filter(r => r.sex === 'male').length,
          female: residents.filter(r => r.sex === 'female').length
        };
        setSexDistribution(sexDist);

        const civilDist = {
          single: residents.filter(r => r.civil_status === 'single').length,
          married: residents.filter(r => r.civil_status === 'married').length,
          widowed: residents.filter(r => r.civil_status === 'widowed').length,
          separated: residents.filter(r => r.civil_status === 'separated').length,
          annulled: residents.filter(r => r.civil_status === 'annulled').length
        };
        setCivilStatusDistribution(civilDist);
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

  const sexChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [sexDistribution.male, sexDistribution.female],
        backgroundColor: ['#79C9C5', '#F96E5B'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  };

  const civilStatusChartData = {
    labels: ['Single', 'Married', 'Widowed', 'Separated', 'Annulled'],
    datasets: [
      {
        label: 'Residents',
        data: [
          civilStatusDistribution.single,
          civilStatusDistribution.married,
          civilStatusDistribution.widowed,
          civilStatusDistribution.separated,
          civilStatusDistribution.annulled
        ],
        backgroundColor: ['#3F9AAE', '#79C9C5', '#FFE2AF', '#F96E5B', '#88B0B9'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            family: 'Poppins',
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed} residents (${percentage}%)`;
          }
        },
        font: {
          family: 'Poppins'
        }
      }
    }
  };

  const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed.x / total) * 100).toFixed(1) : 0;
            return `${context.parsed.x} residents (${percentage}%)`;
          }
        },
        font: {
          family: 'Poppins'
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Poppins'
          },
          stepSize: 1,
          minRotation: 0,
          maxRotation: 0
        }
      },
      y: {
        ticks: {
          font: {
            family: 'Poppins'
          }
        }
      }
    }
  };

  return (
    <div className="home-admin">
      <div className="home-admin-content">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={48} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Residents</div>
              <div className="stat-value">
                {loading ? 'Loading...' : residentCount.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Home size={48} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Households</div>
              <div className="stat-value">
                {loading ? 'Loading...' : householdCount.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <OctagonAlert size={48} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Incidents</div>
              <div className="stat-value">
                {loading ? 'Loading...' : incidentCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-section">
            <h2 className="section-title">Gender Statistics</h2>
            <div className="chart-container">
              {loading ? (
                <div className="loading-state">Loading chart...</div>
              ) : (
                <Pie data={sexChartData} options={pieChartOptions} />
              )}
            </div>
          </div>
          <div className="chart-section">
            <h2 className="section-title">Civil Status Summary</h2>
            <div className="chart-container">
              {loading ? (
                <div className="loading-state">Loading chart...</div>
              ) : (
                <Bar data={civilStatusChartData} options={barChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="activities-section" onClick={() => setShowActivitiesModal(true)} style={{ cursor: 'pointer' }}>
          <h2 className="section-title">Recent Activities</h2>
          {loading ? (
            <div className="loading-state">Loading activities...</div>
          ) : recentActivities.length === 0 ? (
            <div className="empty-state">No recent activities.</div>
          ) : (
            <div className="activities-list">
              {recentActivities.map((activity) => {
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

      {showActivitiesModal && (
        <RecentActivities
          onClose={() => setShowActivitiesModal(false)}
        />
      )}
    </div>
  );
}

export default HomeAdmin;