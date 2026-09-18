namespace LumiLearn.API.DTO.Enrollments
{
    public class EnrollmentResponse
    {
        public Guid Id { get; set; }

        public Guid CourseId { get; set; }

        public string StudentId { get; set; } = string.Empty;

        public DateTime EnrolledAt { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}
