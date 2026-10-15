namespace LumiLearn.API.Domain.Entities
{
    public class Module
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public Course Course { get; set; } = null!;
        public ICollection<Topic> Topics { get; set; } = new List<Topic>();

    }
}
