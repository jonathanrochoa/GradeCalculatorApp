    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using System.Data.SqlClient;

    namespace GradeCalculatorApp
    {
        public static class InsertGrade
        {
            [FunctionName("InsertGrade")]
            public static async Task<IActionResult> Run(
                [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
                ILogger log)
            {
                // Parse the request body to get the student ID and grade.
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);
                int studentId = data.studentId;
                int grade = data.grade;

                // Define your SQL connection string.
                string connectionString = "Server=tcp:onelinetaskmanager.database.windows.net,1433;Initial Catalog=GradeCalculatorDb;Persist Security Info=False;User ID=DbAdmin5298;Password=BlackDragon999;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

                // Insert data into the database.
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string insertQuery = "INSERT INTO Grades (studentId, grade) VALUES (@studentId, @grade)";
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        command.Parameters.AddWithValue("@studentId", studentId);
                        command.Parameters.AddWithValue("@grade", grade);
                        command.ExecuteNonQuery();
                    }
                }

                return new OkObjectResult("Grade inserted successfully.");
            }
        }
    }
