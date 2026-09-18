using LumiLearn.API.Data;

namespace LumiLearn.API.Domain.Entities
{
    public class Course
    {
        public Guid Id { get; set; }

        public string TeacherId { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Subject { get; set; } = null!;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public ApplicationUser Teacher { get; set; } = null!;

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
