document.addEventListener('DOMContentLoaded', function () {
    // Fetch data and update tables
    fetch('/data') // Replace with the appropriate route on your server
      .then((response) => response.json())
      .then((data) => {
        // Organize the data by student ID
        const organizedData = organizeData(data);
  
        // Update the data table
        const dataTable = document.getElementById('dataTable');
        dataTable.innerHTML = `<tr><th>Student ID</th><th>Grade</th></tr>`;
  
        // Loop through the organized data and display it
        organizedData.forEach((entry) => {
          dataTable.innerHTML += `<tr><td>${entry.studentId}</td><td>${entry.grades}</td></tr>`;
        });
  
        // Update the average table
        const averageTable = document.getElementById('averageTable');
        averageTable.innerHTML = `<tr><th>Student ID</th><th>Average Grade</th></tr>`;
  
        // Loop through the organized data and calculate the average for each student
        organizedData.forEach((entry) => {
          const average = calculateAverage(entry.grades);
          averageTable.innerHTML += `<tr><td>${entry.studentId}</td><td>${average.toFixed(2)}</td></tr>`;
        });
      })
      .catch((error) => console.error('Error:', error));
  });
  
  function organizeData(data) {
    // Create an object to organize data by student ID
    const organizedData = {};
  
    // Iterate through the data and organize it
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
  
    // Convert the object to an array
    return Object.values(organizedData);
  }
  
  function calculateAverage(grades) {
    const gradeArray = grades.split(', ').map(Number);
    const sum = gradeArray.reduce((acc, grade) => acc + grade, 0);
    return sum / gradeArray.length;
  }
  