const pool = require('../config');
const history = require('./history');

const getAllIncidents = async (req, res) => {
  try {
    const { status, month, year } = req.query;
    let query = `SELECT id, reference_number, incident_type, location, date, time, 
                 complainant, respondent, description, status, created_at, updated_at 
                 FROM incidents WHERE 1=1`;
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (month && month !== 'all') {
      query += ' AND MONTH(date) = ?';
      params.push(parseInt(month));
    }

    if (year && year !== 'all') {
      query += ' AND YEAR(date) = ?';
      params.push(parseInt(year));
    }

    query += ' ORDER BY date DESC, time DESC';

    const [incidents] = await pool.execute(query, params);

    res.json({
      success: true,
      incidents
    });
  } catch (error) {
    console.error('Get all incidents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching incidents'
    });
  }
};

const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [incidents] = await pool.execute(
      `SELECT id, reference_number, incident_type, location, date, time, 
       complainant, respondent, description, status, created_at, updated_at 
       FROM incidents 
       WHERE id = ?`,
      [id]
    );

    if (incidents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    res.json({
      success: true,
      incident: incidents[0]
    });
  } catch (error) {
    console.error('Get incident by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching incident'
    });
  }
};

const validateIncidentData = (data, isUpdate = false) => {
  const errors = [];

  if (isUpdate && data.reference_number) {
    if (data.reference_number.trim().length > 50) {
      errors.push('Reference number must not exceed 50 characters');
    }
  }

  if (!data.incident_type || !data.incident_type.trim()) {
    errors.push('Incident type is required');
  } else if (data.incident_type.trim().length > 100) {
    errors.push('Incident type must not exceed 100 characters');
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

  if (!data.complainant || !data.complainant.trim()) {
    errors.push('Complainant is required');
  } else if (data.complainant.trim().length > 150) {
    errors.push('Complainant must not exceed 150 characters');
  }

  if (!data.respondent || !data.respondent.trim()) {
    errors.push('Respondent is required');
  } else if (data.respondent.trim().length > 150) {
    errors.push('Respondent must not exceed 150 characters');
  }

  if (!data.description || !data.description.trim()) {
    errors.push('Description is required');
  }

  if (data.status && !['pending', 'ongoing', 'resolved', 'dismissed'].includes(data.status)) {
    errors.push('Invalid status value');
  }

  return errors;
};

const createIncident = async (req, res) => {
  try {
    const {
      incident_type,
      location,
      date,
      time,
      complainant,
      respondent,
      description,
      status
    } = req.body;

    const validationErrors = validateIncidentData({
      incident_type,
      location,
      date,
      time,
      complainant,
      respondent,
      description,
      status: status || 'pending'
    }, false);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO incidents (incident_type, location, date, time, 
       complainant, respondent, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        incident_type.trim(),
        location.trim(),
        date,
        time,
        complainant.trim(),
        respondent.trim(),
        description.trim(),
        status || 'pending'
      ]
    );

    const [newIncident] = await pool.execute(
      'SELECT * FROM incidents WHERE id = ?',
      [result.insertId]
    );

    const userId = req.body.userId || req.user?.userId || null;
    if (userId && newIncident[0]) {
      const description = `Added new incident: ${newIncident[0].reference_number}`;
      await history.createHistory(userId, null, null, description, result.insertId);
    }

    res.json({
      success: true,
      message: 'Incident created successfully',
      incident: newIncident[0],
      incidentId: result.insertId
    });
  } catch (error) {
    console.error('Create incident error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry: An error occurred while creating the incident'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating incident'
    });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reference_number,
      incident_type,
      location,
      date,
      time,
      complainant,
      respondent,
      description,
      status
    } = req.body;

    const [existing] = await pool.execute(
      'SELECT id, reference_number, status FROM incidents WHERE id = ?', 
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    const validationErrors = validateIncidentData({
      reference_number: reference_number || existing[0].reference_number,
      incident_type,
      location,
      date,
      time,
      complainant,
      respondent,
      description,
      status: status || existing[0].status
    }, true);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    if (reference_number && reference_number !== existing[0].reference_number) {
      const [existingRef] = await pool.execute(
        'SELECT id FROM incidents WHERE reference_number = ? AND id != ?',
        [reference_number, id]
      );
      if (existingRef.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Reference number already exists'
        });
      }
    }

    await pool.execute(
      `UPDATE incidents SET 
       ${reference_number ? 'reference_number = ?,' : ''} 
       incident_type = ?, location = ?, date = ?, time = ?, 
       complainant = ?, respondent = ?, description = ?, status = ? 
       WHERE id = ?`,
      reference_number 
        ? [
            reference_number.trim(),
            incident_type.trim(),
            location.trim(),
            date,
            time,
            complainant.trim(),
            respondent.trim(),
            description.trim(),
            status || existing[0].status,
            id
          ]
        : [
            incident_type.trim(),
            location.trim(),
            date,
            time,
            complainant.trim(),
            respondent.trim(),
            description.trim(),
            status || existing[0].status,
            id
          ]
    );

    const [updated] = await pool.execute('SELECT * FROM incidents WHERE id = ?', [id]);

    const userId = req.body.userId || req.user?.userId || null;
    if (userId && updated[0]) {
      const description = `Updated incident: ${updated[0].reference_number}`;
      await history.createHistory(userId, null, null, description, id);
    }

    res.json({
      success: true,
      message: 'Incident updated successfully',
      incident: updated[0]
    });
  } catch (error) {
    console.error('Update incident error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry: Reference number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating incident'
    });
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute(
      'SELECT id, reference_number FROM incidents WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    const incident = existing[0];
    const userId = req.body.userId || req.user?.userId || null;
    
    if (userId) {
      const description = `Deleted incident: ${incident.reference_number}`;
      await history.createHistory(userId, null, null, description, id);
    }

    await pool.execute('DELETE FROM incidents WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Incident deleted successfully'
    });
  } catch (error) {
    console.error('Delete incident error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting incident'
    });
  }
};

const getIncidentsCount = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM incidents');
    res.json({
      success: true,
      count: result[0].count
    });
  } catch (error) {
    console.error('Get incidents count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching incidents count'
    });
  }
};

module.exports = {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentsCount
};