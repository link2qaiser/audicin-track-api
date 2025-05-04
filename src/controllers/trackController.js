const db = require('../config/db');

/**
 * Upload a new track (Admin only)
 */
const uploadTrack = (req, res, next) => {
  const { title, description, genre } = req.body;

  // Validate request
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'INSERT INTO tracks (title, description, genre) VALUES (?, ?, ?)',
    [title, description || '', genre || ''],
    function(err) {
      if (err) {
        return next(err);
      }

      res.status(201).json({
        id: this.lastID,
        title,
        description,
        genre
      });
    }
  );
};

/**
 * Get all tracks (Partner only)
 */
const getTracks = (req, res, next) => {
  db.all('SELECT * FROM tracks', [], (err, tracks) => {
    if (err) {
      return next(err);
    }

    res.json(tracks);
  });
};

module.exports = {
  uploadTrack,
  getTracks
};