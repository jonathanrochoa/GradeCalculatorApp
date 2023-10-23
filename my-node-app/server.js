const express = require('express');
const app = express();
const sql = require('mssql'); // You'll need to install this package

// Configuration for your Azure SQL Database
require('dotenv').config();
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
  },
};

app.use(express.json());

// Serve your static HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle POST request from the form
app.post('/submit', async (req, res) => {
  try {
    await sql.connect(config);
    const { studentId, grade } = req.body;

    // Insert data into the database
    await sql.query(`INSERT INTO Grades (studentId, grade) VALUES (${studentId}, ${grade})`);

    // Calculate the average grade (you'll need to implement this)
    const average = await calculateAverageGrade();

    res.status(200).json({ message: 'Data inserted successfully', average });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    sql.close();
  }
});

// Define the calculateAverageGrade function
async function calculateAverageGrade() {
  try {
    await sql.connect(config);

    // Query the database to retrieve all grades
    const result = await sql.query('SELECT grade FROM Grades');

    // Calculate the average grade
    const grades = result.recordset;
    if (grades.length === 0) {
      return null; // Return null if there are no grades in the database
    }

    const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
    const average = total / grades.length;

    return average;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    sql.close();
  }
}

// Implement route for 'gradeinfo.html'
app.get('/gradeinfo.html', (req, res) => {
  res.sendFile(__dirname + '/gradeinfo.html');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
