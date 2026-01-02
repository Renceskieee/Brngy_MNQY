const pool = require('../config');
const history = require('./history');

const getAllServices = async (req, res) => {
  try {
    const [services] = await pool.execute(
      `SELECT id, service_name, location, date, time, status, description, created_at, updated_at 
       FROM services 
       ORDER BY date DESC, time DESC`
    );

    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching services'
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [services] = await pool.execute(
      `SELECT id, service_name, location, date, time, status, description, created_at, updated_at 
       FROM services 
       WHERE id = ?`,
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service: services[0]
    });
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching service'
    });
  }
};

const getServiceBeneficiaries = async (req, res) => {
  try {
    const { id } = req.params;

    const [beneficiaries] = await pool.execute(
      `SELECT sb.id, sb.service_id, sb.resident_id, sb.added_at,
       r.f_name, r.m_name, r.l_name, r.suffix, r.sex, r.birthdate, r.contact_no, r.email, r.address
       FROM service_beneficiaries sb
       JOIN residents r ON sb.resident_id = r.id
       WHERE sb.service_id = ?
       ORDER BY sb.added_at DESC`,
      [id]
    );

    res.json({
      success: true,
      beneficiaries
    });
  } catch (error) {
    console.error('Get service beneficiaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching beneficiaries'
    });
  }
};

const validateServiceData = (data) => {
  const errors = [];

  if (!data.service_name || !data.service_name.trim()) {
    errors.push('Service name is required');
  } else if (data.service_name.trim().length > 150) {
    errors.push('Service name must not exceed 150 characters');
  }

  if (!data.location || !data.location.trim()) {
    errors.push('Location is required');
  }

  if (!data.date) {
    errors.push('Date is required');
  }

  if (!data.time) {
    errors.push('Time is required');
  }

  if (!data.description || !data.description.trim()) {
    errors.push('Description is required');
  }

  if (data.status && !['scheduled', 'ongoing', 'completed'].includes(data.status)) {
    errors.push('Invalid status value');
  }

  return errors;
};

const createService = async (req, res) => {
  try {
    const {
      service_name,
      location,
      date,
      time,
      status,
      description
    } = req.body;

    const validationErrors = validateServiceData({
      service_name,
      location,
      date,
      time,
      status: status || 'scheduled',
      description
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO services (service_name, location, date, time, status, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        service_name.trim(),
        location.trim(),
        date,
        time,
        status || 'scheduled',
        description.trim()
      ]
    );

    const [newService] = await pool.execute(
      'SELECT * FROM services WHERE id = ?',
      [result.insertId]
    );

    const userId = req.body.userId || req.user?.userId || null;
    if (userId && newService[0]) {
      const description = `Added new service: ${newService[0].service_name}`;
      await history.createHistory(userId, null, null, description, null, result.insertId);
    }

    res.json({
      success: true,
      message: 'Service created successfully',
      service: newService[0],
      serviceId: result.insertId
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating service'
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      service_name,
      location,
      date,
      time,
      status,
      description
    } = req.body;

    const [existing] = await pool.execute(
      'SELECT id, service_name, status FROM services WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const validationErrors = validateServiceData({
      service_name,
      location,
      date,
      time,
      status: status || existing[0].status,
      description
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    await pool.execute(
      `UPDATE services SET 
       service_name = ?, location = ?, date = ?, time = ?, status = ?, description = ? 
       WHERE id = ?`,
      [
        service_name.trim(),
        location.trim(),
        date,
        time,
        status || existing[0].status,
        description.trim(),
        id
      ]
    );

    const [updated] = await pool.execute('SELECT * FROM services WHERE id = ?', [id]);

    const userId = req.body.userId || req.user?.userId || null;
    if (userId && updated[0]) {
      const description = `Updated service: ${updated[0].service_name}`;
      await history.createHistory(userId, null, null, description, null, id);
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service: updated[0]
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating service'
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute(
      'SELECT id, service_name FROM services WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const service = existing[0];
    const userId = req.body.userId || req.user?.userId || null;

    if (userId) {
      const description = `Deleted service: ${service.service_name}`;
      await history.createHistory(userId, null, null, description, null, id);
    }

    await pool.execute('DELETE FROM service_beneficiaries WHERE service_id = ?', [id]);
    await pool.execute('DELETE FROM services WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting service'
    });
  }
};

const addBeneficiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { resident_id } = req.body;

    if (!resident_id) {
      return res.status(400).json({
        success: false,
        message: 'Resident ID is required'
      });
    }

    const [existingService] = await pool.execute(
      'SELECT id FROM services WHERE id = ?',
      [id]
    );

    if (existingService.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const [existingResident] = await pool.execute(
      'SELECT id FROM residents WHERE id = ?',
      [resident_id]
    );

    if (existingResident.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
    }

    const [existingBeneficiary] = await pool.execute(
      'SELECT id FROM service_beneficiaries WHERE service_id = ? AND resident_id = ?',
      [id, resident_id]
    );

    if (existingBeneficiary.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Resident is already a beneficiary of this service'
      });
    }

    await pool.execute(
      'INSERT INTO service_beneficiaries (service_id, resident_id) VALUES (?, ?)',
      [id, resident_id]
    );

    res.json({
      success: true,
      message: 'Beneficiary added successfully'
    });
  } catch (error) {
    console.error('Add beneficiary error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Resident is already a beneficiary of this service'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error adding beneficiary'
    });
  }
};

const removeBeneficiary = async (req, res) => {
  try {
    const { id, beneficiaryId } = req.params;

    const [existing] = await pool.execute(
      'SELECT id FROM service_beneficiaries WHERE id = ? AND service_id = ?',
      [beneficiaryId, id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    await pool.execute(
      'DELETE FROM service_beneficiaries WHERE id = ?',
      [beneficiaryId]
    );

    res.json({
      success: true,
      message: 'Beneficiary removed successfully'
    });
  } catch (error) {
    console.error('Remove beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing beneficiary'
    });
  }
};

const getServicesCount = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM services');
    res.json({
      success: true,
      count: result[0].count
    });
  } catch (error) {
    console.error('Get services count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching services count'
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  getServiceBeneficiaries,
  createService,
  updateService,
  deleteService,
  addBeneficiary,
  removeBeneficiary,
  getServicesCount
};

