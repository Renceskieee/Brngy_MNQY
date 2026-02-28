const pool = require('../config');
const history = require('./history');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/residents');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resident-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

const getAllResidents = async (req, res) => {
  try {
    const [residents] = await pool.execute(
      `SELECT id, f_name, m_name, l_name, suffix, sex, birthdate, 
       civil_status, educ_background, work_status, youth_classification,
       contact_no, email, address, profile, created_at, updated_at 
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
       civil_status, educ_background, work_status, youth_classification,
       contact_no, email, address, profile, created_at, updated_at 
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

  const validCivilStatus = ['single', 'married', 'widowed', 'separated', 'annulled', 'divorced', 'live-in', 'unknown'];
  if (!validCivilStatus.includes(data.civil_status)) {
    errors.push('Civil status is required');
  }

  const validEducBackground = ['Elementary Level', 'Elementary Graduate', 'High School Level', 'High School Graduate', 'Vocational Graduate', 'College Level', 'College Graduate', 'Masters Level', 'Masters Graduate', 'Doctorate Level', 'Doctorate Graduate'];
  if (data.educ_background && !validEducBackground.includes(data.educ_background)) {
    errors.push('Invalid educational background value');
  }

  const validWorkStatus = ['Employed', 'Unemployed', 'Self-Employed', 'Currently looking for a job', 'Not interested looking for a job'];
  if (data.work_status && !validWorkStatus.includes(data.work_status)) {
    errors.push('Invalid work status value');
  }

  const validYouthClassification = ['In School Youth', 'Out of School Youth', 'Working Youth', 'Youth w/ Specific Needs', 'Indigenous People', 'Children In Conflict w/ Law', 'Person w/ Disability'];
  if (data.youth_classification && !validYouthClassification.includes(data.youth_classification)) {
    errors.push('Invalid youth classification value');
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
      educ_background,
      work_status,
      youth_classification,
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
      educ_background: educ_background || null,
      work_status: work_status || null,
      youth_classification: youth_classification || null,
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

    let profilePath = null;
    if (req.file) {
      profilePath = `/uploads/residents/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      `INSERT INTO residents (f_name, m_name, l_name, suffix, sex, birthdate, 
       civil_status, educ_background, work_status, youth_classification,
       contact_no, email, address, profile) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        f_name.trim(),
        m_name ? m_name.trim() : null,
        l_name.trim(),
        suffix || 'NA',
        sex,
        birthdate,
        civil_status,
        educ_background ? educ_background : null,
        work_status ? work_status : null,
        youth_classification ? youth_classification : null,
        contact_no ? contact_no.trim() : null,
        email ? email.trim() : null,
        address ? address.trim() : null,
        profilePath
      ]
    );

    const [newResident] = await pool.execute(
      'SELECT * FROM residents WHERE id = ?',
      [result.insertId]
    );

    const userId = req.body.userId || req.user?.userId || null;
    if (userId && newResident[0]) {
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
      educ_background,
      work_status,
      youth_classification,
      contact_no,
      email,
      address
    } = req.body;

    const [existing] = await pool.execute('SELECT id, profile FROM residents WHERE id = ?', [id]);
    if (existing.length === 0) {
      if (req.file) {
        const filePath = path.join(__dirname, '../../uploads/residents', req.file.filename);
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError);
        }
      }
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
      educ_background: educ_background || null,
      work_status: work_status || null,
      youth_classification: youth_classification || null,
      contact_no: contact_no || null,
      email: email || null
    });

    if (validationErrors.length > 0) {
      if (req.file) {
        const filePath = path.join(__dirname, '../../uploads/residents', req.file.filename);
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError);
        }
      }
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
        if (req.file) {
          const filePath = path.join(__dirname, '../../uploads/residents', req.file.filename);
          try {
            await fs.unlink(filePath);
          } catch (unlinkError) {
            console.error('Error deleting uploaded file:', unlinkError);
          }
        }
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
        if (req.file) {
          const filePath = path.join(__dirname, '../../uploads/residents', req.file.filename);
          try {
            await fs.unlink(filePath);
          } catch (unlinkError) {
            console.error('Error deleting uploaded file:', unlinkError);
          }
        }
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    let profilePath = existing[0].profile;
    const removeProfile = req.body.removeProfile === 'true' || req.body.removeProfile === true;
    if (removeProfile && existing[0].profile) {
      const oldFilePath = path.join(__dirname, '../../uploads/residents', path.basename(existing[0].profile));
      try {
        await fs.unlink(oldFilePath);
      } catch (unlinkError) {
        console.error('Error deleting profile picture:', unlinkError);
      }
      profilePath = null;
    } else if (req.file) {
      if (existing[0].profile) {
        const oldFilePath = path.join(__dirname, '../../uploads/residents', path.basename(existing[0].profile));
        try {
          await fs.unlink(oldFilePath);
        } catch (unlinkError) {
          console.error('Error deleting old profile picture:', unlinkError);
        }
      }
      profilePath = `/uploads/residents/${req.file.filename}`;
    }

    await pool.execute(
      `UPDATE residents SET 
       f_name = ?, m_name = ?, l_name = ?, suffix = ?, sex = ?, 
       birthdate = ?, civil_status = ?, educ_background = ?, work_status = ?,
       youth_classification = ?, contact_no = ?, email = ?, address = ?, profile = ? 
       WHERE id = ?`,
      [
        f_name.trim(),
        m_name ? m_name.trim() : null,
        l_name.trim(),
        suffix || 'NA',
        sex,
        birthdate,
        civil_status,
        educ_background ? educ_background : null,
        work_status ? work_status : null,
        youth_classification ? youth_classification : null,
        contact_no ? contact_no.trim() : null,
        email ? email.trim() : null,
        address ? address.trim() : null,
        profilePath,
        id
      ]
    );

    const [updated] = await pool.execute('SELECT * FROM residents WHERE id = ?', [id]);

    const userId = req.body.userId || req.user?.userId || null;
    if (userId && updated[0]) {
      const fullName = `${l_name.trim()}, ${f_name.trim()}${m_name ? ' ' + m_name.trim() : ''}${suffix && suffix !== 'NA' ? ' ' + suffix : ''}`;
      const description = `Updated resident: ${fullName}`;
      await history.createHistory(userId, id, null, description);
    }

    res.json({
      success: true,
      message: 'Resident updated successfully',
      resident: updated[0]
    });
  } catch (error) {
    console.error('Update resident error:', error);
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/residents', req.file.filename);
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
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
      'SELECT id, f_name, m_name, l_name, suffix, profile FROM residents WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
    }

    const resident = existing[0];
    if (resident.profile) {
      const filePath = path.join(__dirname, '../../uploads/residents', path.basename(resident.profile));
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting profile picture:', unlinkError);
      }
    }

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

const uploadMiddleware = upload.single('profile');

module.exports = {
  getAllResidents,
  getResidentById,
  createResident: (req, res) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        });
      }
      createResident(req, res);
    });
  },
  updateResident: (req, res) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        });
      }
      updateResident(req, res);
    });
  },
  deleteResident,
  getResidentsCount
};
