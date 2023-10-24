document.addEventListener('DOMContentLoaded', function () {
  // Fetch data and update tables
  fetch('/data')
    .then((response) => response.json())
    .then((data) => {
      // Organize the data by student ID
      const organizedData = organizeData(data);

      // Update the data table
      const dataTable = document.getElementById('dataTable');
      dataTable.innerHTML = `<tr><th>Student ID</th><th>Grade</th></tr>`;

      // Loop through the organized data and display it
      organizedData.forEach((entry) => {
        // Display all grades for a student in a comma-separated string
        const allGrades = entry.grades.join(', ');
        dataTable.innerHTML += `<tr><td>${entry.studentId}</td><td>${allGrades}</td></tr>`;
      });

      // Update the average table
      const averageTable = document.getElementById('averageTable');
      averageTable.innerHTML = `<tr><th>Student ID</th><th>Average Grade</th></tr>`;

      // Calculate the average for each student using the corrected function
      const studentAverages = calculateAverageGrade(data);

      studentAverages.forEach((entry) => {
        averageTable.innerHTML += `<tr><td>${entry.studentId}</td><td>${entry.average.toFixed(2)}</td></tr>`;
      });
    })
    .catch((error) => console.error('Error:', error));
});

function organizeData(data) {
  const organizedData = {};

  data.forEach((entry) => {
    if (organizedData[entry.studentId]) {
      organizedData[entry.studentId].grades.push(entry.grade);
    } else {
      organizedData[entry.studentId] = {
        studentId: entry.studentId,
        grades: [entry.grade],
      };
    }
  });

  return Object.values(organizedData);
}

function calculateAverageGrade(grades) {
  const studentAverages = [];

  const uniqueStudentIds = [...new Set(grades.map((grade) => grade.studentId))];

  for (const studentId of uniqueStudentIds) {
    const studentGrades = grades.filter((grade) => grade.studentId === studentId);
    const total = studentGrades.reduce((sum, grade) => sum + grade.grade, 0);
    const average = total / studentGrades.length;
    studentAverages.push({ studentId, average });
  }

  return studentAverages;
}
