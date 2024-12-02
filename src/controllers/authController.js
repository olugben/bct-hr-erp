const pool = require('../db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');




const registerUser = async (req, res) => {
    const { name, email, password, role, department, joining_date, salary } = req.body;

    // validation
    if (!name || !email || !password || !role || !department || !joining_date || !salary) {
        return res.status(400).json({ error: 'Please provide all required fields: name, email, password, role, department, joining date, salary' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Start a transaction
        await pool.query('BEGIN');

        // Insert user into users table
        const userResult = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, role]
        );

        const user = userResult.rows[0];

        // Insert corresponding employee record
        const employeeResult = await pool.query(
            'INSERT INTO employees (name, email, department, role, joining_date, salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, department, role, joining_date, salary]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        // Generate JWT token
        const token = generateToken(user);

        // Return the token
        res.status(201).json({ token });
    } catch (error) {
        // Rollback the transaction in case of an error
        await pool.query('ROLLBACK');
        console.error('Registration error:', error.message);
        if (error.code === '23505') { // Duplicate email
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};





const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log(result)
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
};
