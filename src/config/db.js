const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../audicin.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'partner'))
      )
    `);

    // Create Tracks table
    db.run(`
      CREATE TABLE IF NOT EXISTS tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        genre TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Licenses table
    db.run(`
      CREATE TABLE IF NOT EXISTS licenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        track_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        license_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (track_id) REFERENCES tracks (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Insert default admin and partner users if they don't exist
    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      
      if (row.count === 0) {
        const adminPassword = bcrypt.hashSync('admin123', 10);
        const partnerPassword = bcrypt.hashSync('partner123', 10);
        
        db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
          ["admin", adminPassword, "admin"]);
        
        db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
          ["partner", partnerPassword, "partner"]);
          
        console.log('Default users created');
      }
    });
  });
}

module.exports = db;