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

module.exports = {
  login
};