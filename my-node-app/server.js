const express = require('express');
const app = express();
const sql = require('mssql');
const path = require('path');
const dataUtils = require('./dataUtils'); // Import your dataUtils module

const config = {
  user: 'ServAdmin808',
  password: 'BlackDragon999',
  server: 'projectsserver1.database.windows.net',
  database: 'GradeCalculatorDb',
  options: {
    encrypt: true,
  },
};

app.use(express.json());

// Serve static files from the "public" folder
app.use('/static', express.static(path.join(__dirname, 'public')));

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
    const average = await dataUtils.calculateAverageGrade();

    res.status(200).json({ message: 'Data inserted successfully', average });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    sql.close();
  }
});

// Handle GET request to fetch data
app.get('/data', async (req, res) => {
  try {
    await sql.connect(config);

    // Query the database to retrieve all grades
    const result = await sql.query('SELECT studentId, grade FROM Grades');
    const grades = result.recordset;

    // Calculate the average grade for each student
    const studentAverages = calculateAverageGrade();

    res.status(200).json(studentAverages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    sql.close();
  }
});

app.get('/gradeinfo.html', (req, res) => {
  res.sendFile(__dirname + '/gradeinfo.html');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Define the calculateAverageGrade function in server.js
async function calculateAverageGrade() {
  try {
    await sql.connect(config);

    // Query the database to retrieve all student IDs
    const result = await sql.query('SELECT DISTINCT studentId FROM Grades');

    const studentIds = result.recordset;

    // Calculate the average grade for each student
    const studentAverages = [];

    for (const studentId of studentIds) {
      const studentGrades = await sql.query(
        `SELECT grade FROM Grades WHERE studentId = ${studentId.studentId}`
      );
      const grades = studentGrades.recordset;
      
      if (grades.length > 0) {
        const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
        const average = total / grades.length;
        studentAverages.push({ studentId: studentId.studentId, average });
      }
    }

    return studentAverages;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    sql.close();
  }
}
