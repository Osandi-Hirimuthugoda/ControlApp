namespace ControlApp.API.Models
{
    public class TestCase
    {
        public int TestCaseId { get; set; }
        public int ControlId { get; set; }
        public int? SubDescriptionIndex { get; set; } // null = control-level, 0+ = sub-description index
        public string TestCaseTitle { get; set; } = string.Empty;
        public string? TestSteps { get; set; }
        public string? ExpectedResult { get; set; }
        public string Status { get; set; } = "Not Tested"; // Not Tested, Pass, Fail
        public string? ActualResult { get; set; }
        public string Priority { get; set; } = "Medium"; // High, Medium, Low
        public string TestType { get; set; } = "Functional"; // Functional, Regression, Bug Verification, Validation
        public int? TestedByEmployeeId { get; set; }
        public DateTime? TestedDate { get; set; }
        public int? DefectId { get; set; } // Link to defect if test failed
        public int TeamId { get; set; }
        public DateTime CreatedDate { get; set; }
        
        // Navigation properties
        public Controls? Control { get; set; }
        public Employee? TestedBy { get; set; }
        public Defect? Defect { get; set; }
        public Team? Team { get; set; }
    }
}
