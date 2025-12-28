import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Eye, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ResidentForm from '../forms/ResidentForm';
import Messages from '../shared/Messages';
import '../../assets/style/Residents.css';

const API_URL = '/api';

function Residents() {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [viewResident, setViewResident] = useState(null);
  const [deleteResident, setDeleteResident] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchResidents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResidents(residents);
    } else {
      const filtered = residents.filter(resident => {
        const fullName = `${resident.l_name}, ${resident.f_name} ${resident.m_name || ''} ${resident.suffix && resident.suffix !== 'NA' ? resident.suffix : ''}`.toLowerCase();
        const email = (resident.email || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || email.includes(search);
      });
      setFilteredResidents(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, residents]);

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResidents = filteredResidents.slice(startIndex, endIndex);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/residents`);
      if (response.data.success) {
        setResidents(response.data.residents);
        setFilteredResidents(response.data.residents);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch residents', type: 'error' });
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

  const getFullName = (resident) => {
    const suffix = resident.suffix && resident.suffix !== 'NA' ? ` ${resident.suffix}` : '';
    const mName = resident.m_name ? ` ${resident.m_name}` : '';
    return `${resident.l_name}, ${resident.f_name}${mName}${suffix}`;
  };

  const handleAdd = () => {
    setSelectedResident(null);
    setShowForm(true);
  };

  const handleView = (resident) => {
    setViewResident(resident);
  };

  const handleEdit = (resident) => {
    setSelectedResident(resident);
    setShowForm(true);
  };

  const handleDeleteClick = (resident) => {
    setDeleteResident(resident);
  };

  const confirmDelete = async () => {
    if (!deleteResident) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.delete(`${API_URL}/residents/${deleteResident.id}`, {
        data: { userId: user.id }
      });
      if (response.data.success) {
        setMessage({ text: 'Resident deleted successfully', type: 'success' });
        fetchResidents();
        setDeleteResident(null);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to delete resident', type: 'error' });
    }
  };

  const handleFormSuccess = () => {
    fetchResidents();
  };

  return (
    <div className="residents-page">
      <div className="residents-header">
        <div>
          <h1 className="residents-title">Residents</h1>
          <p className="residents-subtitle">Manage resident information</p>
        </div>
        <button className="add-resident-btn" onClick={handleAdd}>
          <Plus size={20} />
          <span>Add Resident</span>
        </button>
      </div>

      <div className="residents-search">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search residents by name or email..."
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
      </div>

      {loading ? (
        <div className="loading-state">Loading residents...</div>
      ) : (
        <div className="residents-table-container">
          <table className="residents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentResidents.length === 0 ? (
                <tr>
                  <td colSpan="2" className="empty-state">
                    {searchTerm ? 'No residents found matching your search' : 'No residents found. Add a new resident to get started.'}
                  </td>
                </tr>
              ) : (
                currentResidents.map((resident) => (
                  <tr key={resident.id}>
                    <td>
                      <div className="resident-name-cell">
                        <div className="resident-name">{getFullName(resident)}</div>
                        {resident.email && (
                          <div className="resident-email">{resident.email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(resident)}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(resident)}
                          title="Update"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteClick(resident)}
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

      {filteredResidents.length > itemsPerPage && (
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
        <ResidentForm
          resident={selectedResident}
          onClose={() => {
            setShowForm(false);
            setSelectedResident(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {viewResident && (
        <div className="view-modal-overlay" onClick={() => setViewResident(null)}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="view-modal-header">
              <h2 className="view-modal-title">Resident Details</h2>
              <button className="view-modal-close" onClick={() => setViewResident(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="view-modal-content">
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{getFullName(viewResident)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Sex:</span>
                <span className="detail-value">{viewResident.sex ? viewResident.sex.charAt(0).toUpperCase() + viewResident.sex.slice(1) : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Birthdate:</span>
                <span className="detail-value">{formatDateOnly(viewResident.birthdate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Civil Status:</span>
                <span className="detail-value">{viewResident.civil_status ? viewResident.civil_status.charAt(0).toUpperCase() + viewResident.civil_status.slice(1) : 'N/A'}</span>
              </div>
              {viewResident.contact_no && (
                <div className="detail-row">
                  <span className="detail-label">Contact Number:</span>
                  <span className="detail-value">{viewResident.contact_no}</span>
                </div>
              )}
              {viewResident.email && (
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{viewResident.email}</span>
                </div>
              )}
              {viewResident.address && (
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{viewResident.address}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDate(viewResident.created_at)}</span>
              </div>
              {viewResident.updated_at && viewResident.updated_at !== viewResident.created_at && (
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(viewResident.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteResident && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3 className="delete-modal-title">Confirm Delete</h3>
            <p className="delete-modal-message">
              Are you sure you want to delete {getFullName(deleteResident)}? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={() => setDeleteResident(null)}>
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

export default Residents;

