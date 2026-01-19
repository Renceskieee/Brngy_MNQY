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
import { Users, Home as HomeIcon, OctagonAlert, Heart } from 'lucide-react';
import RecentActivities from '../modals/RecentActivities';
import '../../assets/style/Home.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_URL = '/api';

function Home() {
  const [residentCount, setResidentCount] = useState(0);
  const [householdCount, setHouseholdCount] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [sexDistribution, setSexDistribution] = useState({ male: 0, female: 0 });
  const [civilStatusDistribution, setCivilStatusDistribution] = useState({
    single: 0,
    married: 0,
    widowed: 0,
    separated: 0,
    annulled: 0,
    divorced: 0,
    'live-in': 0,
    unknown: 0
  });
  const [educationDistribution, setEducationDistribution] = useState({});
  const [employmentDistribution, setEmploymentDistribution] = useState({});
  const [youthClassificationDistribution, setYouthClassificationDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeGroup = (age) => {
    if (age === null) return null;
    if (age < 18) return 'Under 18';
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    if (age < 65) return '55-64';
    return 'Above 65';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [countResponse, householdCountResponse, incidentCountResponse, serviceCountResponse, historyResponse, residentsResponse] = await Promise.all([
        axios.get(`${API_URL}/residents/count`),
        axios.get(`${API_URL}/households/count`),
        axios.get(`${API_URL}/incidents/count`),
        axios.get(`${API_URL}/services/count`),
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

      if (serviceCountResponse.data.success) {
        setServiceCount(serviceCountResponse.data.count);
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
          annulled: residents.filter(r => r.civil_status === 'annulled').length,
          divorced: residents.filter(r => r.civil_status === 'divorced').length,
          'live-in': residents.filter(r => r.civil_status === 'live-in').length,
          unknown: residents.filter(r => r.civil_status === 'unknown').length
        };
        setCivilStatusDistribution(civilDist);

        const educDist = {};
        residents.forEach(r => {
          if (r.educ_background) {
            educDist[r.educ_background] = (educDist[r.educ_background] || 0) + 1;
          }
        });
        setEducationDistribution(educDist);

        const empDist = {};
        const ageGroups = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', 'Above 65'];
        ageGroups.forEach(group => {
          empDist[group] = {
            'Employed': 0,
            'Unemployed': 0,
            'Self-Employed': 0,
            'Currently looking for a job': 0,
            'Not interested looking for a job': 0,
            'No Data': 0
          };
        });

        residents.forEach(r => {
          const age = calculateAge(r.birthdate);
          const ageGroup = getAgeGroup(age);
          if (ageGroup) {
            const workStatus = r.work_status || 'No Data';
            if (empDist[ageGroup]) {
              empDist[ageGroup][workStatus] = (empDist[ageGroup][workStatus] || 0) + 1;
            }
          }
        });
        setEmploymentDistribution(empDist);

        const youthDist = {};
        const educLevels = ['Elementary Level', 'Elementary Graduate', 'High School Level', 'High School Graduate', 'Vocational Graduate', 'College Level', 'College Graduate', 'Masters Level', 'Masters Graduate', 'Doctorate Level', 'Doctorate Graduate'];
        educLevels.forEach(level => {
          youthDist[level] = {
            'In School Youth': 0,
            'Out of School Youth': 0,
            'Working Youth': 0,
            'Youth w/ Specific Needs': 0,
            'Indigenous People': 0,
            'Children In Conflict w/ Law': 0,
            'Person w/ Disability': 0,
            'No Classification': 0
          };
        });

        residents.forEach(r => {
          if (r.educ_background && r.youth_classification) {
            if (youthDist[r.educ_background]) {
              youthDist[r.educ_background][r.youth_classification] = (youthDist[r.educ_background][r.youth_classification] || 0) + 1;
            }
          } else if (r.educ_background) {
            if (youthDist[r.educ_background]) {
              youthDist[r.educ_background]['No Classification'] = (youthDist[r.educ_background]['No Classification'] || 0) + 1;
            }
          }
        });
        setYouthClassificationDistribution(youthDist);
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
    let isServiceBeneficiary = false;
    let residentName = '';
    let serviceName = '';

    if (activity.description.includes('as beneficiary to service:') || activity.description.includes('from service beneficiaries:')) {
      isServiceBeneficiary = true;
      const addedMatch = activity.description.match(/Added resident (.+?) as beneficiary to service: (.+)/);
      const removedMatch = activity.description.match(/Removed resident (.+?) from service beneficiaries: (.+)/);
      
      if (addedMatch) {
        residentName = addedMatch[1].trim();
        serviceName = addedMatch[2].trim();
        action = 'added';
      } else if (removedMatch) {
        residentName = removedMatch[1].trim();
        serviceName = removedMatch[2].trim();
        action = 'removed';
      }
    } else if (activity.description.includes('sent emails to beneficiaries of service:')) {
      entityType = 'Service';
      const match = activity.description.match(/sent emails to beneficiaries of service: (.+)/);
      if (match) {
        entityValue = match[1].trim();
        return {
          description: (
            <>
              <strong>{userName}</strong> initiated email distribution to beneficiaries of the <strong>{entityValue}</strong>.
            </>
          ),
          entityLine: null
        };
      }
    } else if (activity.incident_reference_number) {
      entityType = 'Incident';
      entityValue = activity.incident_reference_number;
      if (activity.description.includes('Added new incident:')) {
        action = 'added an incident';
      } else if (activity.description.includes('Updated incident:')) {
        action = 'updated an incident';
      } else if (activity.description.includes('Deleted incident:')) {
        action = 'deleted an incident';
      }
    } else if (activity.service_name) {
      entityType = 'Service';
      entityValue = activity.service_name;
      if (activity.description.includes('Added new service:')) {
        action = 'added a service';
      } else if (activity.description.includes('Updated service:')) {
        action = 'updated a service';
      } else if (activity.description.includes('Deleted service:')) {
        action = 'deleted a service';
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

    if (isServiceBeneficiary && action && residentName && serviceName) {
      return {
        description: (
          <>
            <strong>{userName}</strong> {action} {residentName} from service beneficiaries.
          </>
        ),
        entityLine: `Service: ${serviceName}`
      };
    }

    if (!action) {
      return {
        description: (
          <>
            <strong>{userName}</strong> {activity.description}
          </>
        ),
        entityLine: null
      };
    }

    return {
      description: (
        <>
          <strong>{userName}</strong> {action}.
        </>
      ),
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
    labels: ['Single', 'Married', 'Widowed', 'Separated', 'Annulled', 'Divorced', 'Live-in', 'Unknown'],
    datasets: [
      {
        label: 'Residents',
        data: [
          civilStatusDistribution.single,
          civilStatusDistribution.married,
          civilStatusDistribution.widowed,
          civilStatusDistribution.separated,
          civilStatusDistribution.annulled,
          civilStatusDistribution.divorced,
          civilStatusDistribution['live-in'],
          civilStatusDistribution.unknown
        ],
        backgroundColor: ['#3F9AAE', '#79C9C5', '#FFE2AF', '#F96E5B', '#88B0B9', '#A8DADC', '#F4A261', '#E9C46A'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  };

  const educationChartData = {
    labels: Object.keys(educationDistribution),
    datasets: [
      {
        label: 'Residents',
        data: Object.values(educationDistribution),
        backgroundColor: '#3F9AAE',
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  const employmentChartData = {
    labels: Object.keys(employmentDistribution),
    datasets: [
      {
        label: 'Employed',
        data: Object.keys(employmentDistribution).map(age => employmentDistribution[age]['Employed'] || 0),
        backgroundColor: '#3F9AAE'
      },
      {
        label: 'Unemployed',
        data: Object.keys(employmentDistribution).map(age => employmentDistribution[age]['Unemployed'] || 0),
        backgroundColor: '#F96E5B'
      },
      {
        label: 'Self-Employed',
        data: Object.keys(employmentDistribution).map(age => employmentDistribution[age]['Self-Employed'] || 0),
        backgroundColor: '#79C9C5'
      },
      {
        label: 'Currently looking for a job',
        data: Object.keys(employmentDistribution).map(age => employmentDistribution[age]['Currently looking for a job'] || 0),
        backgroundColor: '#FFE2AF'
      },
      {
        label: 'Not interested looking for a job',
        data: Object.keys(employmentDistribution).map(age => employmentDistribution[age]['Not interested looking for a job'] || 0),
        backgroundColor: '#88B0B9'
      }
    ]
  };

  const youthClassificationChartData = {
    labels: Object.keys(youthClassificationDistribution),
    datasets: [
      {
        label: 'In School Youth',
        data: Object.keys(youthClassificationDistribution).map(educ => youthClassificationDistribution[educ]['In School Youth'] || 0),
        backgroundColor: '#3F9AAE'
      },
      {
        label: 'Out of School Youth',
        data: Object.keys(youthClassificationDistribution).map(educ => youthClassificationDistribution[educ]['Out of School Youth'] || 0),
        backgroundColor: '#F96E5B'
      },
      {
        label: 'Working Youth',
        data: Object.keys(youthClassificationDistribution).map(educ => youthClassificationDistribution[educ]['Working Youth'] || 0),
        backgroundColor: '#79C9C5'
      },
      {
        label: 'Youth w/ Specific Needs',
        data: Object.keys(youthClassificationDistribution).map(educ => youthClassificationDistribution[educ]['Youth w/ Specific Needs'] || 0),
        backgroundColor: '#FFE2AF'
      },
      {
        label: 'Indigenous People',
        data: Object.keys(youthClassificationDistribution).map(educ => youthClassificationDistribution[educ]['Indigenous People'] || 0),
        backgroundColor: '#88B0B9'
      },
      {
        label: 'Children In Conflict w/ Law',
        data: Object.keys(youthClassificationDistribution).map(educ => youthClassificationDistribution[educ]['Children In Conflict w/ Law'] || 0),
        backgroundColor: '#A8DADC'
      },
      {
        label: 'Person w/ Disability',
        data: Object.keys(youthClassificationDistribution).map(educ => youthClassificationDistribution[educ]['Person w/ Disability'] || 0),
        backgroundColor: '#F4A261'
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

  const verticalBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} residents`;
          }
        },
        font: {
          family: 'Poppins'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Poppins'
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Poppins'
          },
          stepSize: 1
        }
      }
    }
  };

  const stackedBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            family: 'Poppins',
            size: 12
          }
        }
      },
      tooltip: {
        font: {
          family: 'Poppins'
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            family: 'Poppins'
          },
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Poppins'
          },
          stepSize: 1
        }
      }
    }
  };

  const stackedColumnChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            family: 'Poppins',
            size: 11
          }
        }
      },
      tooltip: {
        font: {
          family: 'Poppins'
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            family: 'Poppins'
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Poppins'
          },
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="home-staff">
      <div className="home-staff-content">
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
              <HomeIcon size={48} />
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
          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={48} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Services</div>
              <div className="stat-value">
                {loading ? 'Loading...' : serviceCount.toLocaleString()}
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

        <div className="charts-section charts-section-single">
          <div className="chart-section">
            <h2 className="section-title">Resident Education Overview</h2>
            <div className="chart-container chart-container-large">
              {loading ? (
                <div className="loading-state">Loading chart...</div>
              ) : Object.keys(educationDistribution).length === 0 ? (
                <div className="empty-state">No education data available</div>
              ) : (
                <Bar data={educationChartData} options={verticalBarChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="charts-section charts-section-single">
          <div className="chart-section">
            <h2 className="section-title">Employment Breakdown</h2>
            <div className="chart-container chart-container-large">
              {loading ? (
                <div className="loading-state">Loading chart...</div>
              ) : (
                <Bar data={employmentChartData} options={stackedBarChartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="charts-section charts-section-single">
          <div className="chart-section">
            <h2 className="section-title">Youth Classification Overview</h2>
            <div className="chart-container chart-container-large">
              {loading ? (
                <div className="loading-state">Loading chart...</div>
              ) : Object.keys(youthClassificationDistribution).length === 0 ? (
                <div className="empty-state">No youth classification data available</div>
              ) : (
                <Bar data={youthClassificationChartData} options={stackedColumnChartOptions} />
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

export default Home;
