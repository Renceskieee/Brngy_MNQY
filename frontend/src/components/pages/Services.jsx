import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Eye, Edit, Trash2, Search, X, ChevronLeft, ChevronRight, FileText, Download, Users } from 'lucide-react';
import ServiceForm from '../forms/ServiceForm';
import Messages from '../shared/Messages';
import '../../assets/style/Services.css';
import * as XLSX from 'xlsx';

const API_URL = '/api';

function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [viewService, setViewService] = useState(null);
  const [viewBeneficiaries, setViewBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [deleteService, setDeleteService] = useState(null);
  const [showAddBeneficiaries, setShowAddBeneficiaries] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];

    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(service => {
        const name = (service.service_name || '').toLowerCase();
        const location = (service.location || '').toLowerCase();
        return name.includes(search) || location.includes(search);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }

    if (monthFilter !== 'all') {
      filtered = filtered.filter(service => {
        const date = new Date(service.date);
        return date.getMonth() + 1 === parseInt(monthFilter);
      });
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter(service => {
        const date = new Date(service.date);
        return date.getFullYear() === parseInt(yearFilter);
      });
    }

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, monthFilter, yearFilter, services]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/services`);
      if (response.data.success) {
        setServices(response.data.services);
        setFilteredServices(response.data.services);
      }
    } catch (error) {
      setMessage({ text: 'Failed to fetch services', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiaries = async (serviceId) => {
    setLoadingBeneficiaries(true);
    try {
      const response = await axios.get(`${API_URL}/services/${serviceId}/beneficiaries`);
      if (response.data.success) {
        setViewBeneficiaries(response.data.beneficiaries);
      }
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoadingBeneficiaries(false);
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
      case 'scheduled':
        return '#3b82f6';
      case 'ongoing':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
  };

  const handleAdd = () => {
    setSelectedService(null);
    setShowForm(true);
  };

  const handleView = async (service) => {
    setViewService(service);
    await fetchBeneficiaries(service.id);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleDeleteClick = (service) => {
    setDeleteService(service);
  };

  const confirmDelete = async () => {
    if (!deleteService) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.delete(`${API_URL}/services/${deleteService.id}`, {
        data: { userId: user.id }
      });
      if (response.data.success) {
        setMessage({ text: 'Service deleted successfully', type: 'success' });
        fetchServices();
        setDeleteService(null);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to delete service', type: 'error' });
    }
  };

  const handleFormSuccess = (serviceId) => {
    fetchServices();
    if (serviceId) {
      setShowForm(false);
      setShowAddBeneficiaries(true);
      setSelectedService({ id: serviceId });
    }
  };

  const handleExportPDF = async () => {
    if (!viewService || viewBeneficiaries.length === 0) return;

    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Service Beneficiaries Report', 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Service: ${viewService.service_name}`, 14, 30);
      doc.text(`Date: ${formatDateOnly(viewService.date)}`, 14, 36);
      doc.text(`Location: ${viewService.location}`, 14, 42);
      
      const tableData = viewBeneficiaries.map((beneficiary, index) => {
        const suffix = beneficiary.suffix && beneficiary.suffix !== 'NA' ? ` ${beneficiary.suffix}` : '';
        const mName = beneficiary.m_name ? ` ${beneficiary.m_name}` : '';
        const fullName = `${beneficiary.l_name}, ${beneficiary.f_name}${mName}${suffix}`;
        return [
          index + 1,
          fullName,
          beneficiary.sex || 'N/A',
          beneficiary.birthdate ? formatDateOnly(beneficiary.birthdate) : 'N/A',
          beneficiary.contact_no || 'N/A',
          ''
        ];
      });

      doc.autoTable({
        startY: 50,
        head: [['#', 'Name', 'Sex', 'Birthdate', 'Contact', 'Signature']],
        body: tableData,
        styles: { font: 'Poppins', fontSize: 10 },
        headStyles: { fillColor: [220, 38, 38] }
      });

      doc.save(`Service-${viewService.service_name}-Beneficiaries.pdf`);
    } catch (error) {
      setMessage({ text: 'PDF export failed. Please install jspdf and jspdf-autotable packages.', type: 'error' });
    }
  };

  const handleExportExcel = () => {
    if (!viewService || viewBeneficiaries.length === 0) return;

    const data = viewBeneficiaries.map((beneficiary, index) => {
      const suffix = beneficiary.suffix && beneficiary.suffix !== 'NA' ? ` ${beneficiary.suffix}` : '';
      const mName = beneficiary.m_name ? ` ${beneficiary.m_name}` : '';
      const fullName = `${beneficiary.l_name}, ${beneficiary.f_name}${mName}${suffix}`;
      return {
        '#': index + 1,
        'Name': fullName,
        'Sex': beneficiary.sex || 'N/A',
        'Birthdate': beneficiary.birthdate ? formatDateOnly(beneficiary.birthdate) : 'N/A',
        'Contact Number': beneficiary.contact_no || 'N/A',
        'Email': beneficiary.email || 'N/A',
        'Address': beneficiary.address || 'N/A'
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Beneficiaries');
    XLSX.writeFile(wb, `Service-${viewService.service_name}-Beneficiaries.xlsx`);
  };

  const getAvailableMonths = () => {
    const months = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    services.forEach(service => {
      if (service.date) {
        const date = new Date(service.date);
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
    services.forEach(service => {
      if (service.date) {
        const date = new Date(service.date);
        const year = date.getFullYear();
        if (!years.includes(year)) {
          years.push(year);
        }
      }
    });
    return years.sort((a, b) => b - a);
  };

  const getFullName = (beneficiary) => {
    const suffix = beneficiary.suffix && beneficiary.suffix !== 'NA' ? ` ${beneficiary.suffix}` : '';
    const mName = beneficiary.m_name ? ` ${beneficiary.m_name}` : '';
    return `${beneficiary.l_name}, ${beneficiary.f_name}${mName}${suffix}`;
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <div>
          <h1 className="services-title">Services</h1>
          <p className="services-subtitle">Manage service records</p>
        </div>
        <button className="add-service-btn" onClick={handleAdd}>
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="services-filters">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search services..."
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
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
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
        <div className="loading-state">Loading services...</div>
      ) : (
        <div className="services-table-container">
          <table className="services-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentServices.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    {searchTerm || statusFilter !== 'all' || monthFilter !== 'all' || yearFilter !== 'all' 
                      ? 'No services found.' 
                      : 'No services found. Add a new service to get started.'}
                  </td>
                </tr>
              ) : (
                currentServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-name-cell">
                        <div className="service-name">{service.service_name}</div>
                        <div 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(service.status) }}
                        >
                          {getStatusLabel(service.status)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-cell">
                        {service.location}
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <div className="date-value">{formatDateOnly(service.date)}</div>
                        <div className="time-value">{formatTime(service.time)}</div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(service)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(service)}
                          title="Update"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteClick(service)}
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

      {filteredServices.length > itemsPerPage && (
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
        <ServiceForm
          service={selectedService}
          onClose={() => {
            setShowForm(false);
            setSelectedService(null);
            setShowAddBeneficiaries(false);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {showAddBeneficiaries && selectedService && (
        <ServiceForm
          service={selectedService}
          serviceId={selectedService.id}
          mode="add-beneficiaries"
          onClose={() => {
            setShowAddBeneficiaries(false);
            setSelectedService(null);
            if (viewService) {
              fetchBeneficiaries(viewService.id);
            }
          }}
          onSuccess={() => {
            if (viewService) {
              fetchBeneficiaries(viewService.id);
            }
          }}
        />
      )}

      {viewService && (
        <div className="view-modal-overlay">
          <div className="view-modal-container">
            <div className="view-modal">
              <div className="view-modal-header">
                <h2 className="view-modal-title">Service Details</h2>
                <button className="view-modal-close" onClick={() => {
                  setViewService(null);
                  setViewBeneficiaries([]);
                }}>
                  <X size={24} />
                </button>
              </div>
              <div className="view-modal-content-wrapper">
                <div className="view-modal-left">
                  <div className="service-details-card">
                    <div className="detail-row">
                      <span className="detail-label">Service Name:</span>
                      <span className="detail-value">{viewService.service_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span 
                        className="detail-value"
                        style={{ 
                          color: getStatusColor(viewService.status),
                          fontWeight: 600
                        }}
                      >
                        {getStatusLabel(viewService.status)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{viewService.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{formatDateOnly(viewService.date)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">{formatTime(viewService.time)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{viewService.description}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{formatDate(viewService.created_at)}</span>
                    </div>
                    {viewService.updated_at && viewService.updated_at !== viewService.created_at && (
                      <div className="detail-row">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">{formatDate(viewService.updated_at)}</span>
                      </div>
                    )}
                    <div className="service-actions">
                      <button
                        className="action-button add-beneficiaries-btn"
                        onClick={() => {
                          setShowAddBeneficiaries(true);
                          setSelectedService(viewService);
                        }}
                      >
                        <Users size={18} />
                        <span>Add Beneficiaries</span>
                      </button>
                      <button
                        className="action-button export-pdf-btn"
                        onClick={handleExportPDF}
                        disabled={viewBeneficiaries.length === 0}
                      >
                        <FileText size={18} />
                        <span>Export PDF</span>
                      </button>
                      <button
                        className="action-button export-excel-btn"
                        onClick={handleExportExcel}
                        disabled={viewBeneficiaries.length === 0}
                      >
                        <Download size={18} />
                        <span>Export Excel</span>
                      </button>
                    </div>
                  </div>

                  <div className="beneficiaries-card">
                    <h3 className="beneficiaries-card-title">Beneficiaries</h3>
                    {loadingBeneficiaries ? (
                      <div className="loading-state">Loading beneficiaries...</div>
                    ) : viewBeneficiaries.length === 0 ? (
                      <div className="empty-beneficiaries">No beneficiaries added yet.</div>
                    ) : (
                      <div className="beneficiaries-list">
                        {viewBeneficiaries.map((beneficiary) => (
                          <div key={beneficiary.id} className="beneficiary-item">
                            <div className="beneficiary-info">
                              <div className="beneficiary-name">{getFullName(beneficiary)}</div>
                              {beneficiary.contact_no && (
                                <div className="beneficiary-contact">{beneficiary.contact_no}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteService && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3 className="delete-modal-title">Confirm Delete</h3>
            <p className="delete-modal-message">
              Are you sure you want to delete service "{deleteService.service_name}"? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={() => setDeleteService(null)}>
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

export default Services;

