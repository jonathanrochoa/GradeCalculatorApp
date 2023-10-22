using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace GradeCalculatorApp
{
    public static class RetrieveData
    {
        [FunctionName("RetrieveGrades")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            // Define your SQL connection string.
            string connectionString = "Server=tcp:onelinetaskmanager.database.windows.net,1433;Initial Catalog=GradeCalculatorDb;Persist Security Info=False;User ID=DbAdmin5298;Password=BlackDragon999;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

            // Retrieve data from the database.
            List<Grade> grades = new List<Grade>();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                // Correct the SQL query to specify the table name "Grades".
                string selectQuery = "SELECT * FROM Grades";
                using (SqlCommand command = new SqlCommand(selectQuery, connection))
                {
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (reader.Read())
                        {
                            Grade grade = new Grade
                            {
                                StudentId = reader.GetInt32(0),
                                GradeValue = reader.GetInt32(1)
                            };
                            grades.Add(grade);
                        }
                    }
                }
            }

            return new OkObjectResult(grades);
        }
    }

    public class Grade
    {
        public int StudentId { get; set; }
        public int GradeValue { get; set; }
    }
}
