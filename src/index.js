require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const pool = require('./db');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors())
app.use('/api', authRoutes);
app.use("/api", employeeRoutes)
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res
      .status(200)
      .json({ message: "Connected to the database", time: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database connection error", details: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
