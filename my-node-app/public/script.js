document.getElementById('studentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const grade = document.getElementById('grade').value;
  
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, grade }),
    });
  
    if (response.ok) {
      const result = await response.json();
      alert('Grade successfully added'); // Display a success message
      // Redirect to gradeinfo.html
      window.location.href = '/gradeinfo.html';
    } else {
      alert('An error occurred');
    }
  });
  