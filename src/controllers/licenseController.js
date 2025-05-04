const db = require('../config/db');

/**
 * Create a new license (Partner only)
 */
const createLicense = (req, res, next) => {
  const { trackId } = req.body;
  const userId = req.user.id;

  if (!trackId) {
    return res.status(400).json({ error: 'Track ID is required' });
  }

  // Check if track exists
  db.get('SELECT * FROM tracks WHERE id = ?', [trackId], (err, track) => {
    if (err) {
      return next(err);
    }

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Check if license already exists
    db.get(
      'SELECT * FROM licenses WHERE track_id = ? AND user_id = ?',
      [trackId, userId],
      (err, license) => {
        if (err) {
          return next(err);
        }

        if (license) {
          return res.status(400).json({ error: 'Track already licensed' });
        }

        // Create license
        db.run(
          'INSERT INTO licenses (track_id, user_id) VALUES (?, ?)',
          [trackId, userId],
          function(err) {
            if (err) {
              return next(err);
            }

            res.status(201).json({
              id: this.lastID,
              trackId,
              userId,
              licenseDate: new Date().toISOString()
            });
          }
        );
      }
    );
  });
};

/**
 * Get all licenses for current user (Partner only)
 */
const getLicenses = (req, res, next) => {
  const userId = req.user.id;

  db.all(
    `SELECT l.id, l.license_date, t.id as track_id, t.title, t.description, t.genre
     FROM licenses l
     JOIN tracks t ON l.track_id = t.id
     WHERE l.user_id = ?`,
    [userId],
    (err, licenses) => {
      if (err) {
        return next(err);
      }

      res.json(licenses);
    }
  );
};

module.exports = {
  createLicense,
  getLicenses
};