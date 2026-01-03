import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Eye, Edit, Trash2, Search, X, ChevronLeft, ChevronRight, Printer, FileSpreadsheet, UserPlus } from 'lucide-react';
import ServiceForm from '../forms/ServiceForm';
import BeneficiariesForm from '../forms/BeneficiariesForm';
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
  const [showBeneficiariesForm, setShowBeneficiariesForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [viewService, setViewService] = useState(null);
  const [viewBeneficiaries, setViewBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [deleteService, setDeleteService] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchServices();
  }, [statusFilter, monthFilter, yearFilter]);

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

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [searchTerm, services]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (monthFilter !== 'all') params.append('month', monthFilter);
      if (yearFilter !== 'all') params.append('year', yearFilter);
      
      const queryString = params.toString();
      const url = queryString ? `${API_URL}/services?${queryString}` : `${API_URL}/services`;
      const response = await axios.get(url);
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
      setMessage({ text: 'Failed to fetch beneficiaries', type: 'error' });
    } finally {
      setLoadingBeneficiaries(false);
    }
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

  const handleCloseView = () => {
    setViewService(null);
    setViewBeneficiaries([]);
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
        if (viewService && viewService.id === deleteService.id) {
          handleCloseView();
        }
        setDeleteService(null);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to delete service', type: 'error' });
    }
  };

  const handleFormSuccess = () => {
    fetchServices();
    if (viewService) {
      fetchBeneficiaries(viewService.id);
    }
  };

  const handleRemoveBeneficiary = async (beneficiaryId) => {
    if (!viewService) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.delete(`${API_URL}/services/${viewService.id}/beneficiaries/${beneficiaryId}`, {
        data: { userId: user.id }
      });
      if (response.data.success) {
        setMessage({ text: 'Beneficiary removed successfully', type: 'success' });
        fetchBeneficiaries(viewService.id);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to remove beneficiary', type: 'error' });
    }
  };

  const handlePrint = () => {
    if (!viewService || viewBeneficiaries.length === 0) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Beneficiaries - ${viewService.service_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Poppins', sans-serif;
              padding: 20px;
              color: #111827;
            }
            .header {
              margin-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 15px;
            }
            .header h1 {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            .header-info {
              font-size: 14px;
              color: #6b7280;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #ffffff;
              color: #000000;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
              border: 1px solid #000000;
            }
            td {
              padding: 10px 12px;
              border: 1px solid #000000;
              font-size: 12px;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .signature-col {
              min-width: 100px;
              height: 40px;
            }
            @media print {
              body {
                padding: 10px;
              }
              .header {
                page-break-after: avoid;
              }
              table {
                page-break-inside: auto;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Beneficiaries for Service: ${viewService.service_name}</h1>
            <div class="header-info">
              <div><strong>Location:</strong> ${viewService.location}</div>
              <div><strong>Date:</strong> ${formatDateOnly(viewService.date)}</div>
              <div><strong>Time:</strong> ${formatTime(viewService.time)}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Contact No.</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              ${viewBeneficiaries.map((beneficiary) => {
                const suffix = beneficiary.suffix && beneficiary.suffix !== 'NA' ? ` ${beneficiary.suffix}` : '';
                const mName = beneficiary.m_name ? ` ${beneficiary.m_name}` : '';
                const fullName = `${beneficiary.l_name}, ${beneficiary.f_name}${mName}${suffix}`;
                return `
                  <tr>
                    <td>${fullName}</td>
                    <td>${beneficiary.contact_no || 'N/A'}</td>
                    <td class="signature-col"></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
    
    const printDoc = printFrame.contentWindow.document;
    printDoc.open();
    printDoc.write(printContent);
    printDoc.close();
    
    printFrame.contentWindow.focus();
    setTimeout(() => {
      printFrame.contentWindow.print();
      document.body.removeChild(printFrame);
    }, 250);
  };

  const handleExportExcel = () => {
    if (!viewService || viewBeneficiaries.length === 0) return;

    const data = viewBeneficiaries.map((beneficiary, index) => {
      const suffix = beneficiary.suffix && beneficiary.suffix !== 'NA' ? ` ${beneficiary.suffix}` : '';
      const mName = beneficiary.m_name ? ` ${beneficiary.m_name}` : '';
      const fullName = `${beneficiary.l_name}, ${beneficiary.f_name}${mName}${suffix}`;
      return {
        "#": index + 1,
        "Service Name": viewService.service_name,
        "Location": viewService.location,
        "Date": formatDateOnly(viewService.date),
        "Time": formatTime(viewService.time),
        "Status": getStatusLabel(viewService.status),
        "Full Name": fullName,
        "Sex": beneficiary.sex.charAt(0).toUpperCase() + beneficiary.sex.slice(1),
        "Birthdate": formatDateOnly(beneficiary.birthdate),
        "Civil Status": beneficiary.civil_status.charAt(0).toUpperCase() + beneficiary.civil_status.slice(1),
        "Contact No.": beneficiary.contact_no || 'N/A',
        "Email": beneficiary.email || 'N/A',
        "Address": beneficiary.address || 'N/A'
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Beneficiaries");
    XLSX.writeFile(wb, `${viewService.service_name}_beneficiaries.xlsx`);
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

  const getResidentFullName = (resident) => {
    const suffix = resident.suffix && resident.suffix !== 'NA' ? ` ${resident.suffix}` : '';
    const mName = resident.m_name ? ` ${resident.m_name}` : '';
    return `${resident.l_name}, ${resident.f_name}${mName}${suffix}`;
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <div>
          <h1 className="services-title">Services</h1>
          <p className="services-subtitle">Manage community services and beneficiaries</p>
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

      <div className={`services-layout ${viewService ? 'view-mode' : ''}`}>
        <div className={`services-table-section ${viewService ? 'shrunk' : ''}`}>
          {loading ? (
            <div className="loading-state">Loading services...</div>
          ) : (
            <div className="services-table-container">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    {!viewService && <th>Date</th>}
                    {!viewService && <th>Location</th>}
                    <th>Beneficiaries</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentServices.length === 0 ? (
                    <tr>
                      <td colSpan={viewService ? 3 : 5} className="empty-state">
                        {searchTerm || statusFilter !== 'all' || monthFilter !== 'all' || yearFilter !== 'all'
                          ? 'No services found.'
                          : 'No services found. Add a new service to get started.'}
                      </td>
                    </tr>
                  ) : (
                    currentServices.map((service) => (
                      <tr 
                        key={service.id}
                        className={viewService && viewService.id === service.id ? 'selected' : ''}
                      >
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
                        {!viewService && (
                          <td>
                            <div className="date-cell">
                              <div className="date-value">{formatDateOnly(service.date)}</div>
                              <div className="time-value">{formatTime(service.time)}</div>
                            </div>
                          </td>
                        )}
                        {!viewService && (
                          <td>
                            <div className="location-cell">
                              {service.location}
                            </div>
                          </td>
                        )}
                        <td>
                          <div className="beneficiaries-count-cell">
                            {service.beneficiaries_count || 0}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                            {viewService && viewService.id === service.id ? (
                              <button
                                className="action-btn close-btn"
                                onClick={handleCloseView}
                                title="Close"
                              >
                                <X size={18} />
                              </button>
                            ) : (
                              <>
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
                              </>
                            )}
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
        </div>

        {viewService && (
          <div className="services-details-section">
            <div className="service-details-card">
              <h3 className="card-title">Service Details</h3>
              <div className="detail-content">
                <div className="detail-item">
                  <span className="detail-label">Service Name:</span>
                  <span className="detail-value">{viewService.service_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDateOnly(viewService.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{viewService.location}</span>
                </div>
                {viewService.description && (
                  <div className="detail-item">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{viewService.description}</span>
                  </div>
                )}
              </div>
              <div className="service-actions-buttons">
                <button
                  className="action-button add-beneficiaries-btn"
                  onClick={() => {
                    setShowBeneficiariesForm(true);
                  }}
                >
                  <UserPlus size={18} />
                  <span>ADD BENEFICIARY</span>
                </button>
                <button
                  className="action-button print-btn"
                  onClick={handlePrint}
                  disabled={viewBeneficiaries.length === 0}
                >
                  <Printer size={18} />
                  <span>PRINT</span>
                </button>
                <button
                  className="action-button export-excel-btn"
                  onClick={handleExportExcel}
                  disabled={viewBeneficiaries.length === 0}
                >
                  <FileSpreadsheet size={18} />
                  <span>EXPORT EXCEL</span>
                </button>
              </div>
            </div>

            <div className="beneficiaries-list-card">
              <h3 className="card-title">Beneficiaries</h3>
              {loadingBeneficiaries ? (
                <div className="loading-state">Loading beneficiaries...</div>
              ) : viewBeneficiaries.length === 0 ? (
                <div className="empty-state">No beneficiaries for this service.</div>
              ) : (
                <div className="beneficiaries-table-container">
                  <table className="beneficiaries-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewBeneficiaries.map((beneficiary) => (
                        <tr key={beneficiary.id}>
                          <td>{getResidentFullName(beneficiary)}</td>
                          <td>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleRemoveBeneficiary(beneficiary.id)}
                              title="Remove"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ServiceForm
          service={selectedService}
          onClose={() => {
            setShowForm(false);
            setSelectedService(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {showBeneficiariesForm && viewService && (
        <BeneficiariesForm
          serviceId={viewService.id}
          onClose={() => {
            setShowBeneficiariesForm(false);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {deleteService && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3 className="delete-modal-title">Confirm Delete</h3>
            <p className="delete-modal-message">
              Are you sure you want to delete service "{deleteService.service_name}"? This action cannot be undone and will also remove all associated beneficiaries.
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
