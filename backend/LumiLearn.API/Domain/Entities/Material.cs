using LumiLearn.API.Domain.Enums;

namespace LumiLearn.API.Domain.Entities
{
    public class Material
    {
        public Guid Id { get; set; }

        public Guid TopicId { get; set; }

        public MaterialType Type { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? StorageUrl { get; set; }

        public string? FileName { get; set; }

        public DateTime CreatedAt { get; set; }

        public int DisplayOrder { get; set; }

        // Navigation properties
        public Topic Topic { get; set; } = null!;

        public ICollection<MaterialProgress> ProgressRecords { get; set; }
            = new List<MaterialProgress>();
    }
}
