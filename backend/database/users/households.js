const pool = require('../config');
const history = require('./history');

const getAllHouseholds = async (req, res) => {
  try {
    const [households] = await pool.execute(
      `SELECT h.id, h.household_name, h.address, h.created_at, h.updated_at,
       COUNT(hm.id) as member_count
       FROM households h
       LEFT JOIN household_members hm ON h.id = hm.household_id
       GROUP BY h.id
       ORDER BY h.household_name ASC`
    );

    res.json({
      success: true,
      households
    });
  } catch (error) {
    console.error('Get all households error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching households'
    });
  }
};

const getHouseholdById = async (req, res) => {
  try {
    const { id } = req.params;

    const [households] = await pool.execute(
      `SELECT id, household_name, address, created_at, updated_at 
       FROM households 
       WHERE id = ?`,
      [id]
    );

    if (households.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    const [members] = await pool.execute(
      `SELECT hm.id, hm.household_id, hm.resident_id, hm.role, hm.added_at,
       r.f_name, r.m_name, r.l_name, r.suffix, r.sex, r.birthdate
       FROM household_members hm
       JOIN residents r ON hm.resident_id = r.id
       WHERE hm.household_id = ?
       ORDER BY 
         CASE hm.role
           WHEN 'head' THEN 1
           WHEN 'member' THEN 2
           WHEN 'dependent' THEN 3
         END,
         r.l_name ASC, r.f_name ASC`,
      [id]
    );

    res.json({
      success: true,
      household: {
        ...households[0],
        members
      }
    });
  } catch (error) {
    console.error('Get household by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching household'
    });
  }
};

const validateHouseholdData = (data) => {
  const errors = [];

  if (!data.household_name || !data.household_name.trim()) {
    errors.push('Household name is required');
  } else if (data.household_name.trim().length > 150) {
    errors.push('Household name must not exceed 150 characters');
  }

  if (!data.address || !data.address.trim()) {
    errors.push('Address is required');
  }

  return errors;
};

const createHousehold = async (req, res) => {
  try {
    const { household_name, address, members } = req.body;

    const validationErrors = validateHouseholdData({
      household_name,
      address
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.execute(
        `INSERT INTO households (household_name, address) 
         VALUES (?, ?)`,
        [household_name.trim(), address.trim()]
      );

      const householdId = result.insertId;

      if (members && Array.isArray(members) && members.length > 0) {
        for (const member of members) {
          if (member.resident_id && member.role) {
            const [existingMember] = await connection.execute(
              'SELECT id FROM household_members WHERE resident_id = ?',
              [member.resident_id]
            );

            if (existingMember.length > 0) {
              await connection.rollback();
              connection.release();
              return res.status(400).json({
                success: false,
                message: 'One or more residents are already assigned to another household'
              });
            }

            await connection.execute(
              `INSERT INTO household_members (household_id, resident_id, role) 
               VALUES (?, ?, ?)`,
              [householdId, member.resident_id, member.role]
            );
          }
        }
      }

      await connection.commit();
      connection.release();

      const userId = req.body.userId || req.user?.userId || null;
      if (userId) {
        const description = `Added new household: ${household_name.trim()}`;
        await history.createHistory(userId, null, householdId, description);
      }

      const [newHousehold] = await pool.execute(
        'SELECT * FROM households WHERE id = ?',
        [householdId]
      );

      res.json({
        success: true,
        message: 'Household created successfully',
        household: newHousehold[0],
        householdId
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Create household error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry: Household name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating household'
    });
  }
};

const updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const { household_name, address, members } = req.body;

    const [existing] = await pool.execute('SELECT id FROM households WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    const validationErrors = validateHouseholdData({
      household_name,
      address
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.execute(
        `UPDATE households SET household_name = ?, address = ? WHERE id = ?`,
        [household_name.trim(), address.trim(), id]
      );

      if (members && Array.isArray(members)) {
        await connection.execute(
          'DELETE FROM household_members WHERE household_id = ?',
          [id]
        );

        for (const member of members) {
          if (member.resident_id && member.role) {
            const [existingMember] = await connection.execute(
              'SELECT id FROM household_members WHERE resident_id = ? AND household_id != ?',
              [member.resident_id, id]
            );

            if (existingMember.length > 0) {
              await connection.rollback();
              connection.release();
              return res.status(400).json({
                success: false,
                message: 'One or more residents are already assigned to another household'
              });
            }

            await connection.execute(
              `INSERT INTO household_members (household_id, resident_id, role) 
               VALUES (?, ?, ?)`,
              [id, member.resident_id, member.role]
            );
          }
        }
      }

      await connection.commit();
      connection.release();

      const [updated] = await pool.execute('SELECT * FROM households WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Household updated successfully',
        household: updated[0]
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Update household error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry: Household name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating household'
    });
  }
};

const deleteHousehold = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute(
      'SELECT id, household_name FROM households WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    const household = existing[0];
    const userId = req.body.userId || req.user?.userId || null;
    
    if (userId) {
      const description = `Deleted household: ${household.household_name}`;
      await history.createHistory(userId, null, id, description);
    }

    await pool.execute('DELETE FROM households WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Household deleted successfully'
    });
  } catch (error) {
    console.error('Delete household error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting household'
    });
  }
};

const getHouseholdsCount = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM households');
    res.json({
      success: true,
      count: result[0].count
    });
  } catch (error) {
    console.error('Get households count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching households count'
    });
  }
};

module.exports = {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
  getHouseholdsCount
};

