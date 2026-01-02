import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Edit, KeyRound, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Messages from '../shared/Messages';
import '../../assets/style/Users.css';
import phFlag from '../../assets/logo/philippines.png';

const API_URL = '/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        const fullName = `${user.last_name}, ${user.first_name}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const employeeId = (user.employee_id || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || email.includes(search) || employeeId.includes(search);
      });
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, users]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users`);
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch users', type: 'error' });
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

  const getFullName = (user) => {
    return `${user.last_name}, ${user.first_name}`;
  };

  const handleView = async (user) => {
    try {
      const response = await axios.get(`${API_URL}/users/${user.id}`);
      if (response.data.success) {
        setViewUser(response.data.user);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch user details', type: 'error' });
    }
  };

  const handleEdit = async (user) => {
    try {
      const response = await axios.get(`${API_URL}/users/${user.id}`);
      if (response.data.success) {
        setEditUser(response.data.user);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch user details', type: 'error' });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      contact_number: formData.get('contact_number') || null,
      position: formData.get('position'),
      status: formData.get('status')
    };

    try {
      const response = await axios.put(`${API_URL}/users/${editUser.id}`, updateData);
      if (response.data.success) {
        setMessage({ text: 'User updated successfully', type: 'success' });
        fetchUsers();
        setEditUser(null);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to update user', type: 'error' });
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(`${API_URL}/users/${resetPasswordUser.id}/reset-password`);
      if (response.data.success) {
        setMessage({ text: 'Password reset successfully. Email sent to user.', type: 'success' });
        setResetPasswordUser(null);
        setShowResetConfirm(false);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to reset password', type: 'error' });
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="users-title">Users</h1>
          <p className="users-subtitle">Manage user accounts and permissions</p>
        </div>
      </div>

      <div className="users-search">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name, email, or employee ID..."
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
        <div className="loading-state">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-state">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-name">{getFullName(user)}</div>
                        {user.email && (
                          <div className="user-email">{user.email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="status-indicator">
                        <span className={`status-dot ${user.status === 'active' ? 'active' : 'inactive'}`}></span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(user)}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(user)}
                          title="Update"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn reset-btn"
                          onClick={() => {
                            setResetPasswordUser(user);
                            setShowResetConfirm(true);
                          }}
                          title="Reset Password"
                        >
                          <KeyRound size={18} />
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

      {filteredUsers.length > itemsPerPage && (
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

      {viewUser && (
        <div className="view-modal-overlay">
          <div className="view-modal">
            <div className="view-modal-header">
              <h2 className="view-modal-title">User Details</h2>
              <button className="view-modal-close" onClick={() => setViewUser(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="view-modal-content">
              <div className="detail-row">
                <span className="detail-label">Employee ID:</span>
                <span className="detail-value">{viewUser.employee_id || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{getFullName(viewUser)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{viewUser.email || 'N/A'}</span>
              </div>
              {viewUser.contact_number && (
                <div className="detail-row">
                  <span className="detail-label">Phone Number:</span>
                  <span className="detail-value">{viewUser.contact_number}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Position:</span>
                <span className="detail-value">{viewUser.position ? viewUser.position.charAt(0).toUpperCase() + viewUser.position.slice(1) : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  <span className={`status-badge ${viewUser.status === 'active' ? 'active' : 'inactive'}`}>
                    {viewUser.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDate(viewUser.created_at)}</span>
              </div>
              {viewUser.updated_at && viewUser.updated_at !== viewUser.created_at && (
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(viewUser.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editUser && (
        <div className="create-account-overlay">
          <div className="create-account-modal">
            <div className="create-account-header">
              <div className="create-account-title-row">
                <h2 className="create-account-title">Update User</h2>
              </div>
              <button className="create-account-close" onClick={() => setEditUser(null)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="create-account-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit_first_name" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="edit_first_name"
                    name="first_name"
                    defaultValue={editUser.first_name}
                    className="form-input"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_last_name" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="edit_last_name"
                    name="last_name"
                    defaultValue={editUser.last_name}
                    className="form-input"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="edit_email" className="form-label">Email</label>
                <input
                  type="email"
                  id="edit_email"
                  name="email"
                  defaultValue={editUser.email}
                  className="form-input"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_contact_number" className="form-label">Phone Number</label>
                <div className="phone-input-wrapper">
                  <div className="phone-flag">
                    <img src={phFlag} alt="PH" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <input
                    type="tel"
                    id="edit_contact_number"
                    name="contact_number"
                    defaultValue={editUser.contact_number || ''}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit_position" className="form-label">Select position</label>
                  <select
                    id="edit_position"
                    name="position"
                    defaultValue={editUser.position}
                    className="form-select form-select-tight"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit_status" className="form-label">Status</label>
                  <select
                    id="edit_status"
                    name="status"
                    defaultValue={editUser.status}
                    className="form-select form-select-tight"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <p className="form-instruction">
                Please review all entered details before updating the user.
              </p>
              <button type="submit" className="create-account-button">
                Update User
              </button>
            </form>
          </div>
        </div>
      )}

      {showResetConfirm && resetPasswordUser && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3 className="logout-modal-title">Confirm Reset Password</h3>
            <p className="logout-modal-message">
              Are you sure you want to reset the password for <strong>{getFullName(resetPasswordUser)}</strong>? 
              The password will be reset to the default value and an email will be sent to the user.
            </p>
            <div className="logout-modal-actions">
              <button className="logout-modal-cancel" onClick={() => {
                setShowResetConfirm(false);
                setResetPasswordUser(null);
              }}>
                Cancel
              </button>
              <button className="logout-modal-confirm" onClick={handleResetPassword}>
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

export default Users;

