const pool = require('../config');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let uploadPath = '';
    if (file.fieldname === 'logo') {
      uploadPath = path.join(__dirname, '../../uploads/logo');
    } else if (file.fieldname === 'carousel') {
      uploadPath = path.join(__dirname, '../../uploads/personalisation/images');
    }
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'carousel', maxCount: 10 }
]);

const getPersonalisation = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM personalisation WHERE id = 1'
    );

    if (rows.length === 0) {
      const [insertResult] = await pool.execute(
        `INSERT INTO personalisation (id, logo, header_title, header_color, footer_title, footer_color, login_color, profile_bg, active_nav_color, button_color) 
         VALUES (1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`
      );
      
      const [newRows] = await pool.execute(
        'SELECT * FROM personalisation WHERE id = 1'
      );
      
      return res.json({
        success: true,
        personalisation: newRows[0]
      });
    }

    res.json({
      success: true,
      personalisation: rows[0]
    });
  } catch (error) {
    console.error('Get personalisation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching personalisation'
    });
  }
};

const updatePersonalisation = async (req, res) => {
  try {
    const {
      header_title,
      header_color,
      footer_title,
      footer_color,
      login_color,
      profile_bg,
      active_nav_color,
      button_color
    } = req.body;

    const updates = [];
    const values = [];

    if (header_title !== undefined) {
      updates.push('header_title = ?');
      values.push(header_title);
    }
    if (header_color !== undefined) {
      updates.push('header_color = ?');
      values.push(header_color);
    }
    if (footer_title !== undefined) {
      updates.push('footer_title = ?');
      values.push(footer_title);
    }
    if (footer_color !== undefined) {
      updates.push('footer_color = ?');
      values.push(footer_color);
    }
    if (login_color !== undefined) {
      updates.push('login_color = ?');
      values.push(login_color);
    }
    if (profile_bg !== undefined) {
      updates.push('profile_bg = ?');
      values.push(profile_bg);
    }
    if (active_nav_color !== undefined) {
      updates.push('active_nav_color = ?');
      values.push(active_nav_color);
    }
    if (button_color !== undefined) {
      updates.push('button_color = ?');
      values.push(button_color);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    await pool.execute(
      `UPDATE personalisation SET ${updates.join(', ')} WHERE id = 1`,
      values
    );

    const [rows] = await pool.execute('SELECT * FROM personalisation WHERE id = 1');

    res.json({
      success: true,
      message: 'Personalisation updated successfully',
      personalisation: rows[0]
    });
  } catch (error) {
    console.error('Update personalisation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating personalisation'
    });
  }
};

const uploadLogo = async (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || !req.files['logo']) {
      return res.status(400).json({
        success: false,
        message: 'Logo file is required'
      });
    }

    try {
      const logoFile = req.files['logo'][0];
      const logoPath = `/uploads/logo/${logoFile.filename}`;

      const [rows] = await pool.execute('SELECT logo FROM personalisation WHERE id = 1');
      if (rows.length > 0 && rows[0].logo) {
        const oldLogoPath = path.join(__dirname, '../../uploads/logo', path.basename(rows[0].logo));
        try {
          await fs.unlink(oldLogoPath);
        } catch (unlinkError) {
          console.error('Error deleting old logo:', unlinkError);
        }
      }

      await pool.execute(
        'UPDATE personalisation SET logo = ? WHERE id = 1',
        [logoPath]
      );

      const [updatedRows] = await pool.execute('SELECT * FROM personalisation WHERE id = 1');

      res.json({
        success: true,
        message: 'Logo uploaded successfully',
        personalisation: updatedRows[0]
      });
    } catch (error) {
      console.error('Upload logo error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error uploading logo'
      });
    }
  });
};

const getCarousel = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM carousel ORDER BY position ASC, posted_at DESC'
    );

    res.json({
      success: true,
      carousel: rows
    });
  } catch (error) {
    console.error('Get carousel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching carousel'
    });
  }
};

const addCarouselImage = async (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || !req.files['carousel']) {
      return res.status(400).json({
        success: false,
        message: 'Carousel image is required'
      });
    }

    try {
      const carouselFile = req.files['carousel'][0];
      const imagePath = `/uploads/personalisation/images/${carouselFile.filename}`;
      const position = req.body.position || 1;

      const [result] = await pool.execute(
        'INSERT INTO carousel (picture, position) VALUES (?, ?)',
        [imagePath, position]
      );

      const [rows] = await pool.execute('SELECT * FROM carousel WHERE id = ?', [result.insertId]);

      res.json({
        success: true,
        message: 'Carousel image added successfully',
        carousel: rows[0]
      });
    } catch (error) {
      console.error('Add carousel image error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error adding carousel image'
      });
    }
  });
};

const updateCarouselPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;

    if (position === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Position is required'
      });
    }

    await pool.execute(
      'UPDATE carousel SET position = ? WHERE id = ?',
      [position, id]
    );

    res.json({
      success: true,
      message: 'Carousel position updated successfully'
    });
  } catch (error) {
    console.error('Update carousel position error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating carousel position'
    });
  }
};

const deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute('SELECT picture FROM carousel WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carousel image not found'
      });
    }

    const imagePath = path.join(__dirname, '../../uploads/personalisation/images', path.basename(rows[0].picture));
    try {
      await fs.unlink(imagePath);
    } catch (unlinkError) {
      console.error('Error deleting carousel image file:', unlinkError);
    }

    await pool.execute('DELETE FROM carousel WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Carousel image deleted successfully'
    });
  } catch (error) {
    console.error('Delete carousel image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting carousel image'
    });
  }
};

module.exports = {
  getPersonalisation,
  updatePersonalisation,
  uploadLogo,
  getCarousel,
  addCarouselImage,
  updateCarouselPosition,
  deleteCarouselImage,
  uploadMiddleware: uploadFields
};

