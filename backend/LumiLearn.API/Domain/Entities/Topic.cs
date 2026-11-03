namespace LumiLearn.API.Domain.Entities
{
    public class Topic
    {
        public Guid Id { get; set; }

        public Guid ModuleId { get; set; }

        public string Name { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }

        public Module Module { get; set; } = null!;
    }
}
