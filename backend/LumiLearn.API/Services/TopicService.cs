using LumiLearn.API.Data;
using LumiLearn.API.Domain.Entities;
using LumiLearn.API.DTO.Topics;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace LumiLearn.API.Services
{
    public class TopicService
    {
        private readonly ApplicationDbContext _context;

        public TopicService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<TopicResponse>> GetTopicsAsync(Guid moduleId, string userId, string userRole)
        {
            var module = await _context.Modules.AsNoTracking()
                                               .Include(m => m.Course.Enrollments)
                                               .Include(m => m.Topics)
                                               .FirstOrDefaultAsync(m => m.Id == moduleId);

            if (module == null)
            {
                throw new KeyNotFoundException("Module not found");
            }

            if (userRole == "Teacher")
            {
                if (module.Course.TeacherId != userId)
                {
                    throw new UnauthorizedAccessException("You are not authorized to view this course.");
                }
            }
            else if (userRole == "Student")
            {
                var isEnrolled = module.Course.Enrollments.Any(e =>
                                                               e.StudentId == userId &&
                                                               e.Status == "Active");

                if (!isEnrolled)
                {
                    throw new UnauthorizedAccessException("You are not authorized to view this course.");
                }
            }
            else
            {
                throw new UnauthorizedAccessException("You are not authorized to view this course.");
            }

            var topics = module.Topics
                .OrderBy(t => t.DisplayOrder)
                .Select(t => new TopicResponse
                {
                    Id = t.Id,
                    ModuleId = t.ModuleId,
                    Name = t.Name,
                    DisplayOrder = t.DisplayOrder
                })
                .ToList();

            return topics;
        }

        public async Task<TopicResponse> CreateTopicAsync(Guid moduleId, string userId, string userRole, CreateTopicRequest request)
        {
            var module = await _context.Modules
                .Include(m => m.Course)
                .Include(m => m.Topics)
                .FirstOrDefaultAsync(m => m.Id == moduleId);

            if (module is null)
                throw new KeyNotFoundException("Module not found.");

            if (userRole != "Teacher" || module.Course.TeacherId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to manage topics in this module.");
            }

            var name = request.Name.Trim();

            if (string.IsNullOrWhiteSpace(name) || name.Length > 200)
                throw new ArgumentException("Topic name must be between 1 and 200 characters.");

            var lastTopic = module.Topics.OrderBy(t => t.DisplayOrder)
                                            .LastOrDefault();

            var topic = new Topic
            {
                ModuleId = moduleId,
                Name = name,
                DisplayOrder = lastTopic == null ? 1 : lastTopic.DisplayOrder + 1
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return new TopicResponse
            {
                Id = topic.Id,
                ModuleId = topic.ModuleId,
                Name = topic.Name,
                DisplayOrder = topic.DisplayOrder
            };
        }
    }
}