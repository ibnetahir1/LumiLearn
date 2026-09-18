namespace LumiLearn.API.DTO.Courses
{
    public class CreateCourseRequest
    {
        public string Name { get; set; } = string.Empty;

        public string Subject { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}
