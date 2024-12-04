const request = require('supertest');
const express = require('express');
const router = require('../../routes/employeeRoutes'); 
const { authMiddleware, roleMiddleware } = require('../../middlewares/authMiddleware');
const pool = require('../../db');

// Mocking the middlewares to bypass auth and role checks
jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: (req, res, next) => next(), // bypass authMiddleware
  roleMiddleware: (roles) => (req, res, next) => next() // bypass roleMiddleware
}));

// Mocking the database queries
jest.mock('../../db', () => ({
  query: jest.fn()
}));

// Setup the Express app and routes for testing
const app = express();
app.use(express.json());
app.use(router); // Use the routes from the employeeRoutes file

describe('Employee Routes', () => {
  // Tests for POST /employees (addEmployee)
  describe('POST /employees', () => {
    it('should add a new employee and return the employee data', async () => {
      const newEmployee = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        department: 'HR',
        role: 'Manager',
        joining_date: '2022-02-01',
        salary: 75000,
      };

      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...newEmployee }],
      });

      const res = await request(app).post('/employees').send(newEmployee);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Jane Doe');
      expect(res.body.email).toBe('jane.doe@example.com');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteEmployee = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        // Missing department, role, etc.
      };

      const res = await request(app).post('/employees').send(incompleteEmployee);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Provide all required fields: name, email, department, role, joining date, salary');
    });
  });

  // Tests for PUT /employees/:id (updateEmployee)
  describe('PUT /employees/:id', () => {
    const updatedEmployee = {
      name: 'Jane Doe Updated',
      email: 'jane.doe@example.com',
      department: 'HR',
      role: 'Senior Manager',
      joining_date: '2022-02-01',
      salary: 80000,
    };

    it('should update an existing employee', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...updatedEmployee }],
      });

      const res = await request(app).put('/employees/1').send(updatedEmployee);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Jane Doe Updated');
      expect(res.body.salary).toBe(80000);
    });

    it('should return 404 if employee does not exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).put('/employees/99').send(updatedEmployee);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Employee not found');
    });
  });

  // Tests for DELETE /employees/:id (deleteEmployee)
  describe('DELETE /employees/:id', () => {
    it('should delete an existing employee', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' }],
      });

      const res = await request(app).delete('/employees/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Employee deleted with ID: 1');
    });

    it('should return 404 if employee does not exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).delete('/employees/99');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Employee not found');
    });
  });

  // Tests for GET /employees (getEmployees)
  describe('GET /employees', () => {
    it('should return a list of all employees', async () => {
      const employees = [
        { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', department: 'HR' },
        { id: 2, name: 'John Smith', email: 'john.smith@example.com', department: 'IT' },
      ];

      pool.query.mockResolvedValueOnce({ rows: employees });

      const res = await request(app).get('/employees');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe('Jane Doe');
    });

    it('should return an empty array if no employees exist', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/employees');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // Tests for GET /profile (viewProfile)

});
