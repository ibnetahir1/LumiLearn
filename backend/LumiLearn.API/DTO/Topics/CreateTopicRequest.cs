using System.ComponentModel.DataAnnotations;

namespace LumiLearn.API.DTO.Topics
{
    public class CreateTopicRequest
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Name { get; set; } = string.Empty;
    }
}
