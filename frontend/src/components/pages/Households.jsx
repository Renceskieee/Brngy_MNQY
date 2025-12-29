import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Eye, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import HouseholdForm from '../forms/HouseholdForm';
import Messages from '../shared/Messages';
import '../../assets/style/Households.css';

const API_URL = '/api';

function Households() {
  const [households, setHouseholds] = useState([]);
  const [filteredHouseholds, setFilteredHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [viewHousehold, setViewHousehold] = useState(null);
  const [deleteHousehold, setDeleteHousehold] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHouseholds();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHouseholds(households);
    } else {
      const filtered = households.filter(household => {
        const name = (household.household_name || '').toLowerCase();
        const address = (household.address || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || address.includes(search);
      });
      setFilteredHouseholds(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, households]);

  const totalPages = Math.ceil(filteredHouseholds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHouseholds = filteredHouseholds.slice(startIndex, endIndex);

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/households`);
      if (response.data.success) {
        setHouseholds(response.data.households);
        setFilteredHouseholds(response.data.households);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch households', type: 'error' });
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

  const handleAdd = () => {
    setSelectedHousehold(null);
    setShowForm(true);
  };

  const handleView = async (household) => {
    try {
      const response = await axios.get(`${API_URL}/households/${household.id}`);
      if (response.data.success) {
        setViewHousehold(response.data.household);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch household details', type: 'error' });
    }
  };

  const handleEdit = async (household) => {
    try {
      const response = await axios.get(`${API_URL}/households/${household.id}`);
      if (response.data.success) {
        setSelectedHousehold(response.data.household);
        setShowForm(true);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch household details', type: 'error' });
    }
  };

  const handleDeleteClick = (household) => {
    setDeleteHousehold(household);
  };

  const confirmDelete = async () => {
    if (!deleteHousehold) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.delete(`${API_URL}/households/${deleteHousehold.id}`, {
        data: { userId: user.id }
      });
      if (response.data.success) {
        setMessage({ text: 'Household deleted successfully', type: 'success' });
        fetchHouseholds();
        setDeleteHousehold(null);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to delete household', type: 'error' });
    }
  };

  const handleFormSuccess = () => {
    fetchHouseholds();
  };

  return (
    <div className="households-page">
      <div className="households-header">
        <div>
          <h1 className="households-title">Households</h1>
          <p className="households-subtitle">Manage household information</p>
        </div>
        <button className="add-household-btn" onClick={handleAdd}>
          <Plus size={20} />
          <span>Add Household</span>
        </button>
      </div>

      <div className="households-search">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search households by name or address..."
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
        <div className="loading-state">Loading households...</div>
      ) : (
        <div className="households-table-container">
          <table className="households-table">
            <thead>
              <tr>
                <th>Household Name</th>
                <th>Address</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentHouseholds.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    {searchTerm ? 'No households found matching your search' : 'No households found. Add a new household to get started.'}
                  </td>
                </tr>
              ) : (
                currentHouseholds.map((household) => (
                  <tr key={household.id}>
                    <td>
                      <div className="household-name-cell">
                        <div className="household-name">{household.household_name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="household-address">{household.address || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="household-members">{household.member_count || 0}</div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(household)}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(household)}
                          title="Update"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteClick(household)}
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

      {filteredHouseholds.length > itemsPerPage && (
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
        <HouseholdForm
          household={selectedHousehold}
          onClose={() => {
            setShowForm(false);
            setSelectedHousehold(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {viewHousehold && (
        <div className="view-modal-overlay" onClick={() => setViewHousehold(null)}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="view-modal-header">
              <h2 className="view-modal-title">Household Details</h2>
              <button className="view-modal-close" onClick={() => setViewHousehold(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="view-modal-content">
              <div className="detail-row">
                <span className="detail-label">Household Name:</span>
                <span className="detail-value">{viewHousehold.household_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{viewHousehold.address || 'N/A'}</span>
              </div>
              {viewHousehold.members && viewHousehold.members.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Members:</span>
                  <div className="detail-value">
                    <ul className="members-list">
                      {viewHousehold.members.map((member) => {
                        const suffix = member.suffix && member.suffix !== 'NA' ? ` ${member.suffix}` : '';
                        const mName = member.m_name ? ` ${member.m_name}` : '';
                        const fullName = `${member.l_name}, ${member.f_name}${mName}${suffix}`;
                        return (
                          <li key={member.id}>
                            {fullName} ({member.role})
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDate(viewHousehold.created_at)}</span>
              </div>
              {viewHousehold.updated_at && viewHousehold.updated_at !== viewHousehold.created_at && (
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(viewHousehold.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteHousehold && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3 className="delete-modal-title">Confirm Delete</h3>
            <p className="delete-modal-message">
              Are you sure you want to delete {deleteHousehold.household_name}? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={() => setDeleteHousehold(null)}>
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

export default Households;

