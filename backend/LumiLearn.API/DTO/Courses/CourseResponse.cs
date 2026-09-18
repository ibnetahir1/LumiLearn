namespace LumiLearn.API.DTO.Courses
{
    public class CourseResponse
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Subject { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string TeacherId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
