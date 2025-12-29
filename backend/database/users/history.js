const pool = require('../config');

const createHistory = async (userId, residentId, householdId, description) => {
  try {
    await pool.execute(
      'INSERT INTO history (user_id, resident_id, household_id, description) VALUES (?, ?, ?, ?)',
      [userId, residentId || null, householdId || null, description]
    );
    return true;
  } catch (error) {
    console.error('Create history error:', error);
    return false;
  }
};

const getRecentHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const [history] = await pool.execute(
      `SELECT h.id, h.user_id, h.resident_id, h.household_id, h.description, h.timestamp,
       u.first_name as user_first_name, u.last_name as user_last_name,
       r.f_name as resident_f_name, r.m_name as resident_m_name, 
       r.l_name as resident_l_name, r.suffix as resident_suffix,
       hh.household_name
       FROM history h
       LEFT JOIN users u ON h.user_id = u.id
       LEFT JOIN residents r ON h.resident_id = r.id
       LEFT JOIN households hh ON h.household_id = hh.id
       ORDER BY h.timestamp DESC
       LIMIT ?`,
      [limit]
    );

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get recent history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching history'
    });
  }
};

module.exports = {
  createHistory,
  getRecentHistory
};

