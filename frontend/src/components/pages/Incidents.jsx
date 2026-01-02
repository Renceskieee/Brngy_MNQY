import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Eye, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import IncidentForm from '../forms/IncidentForm';
import Messages from '../shared/Messages';
import '../../assets/style/Incidents.css';

const API_URL = '/api';

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [viewIncident, setViewIncident] = useState(null);
  const [deleteIncident, setDeleteIncident] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    let filtered = [...incidents];

    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(incident => {
        const refNum = (incident.reference_number || '').toLowerCase();
        const type = (incident.incident_type || '').toLowerCase();
        const location = (incident.location || '').toLowerCase();
        const complainant = (incident.complainant || '').toLowerCase();
        const respondent = (incident.respondent || '').toLowerCase();
        return refNum.includes(search) || type.includes(search) || 
               location.includes(search) || complainant.includes(search) || 
               respondent.includes(search);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    if (monthFilter !== 'all') {
      filtered = filtered.filter(incident => {
        const date = new Date(incident.date);
        return date.getMonth() + 1 === parseInt(monthFilter);
      });
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter(incident => {
        const date = new Date(incident.date);
        return date.getFullYear() === parseInt(yearFilter);
      });
    }

    setFilteredIncidents(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, monthFilter, yearFilter, incidents]);

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIncidents = filteredIncidents.slice(startIndex, endIndex);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/incidents`);
      if (response.data.success) {
        setIncidents(response.data.incidents);
        setFilteredIncidents(response.data.incidents);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch incidents', type: 'error' });
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

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'ongoing':
        return '#3b82f6';
      case 'resolved':
        return '#10b981';
      case 'dismissed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
  };

  const handleAdd = () => {
    setSelectedIncident(null);
    setShowForm(true);
  };

  const handleView = (incident) => {
    setViewIncident(incident);
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    setShowForm(true);
  };

  const handleDeleteClick = (incident) => {
    setDeleteIncident(incident);
  };

  const confirmDelete = async () => {
    if (!deleteIncident) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.delete(`${API_URL}/incidents/${deleteIncident.id}`, {
        data: { userId: user.id }
      });
      if (response.data.success) {
        setMessage({ text: 'Incident deleted successfully', type: 'success' });
        fetchIncidents();
        setDeleteIncident(null);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to delete incident', type: 'error' });
    }
  };

  const handleFormSuccess = () => {
    fetchIncidents();
  };

  const getAvailableMonths = () => {
    const months = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    incidents.forEach(incident => {
      if (incident.date) {
        const date = new Date(incident.date);
        const month = date.getMonth() + 1;
        if (!months.includes(month)) {
          months.push(month);
        }
      }
    });
    return months.sort((a, b) => a - b).map(month => ({
      value: month,
      label: monthNames[month - 1]
    }));
  };

  const getAvailableYears = () => {
    const years = [];
    incidents.forEach(incident => {
      if (incident.date) {
        const date = new Date(incident.date);
        const year = date.getFullYear();
        if (!years.includes(year)) {
          years.push(year);
        }
      }
    });
    return years.sort((a, b) => b - a);
  };

  return (
    <div className="incidents-page">
      <div className="incidents-header">
        <div>
          <h1 className="incidents-title">Incidents</h1>
          <p className="incidents-subtitle">Manage incident records</p>
        </div>
        <button className="add-incident-btn" onClick={handleAdd}>
          <Plus size={20} />
          <span>Add Incident</span>
        </button>
      </div>

      <div className="incidents-filters">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search incidents..."
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
            <label htmlFor="status-filter" className="filter-label">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="month-filter" className="filter-label">Month</label>
            <select
              id="month-filter"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Months</option>
              {getAvailableMonths().map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="year-filter" className="filter-label">Year</label>
            <select
              id="year-filter"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Years</option>
              {getAvailableYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading incidents...</div>
      ) : (
        <div className="incidents-table-container">
          <table className="incidents-table">
            <thead>
              <tr>
                <th>Reference Number</th>
                <th>Incident</th>
                <th>Location</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentIncidents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {searchTerm || statusFilter !== 'all' || monthFilter !== 'all' || yearFilter !== 'all' 
                      ? 'No incidents found.' 
                      : 'No incidents found. Add a new incident to get started.'}
                  </td>
                </tr>
              ) : (
                currentIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <div className="reference-number-cell">
                        <div className="reference-number">{incident.reference_number}</div>
                        <div 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(incident.status) }}
                        >
                          {getStatusLabel(incident.status)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="incident-type-cell">
                        <div className="incident-type">{incident.incident_type}</div>
                      </div>
                    </td>
                    <td>
                      <div className="location-cell">
                        {incident.location}
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <div className="date-value">{formatDateOnly(incident.date)}</div>
                        <div className="time-value">{formatTime(incident.time)}</div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(incident)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(incident)}
                          title="Update"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteClick(incident)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {filteredIncidents.length > itemsPerPage && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {showForm && (
        <IncidentForm
          incident={selectedIncident}
          onClose={() => {
            setShowForm(false);
            setSelectedIncident(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {viewIncident && (
        <div className="view-modal-overlay">
          <div className="view-modal">
            <div className="view-modal-header">
              <h2 className="view-modal-title">Incident Details</h2>
              <button className="view-modal-close" onClick={() => setViewIncident(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="view-modal-content">
              <div className="detail-row">
                <span className="detail-label">Reference Number:</span>
                <span className="detail-value">{viewIncident.reference_number}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span 
                  className="detail-value"
                  style={{ 
                    color: getStatusColor(viewIncident.status),
                    fontWeight: 600
                  }}
                >
                  {getStatusLabel(viewIncident.status)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Incident Type:</span>
                <span className="detail-value">{viewIncident.incident_type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{viewIncident.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDateOnly(viewIncident.date)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{formatTime(viewIncident.time)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Complainant:</span>
                <span className="detail-value">{viewIncident.complainant}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Respondent:</span>
                <span className="detail-value">{viewIncident.respondent}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{viewIncident.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDate(viewIncident.created_at)}</span>
              </div>
              {viewIncident.updated_at && viewIncident.updated_at !== viewIncident.created_at && (
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(viewIncident.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteIncident && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3 className="delete-modal-title">Confirm Delete</h3>
            <p className="delete-modal-message">
              Are you sure you want to delete incident {deleteIncident.reference_number}? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={() => setDeleteIncident(null)}>
                Cancel
              </button>
              <button className="delete-modal-confirm" onClick={confirmDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {message.text && (
        <Messages
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ text: '', type: '' })}
        />
      )}
    </div>
  );
}

export default Incidents;

