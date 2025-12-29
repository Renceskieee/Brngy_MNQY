const pool = require('../config');

const createTimeLog = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO time_log (user_id) VALUES (?)',
      [userId]
    );

    res.json({
      success: true,
      message: 'Time log created successfully',
      timeLogId: result.insertId
    });
  } catch (error) {
    console.error('Create time log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating time log'
    });
  }
};

const updateTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { logged_out } = req.body;

    const [existing] = await pool.execute('SELECT id FROM time_log WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Time log not found'
      });
    }

    await pool.execute(
      'UPDATE time_log SET logged_out = ? WHERE id = ?',
      [logged_out || new Date(), id]
    );

    res.json({
      success: true,
      message: 'Time log updated successfully'
    });
  } catch (error) {
    console.error('Update time log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating time log'
    });
  }
};

const getTimeLogs = async (req, res) => {
  try {
    const { userId, limit } = req.query;
    let query = `
      SELECT tl.id, tl.user_id, tl.logged_in, tl.logged_out,
      u.first_name, u.last_name, u.employee_id
      FROM time_log tl
      JOIN users u ON tl.user_id = u.id
    `;
    const params = [];

    if (userId) {
      query += ' WHERE tl.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY tl.logged_in DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [timeLogs] = await pool.execute(query, params);

    res.json({
      success: true,
      timeLogs
    });
  } catch (error) {
    console.error('Get time logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching time logs'
    });
  }
};

const getTimeLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const [timeLogs] = await pool.execute(
      `SELECT tl.id, tl.user_id, tl.logged_in, tl.logged_out,
       u.first_name, u.last_name, u.employee_id
       FROM time_log tl
       JOIN users u ON tl.user_id = u.id
       WHERE tl.id = ?`,
      [id]
    );

    if (timeLogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Time log not found'
      });
    }

    res.json({
      success: true,
      timeLog: timeLogs[0]
    });
  } catch (error) {
    console.error('Get time log by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching time log'
    });
  }
};

module.exports = {
  createTimeLog,
  updateTimeLog,
  getTimeLogs,
  getTimeLogById
};

