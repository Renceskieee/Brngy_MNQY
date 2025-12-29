import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/style/TimeLog.css';

const API_URL = '/api';

function TimeLog() {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTimeLogs();
  }, [filter]);

  const fetchTimeLogs = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { userId: filter } : {};
      const response = await axios.get(`${API_URL}/time-logs`, { params });
      if (response.data.success) {
        setTimeLogs(response.data.timeLogs);
      }
    } catch (error) {
      console.error('Error fetching time logs:', error);
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

  return (
    <div className="time-log-page">
      <div className="time-log-header">
        <h1 className="time-log-title">Time Log</h1>
        <p className="time-log-subtitle">View user login and logout details</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading time logs...</div>
      ) : (
        <div className="time-log-table-container">
          <table className="time-log-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Logged In</th>
                <th>Logged Out</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No time logs found
                  </td>
                </tr>
              ) : (
                timeLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.employee_id}</td>
                    <td>{log.first_name} {log.last_name}</td>
                    <td>{formatDate(log.logged_in)}</td>
                    <td>{log.logged_out ? formatDate(log.logged_out) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TimeLog;

