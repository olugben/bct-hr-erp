const request = require('supertest');
const express = require('express');
const pool = require('../../db');
const { getTotalEmployees, getEmployeesByDepartment } = require('../../controllers/analyticsController');

// Setup the Express app and routes for testing
const app = express();

app.get('/api/analytics/total-employees', getTotalEmployees);
app.get('/api/analytics/employees-by-department', getEmployeesByDepartment);

// Mocking pool.query for the database queries
jest.mock('../../db');

describe('Employee Controller', () => {
  describe('GET /api/analytics/total-employees', () => {
    it('should return the total number of employees', async () => {
      // Mocking database query result
      pool.query.mockResolvedValueOnce({
        rows: [{ total_employees: 100 }]
      });

      const res = await request(app).get('/api/analytics/total-employees');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ total_employees: 100 });
    });

    it('should return 500 if there is a database error', async () => {
      // Mocking database query to simulate an error
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/api/analytics/total-employees');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('GET /api/analytics/employees-by-department', () => {
    it('should return the number of employees by department', async () => {
      // Mocking database query result for department counts
      pool.query.mockResolvedValueOnce({
        rows: [
          { department: 'IT', count: 50 },
          { department: 'HR', count: 30 },
          { department: 'Finance', count: 20 }
        ]
      });

      const res = await request(app).get('/api/analytics/employees-by-department');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { department: 'IT', count: 50 },
        { department: 'HR', count: 30 },
        { department: 'Finance', count: 20 }
      ]);
    });

    it('should return 500 if there is a database error', async () => {
      // Mocking database query to simulate an error
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/api/analytics/employees-by-department');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });
});
