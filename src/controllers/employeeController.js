const pool = require('../db');

const addEmployee = async (req, res) => {
    const { name, email, department, role, joining_date, salary } = req.body;

   
    console.log(req.body);

    // Basic validation
    if (!name || !email || !department || !role || !joining_date || !salary) {
        return res.status(400).json({ error: 'Provide all required fields: name, email, department, role, joining date, salary' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO employees (name, email, department, role, joining_date, salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, department, role, joining_date, salary]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, email, department, role, joining_date, salary } = req.body;
    try {
        const result = await pool.query(
            'UPDATE employees SET name = $1, email = $2, department = $3, role = $4, joining_date = $5, salary = $6 WHERE id = $7 RETURNING *',
            [name, email, department, role, joining_date, salary, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: `Employee deleted with ID: ${id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmployees = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employees');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





const viewProfile = async (req, res) => {
    const { email } = req.user; 
    try {
        const result = await pool.query('SELECT name, email, department, role, joining_date FROM employees WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log(`User email from token: ${email}`);
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateProfile = async (req, res) => {
    const { email } = req.user; // Extract email from req.user
    const { name, department, joining_date } = req.body;

    // Debugging: Log the email being used for the update
    console.log(`User email from token: ${email}`);

    try {
        const result = await pool.query(
            'UPDATE employees SET name = $1, department = $2, joining_date = $3 WHERE email = $4 RETURNING name, email, department, role, joining_date',
            [name, department, joining_date, email] // Use email for querying
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    viewProfile,
    updateProfile,
  
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployees
};
