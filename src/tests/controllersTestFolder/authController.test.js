const request = require('supertest');
const express = require('express');
const pool = require('../../db');
const { registerUser, loginUser, getAllUsers } = require('../../controllers/authController');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Setup the Express app and routes for testing
const app = express();
app.use(bodyParser.json());
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.get('/api/users', getAllUsers);

// Mock the token generation for simplicity
jest.mock('../../utils/token', () => ({
  generateToken: jest.fn(() => 'mock-token')
}));

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Clean up the database before tests
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM employees');
  });

  afterAll(async () => {
    // Clean up the database after tests
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM employees');
    await pool.end();
  });

  describe('POST /api/register', () => {
    it('should register a new user and return a token', async () => {
      const newUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "employee",
        department: "I.T",
        joining_date: "2022-01-01",
        salary: 70000
      };

      const res = await request(app)
        .post('/api/register')
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token', 'mock-token');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        // Missing password
        role: "employee",
        department: "I.T",
        joining_date: "2022-01-01",
        salary: 70000
      };

      const res = await request(app)
        .post('/api/register')
        .send(incompleteUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Please provide all required fields: name, email, password, role, department, joining date, salary');
    });

    it('should return 400 if email already exists', async () => {
      const newUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "employee",
        department: "I.T",
        joining_date: "2022-01-01",
        salary: 70000
      };

      // Register the user the first time
      await request(app)
        .post('/api/register')
        .send(newUser);

      // Attempt to register the same user again
      const res = await request(app)
        .post('/api/register')
        .send(newUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should return a list of all users', async () => {
      const res = await request(app)
        .get('/api/users');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
