const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const { generateToken } = require('../src/utils/jwt');

// Mock admin user for testing
const adminUser = {
  id: 1,
  username: 'admin',
  role: 'admin'
};

// Generate token for admin
const adminToken = generateToken(adminUser);

describe('Track API', () => {
  // Test POST /api/tracks endpoint
  describe('POST /api/tracks', () => {
    it('should create a new track when admin is authenticated', async () => {
      const newTrack = {
        title: 'Test Track',
        description: 'A test track description',
        genre: 'Test Genre'
      };

      const response = await request(app)
        .post('/api/tracks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newTrack);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTrack.title);
      expect(response.body.description).toBe(newTrack.description);
      expect(response.body.genre).toBe(newTrack.genre);
    });

    it('should return 401 if no token is provided', async () => {
      const newTrack = {
        title: 'Test Track',
        description: 'A test track description',
        genre: 'Test Genre'
      };

      const response = await request(app)
        .post('/api/tracks')
        .send(newTrack);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if title is missing', async () => {
      const invalidTrack = {
        description: 'A test track description',
        genre: 'Test Genre'
      };

      const response = await request(app)
        .post('/api/tracks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidTrack);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});

// Close database connection after all tests
afterAll((done) => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    done();
  });
});