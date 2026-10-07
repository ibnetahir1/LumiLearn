namespace LumiLearn.API.DTO.Modules
{
    public class ModuleResponse
    {
        public Guid Id { get; set; }

        public Guid CourseId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }
    }
}
