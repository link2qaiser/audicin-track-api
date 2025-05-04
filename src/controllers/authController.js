const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');

/**
 * Login user and return JWT token
 */
const login = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  db.get(
    'SELECT id, username, password, role FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user);
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }
  );
};

/**
 * Register a new user
 */
const signup = (req, res, next) => {
  const { username, password, role } = req.body;

  // Validate request
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  if (!role || !['admin', 'partner'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either "admin" or "partner"' });
  }

  // Check if username already exists
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      // Insert new user
      db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role],
        function(err) {
          if (err) {
            return next(err);
          }

          const newUser = {
            id: this.lastID,
            username,
            role
          };

          // Generate token
          const token = generateToken(newUser);

          res.status(201).json({
            token,
            user: newUser
          });
        }
      );
    });
  });
};

module.exports = {
  login,
  signup
};