const pool = require('../db');

const getTotalEmployees = async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) AS total_employees FROM employees');
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmployeesByDepartment = async (req, res) => {
    try {
        const result = await pool.query('SELECT department, COUNT(*) AS count FROM employees GROUP BY department');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTotalEmployees,
    getEmployeesByDepartment,
};
