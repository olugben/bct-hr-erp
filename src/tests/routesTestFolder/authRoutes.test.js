const request = require('supertest');
const express =require("express")
const app = require('../../index'); // Use the app instance

const pool = require('../../db');

// data for testing
// const userData = {
//   name: "hammed",
//   email: "dummy@example.com",
//   password: "yourpassword",
//   role: "admin",
//   department: "I.T",
//   joining_date: "2009-09-09",
//   salary: 80000
// };
const userData = {
    name: "newuser",
    email: "newuser@example.com",
    password: "newpassword",
    role: "employee",
    department: "I.T",
    joining_date: "2009-09-09",
    salary: 80000
  };
  
let adminToken = '';
let userToken = '';
let userId = null;

beforeAll(async () => {
  // Clean up the database before tests
  await pool.query('DELETE FROM users'); 

  // Register a new user
  const res = await request(app)
    .post('/api/register')  // Correct path for registration
    .send(userData);
  userId = res.body.id;

  // Register an admin user
  const adminData = {
    name: "hammed",
    email: "@example.com",
    password: "yourpassword",
    role: "admin",
    department: "I.T",
    joining_date: "2009-09-09",
    salary: 80000
  };

  const adminRes = await request(app)
    .post('/api/register')  // Correct path for registration
    .send(adminData);

  // Log in both users and store tokens for subsequent requests
  const loginRes = await request(app)
    .post('/api/login')  // Correct path for login
    .send({ email: userData.email, password: userData.password });

  userToken = loginRes.body.token;

  const adminLoginRes = await request(app)
    .post('/api/login')  // Correct path for login
    .send({ email: adminData.email, password: adminData.password });

  adminToken = adminLoginRes.body.token;
});

afterAll(async () => {
  // Clean up after tests
 
  await pool.query('SELECT setval(\'employees_id_seq\', (SELECT MAX(id) FROM employees))');

  // Clean up after tests
  await pool.query('DELETE FROM users');
  await pool.end(); // Close the database connection
});

describe('Auth Routes', () => {

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/login')  // Correct path for login
      .send({ email: userData.email, password: userData.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should return 401 if login credentials are incorrect', async () => {
    const res = await request(app)
      .post('/api/login')  // Correct path for login
      .send({ email: userData.email, password: 'IncorrectPassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should allow access to /users route for admins only', async () => {
    const res = await request(app)
      .get('/api/employees')  // Correct path for fetching users
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return 403 if non-admin tries to access /api/employees route', async () => {
    const res = await request(app)
      .get('/api/employees')  // Correct path for fetching users
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    // expect(res.body.error).toBe('Forbidden: Insufficient role');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .get('/api/users');  // Correct path for fetching users

    expect(res.status).toBe(401);
   
    

  });
});
