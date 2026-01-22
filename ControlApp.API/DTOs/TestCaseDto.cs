namespace ControlApp.API.DTOs
{
    public class TestCaseDto
    {
        public int TestCaseId { get; set; }
        public int ControlId { get; set; }
        public int? SubDescriptionIndex { get; set; }
        public string? ControlName { get; set; }
        public string TestCaseTitle { get; set; } = string.Empty;
        public string? TestSteps { get; set; }
        public string? ExpectedResult { get; set; }
        public string Status { get; set; } = "Not Tested";
        public string? ActualResult { get; set; }
        public string Priority { get; set; } = "Medium";
        public string TestType { get; set; } = "Functional";
        public int? TestedByEmployeeId { get; set; }
        public string? TestedByName { get; set; }
        public DateTime? TestedDate { get; set; }
        public int? DefectId { get; set; }
        public int TeamId { get; set; }
        public string? TeamName { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateTestCaseDto
    {
        public int ControlId { get; set; }
        public int? SubDescriptionIndex { get; set; }
        public string TestCaseTitle { get; set; } = string.Empty;
        public string? TestSteps { get; set; }
        public string? ExpectedResult { get; set; }
        public string Priority { get; set; } = "Medium";
        public string TestType { get; set; } = "Functional";
    }

    public class UpdateTestCaseDto
    {
        public string? TestCaseTitle { get; set; }
        public string? TestSteps { get; set; }
        public string? ExpectedResult { get; set; }
        public string? Status { get; set; }
        public string? ActualResult { get; set; }
        public string? Priority { get; set; }
        public string? TestType { get; set; }
        public int? DefectId { get; set; }
    }
}
