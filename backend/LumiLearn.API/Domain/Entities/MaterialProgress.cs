using LumiLearn.API.Data;
using LumiLearn.API.Domain.Enums;

namespace LumiLearn.API.Domain.Entities
{
    public class MaterialProgress
    {
        public Guid Id { get; set; }

        public Guid MaterialId { get; set; }

        public string StudentId { get; set; } = string.Empty;

        public MaterialProgressStatus Status { get; set; } = MaterialProgressStatus.NotStarted;

        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public Material Material { get; set; } = null!;

        public ApplicationUser Student { get; set; } = null!;
    }
}
