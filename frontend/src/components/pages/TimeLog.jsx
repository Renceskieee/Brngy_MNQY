import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import '../../assets/style/TimeLog.css';

const API_URL = '/api';

function TimeLog() {
  const [timeLogs, setTimeLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchTimeLogs();
  }, []);

  useEffect(() => {
    filterTimeLogs();
  }, [searchTerm, selectedMonth, selectedYear, timeLogs]);

  const fetchTimeLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/time-logs`);
      if (response.data.success) {
        setTimeLogs(response.data.timeLogs);
      }
    } catch (error) {
      console.error('Error fetching time logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTimeLogs = () => {
    let filtered = [...timeLogs];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(log => {
        const name = `${log.first_name} ${log.last_name}`.toLowerCase();
        const employeeId = (log.employee_id || '').toLowerCase();
        return name.includes(search) || employeeId.includes(search);
      });
    }

    if (selectedMonth) {
      filtered = filtered.filter(log => {
        const date = new Date(log.logged_in);
        return (date.getMonth() + 1).toString() === selectedMonth;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(log => {
        const date = new Date(log.logged_in);
        return date.getFullYear().toString() === selectedYear;
      });
    }

    setFilteredLogs(filtered);
  };

  const getAvailableYears = () => {
    const years = new Set();
    timeLogs.forEach(log => {
      if (log.logged_in) {
        const year = new Date(log.logged_in).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
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
        <div>
          <h1 className="time-log-title">Time Log</h1>
          <p className="time-log-subtitle">View user login and logout details</p>
        </div>
      </div>

      <div className="time-log-filters">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="month-filter" className="filter-label">Month</label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="filter-select"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="year-filter" className="filter-label">Year</label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
            >
              <option value="">All Years</option>
              {getAvailableYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
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
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state1">
                    {searchTerm || selectedMonth || selectedYear ? 'No time logs found matching your filters.' : 'No time logs found.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
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

