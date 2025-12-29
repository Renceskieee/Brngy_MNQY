const pool = require('../config');
const history = require('./history');

const getAllResidents = async (req, res) => {
  try {
    const [residents] = await pool.execute(
      `SELECT id, f_name, m_name, l_name, suffix, sex, birthdate, 
       civil_status, contact_no, email, address, created_at, updated_at 
       FROM residents 
       ORDER BY l_name ASC, f_name ASC`
    );

    res.json({
      success: true,
      residents
    });
  } catch (error) {
    console.error('Get all residents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching residents'
    });
  }
};

const getResidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [residents] = await pool.execute(
      `SELECT id, f_name, m_name, l_name, suffix, sex, birthdate, 
       civil_status, contact_no, email, address, created_at, updated_at 
       FROM residents 
       WHERE id = ?`,
      [id]
    );

    if (residents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
    }

    res.json({
      success: true,
      resident: residents[0]
    });
  } catch (error) {
    console.error('Get resident by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching resident'
    });
  }
};

const validateResidentData = (data) => {
  const errors = [];

  if (!data.f_name || !data.f_name.trim()) {
    errors.push('First name is required');
  } else if (data.f_name.trim().length > 100) {
    errors.push('First name must not exceed 100 characters');
  }

  if (data.m_name && data.m_name.trim().length > 100) {
    errors.push('Middle name must not exceed 100 characters');
  }

  if (!data.l_name || !data.l_name.trim()) {
    errors.push('Last name is required');
  } else if (data.l_name.trim().length > 100) {
    errors.push('Last name must not exceed 100 characters');
  }

  if (!['NA', 'Jr.', 'Sr.', 'II', 'III', 'IV'].includes(data.suffix)) {
    errors.push('Invalid suffix value');
  }

  if (!['male', 'female'].includes(data.sex)) {
    errors.push('Sex is required and must be male or female');
  }

  if (!data.birthdate) {
    errors.push('Birthdate is required');
  } else {
    const birthDate = new Date(data.birthdate);
    const today = new Date();
    if (birthDate > today) {
      errors.push('Birthdate cannot be in the future');
    }
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age > 150) {
      errors.push('Invalid birthdate');
    }
  }

  if (!['single', 'married', 'widowed', 'separated', 'divorced'].includes(data.civil_status)) {
    errors.push('Civil status is required');
  }

  if (data.contact_no) {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(data.contact_no) || data.contact_no.length > 20) {
      errors.push('Invalid contact number format');
    }
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email) || data.email.length > 150) {
      errors.push('Invalid email format');
    }
  }

  return errors;
};

const createResident = async (req, res) => {
  try {
    const {
      f_name,
      m_name,
      l_name,
      suffix,
      sex,
      birthdate,
      civil_status,
      contact_no,
      email,
      address
    } = req.body;

    const validationErrors = validateResidentData({
      f_name,
      m_name: m_name || null,
      l_name,
      suffix: suffix || 'NA',
      sex,
      birthdate,
      civil_status,
      contact_no: contact_no || null,
      email: email || null
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    if (contact_no) {
      const [existingContact] = await pool.execute(
        'SELECT id FROM residents WHERE contact_no = ?',
        [contact_no]
      );
      if (existingContact.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Contact number already exists'
        });
      }
    }

    if (email) {
      const [existingEmail] = await pool.execute(
        'SELECT id FROM residents WHERE email = ?',
        [email]
      );
      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO residents (f_name, m_name, l_name, suffix, sex, birthdate, 
       civil_status, contact_no, email, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        f_name.trim(),
        m_name ? m_name.trim() : null,
        l_name.trim(),
        suffix || 'NA',
        sex,
        birthdate,
        civil_status,
        contact_no ? contact_no.trim() : null,
        email ? email.trim() : null,
        address ? address.trim() : null
      ]
    );

    const [newResident] = await pool.execute(
      'SELECT * FROM residents WHERE id = ?',
      [result.insertId]
    );

    const userId = req.body.userId || req.user?.userId || null;
    if (userId) {
      const fullName = `${l_name.trim()}, ${f_name.trim()}${m_name ? ' ' + m_name.trim() : ''}${suffix && suffix !== 'NA' ? ' ' + suffix : ''}`;
      const description = `Added new resident: ${fullName}`;
      await history.createHistory(userId, result.insertId, null, description);
    }

    res.json({
      success: true,
      message: 'Resident created successfully',
      resident: newResident[0],
      residentId: result.insertId
    });
  } catch (error) {
    console.error('Create resident error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry: Contact number or email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating resident'
    });
  }
};

const updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      f_name,
      m_name,
      l_name,
      suffix,
      sex,
      birthdate,
      civil_status,
      contact_no,
      email,
      address
    } = req.body;

    const [existing] = await pool.execute('SELECT id FROM residents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
    }

    const validationErrors = validateResidentData({
      f_name,
      m_name: m_name || null,
      l_name,
      suffix: suffix || 'NA',
      sex,
      birthdate,
      civil_status,
      contact_no: contact_no || null,
      email: email || null
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    if (contact_no) {
      const [existingContact] = await pool.execute(
        'SELECT id FROM residents WHERE contact_no = ? AND id != ?',
        [contact_no, id]
      );
      if (existingContact.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Contact number already exists'
        });
      }
    }

    if (email) {
      const [existingEmail] = await pool.execute(
        'SELECT id FROM residents WHERE email = ? AND id != ?',
        [email, id]
      );
      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    await pool.execute(
      `UPDATE residents SET 
       f_name = ?, m_name = ?, l_name = ?, suffix = ?, sex = ?, 
       birthdate = ?, civil_status = ?, contact_no = ?, email = ?, address = ? 
       WHERE id = ?`,
      [
        f_name.trim(),
        m_name ? m_name.trim() : null,
        l_name.trim(),
        suffix || 'NA',
        sex,
        birthdate,
        civil_status,
        contact_no ? contact_no.trim() : null,
        email ? email.trim() : null,
        address ? address.trim() : null,
        id
      ]
    );

    const [updated] = await pool.execute('SELECT * FROM residents WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Resident updated successfully',
      resident: updated[0]
    });
  } catch (error) {
    console.error('Update resident error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry: Contact number or email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating resident'
    });
  }
};

const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute(
      'SELECT id, f_name, m_name, l_name, suffix FROM residents WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
    }

    const resident = existing[0];
    const userId = req.body.userId || req.user?.userId || null;
    
    if (userId) {
      const fullName = `${resident.l_name}, ${resident.f_name}${resident.m_name ? ' ' + resident.m_name : ''}${resident.suffix && resident.suffix !== 'NA' ? ' ' + resident.suffix : ''}`;
      const description = `Deleted resident: ${fullName}`;
      await history.createHistory(userId, id, null, description);
    }

    await pool.execute('DELETE FROM residents WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Resident deleted successfully'
    });
  } catch (error) {
    console.error('Delete resident error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting resident'
    });
  }
};

const getResidentsCount = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM residents');
    res.json({
      success: true,
      count: result[0].count
    });
  } catch (error) {
    console.error('Get residents count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching residents count'
    });
  }
};

module.exports = {
  getAllResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident,
  getResidentsCount
};

