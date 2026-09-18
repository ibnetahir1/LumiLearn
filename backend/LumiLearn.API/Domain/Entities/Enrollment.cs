using LumiLearn.API.Data;

namespace LumiLearn.API.Domain.Entities
{
    public class Enrollment
    {
        public Guid Id { get; set; }

        public Guid CourseId { get; set; }

        public string StudentId { get; set; } = null!;

        public DateTime EnrolledAt { get; set; }

        public string Status { get; set; } = "Active";

        public Course Course { get; set; } = null!;

        public ApplicationUser Student { get; set; } = null!;
    }
}
