using LumiLearn.API.Data;
using LumiLearn.API.Domain.Entities;
using LumiLearn.API.DTO.Modules;
using Microsoft.EntityFrameworkCore;

namespace LumiLearn.API.Services
{
    public class ModuleService
    {
        private readonly ApplicationDbContext _context;

        public ModuleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ModuleResponse?> CreateModuleAsync(string teacherId, Guid courseId, CreateModuleRequest request)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null || course.TeacherId != teacherId)
            {
                return null;
            }

            var lastModule = await _context.Modules.Where(m => m.CourseId == courseId)
                                                   .OrderBy(m => m.DisplayOrder)
                                                   .LastOrDefaultAsync();

            var module = new Module
            {
                Id = new Guid(),
                CourseId = courseId,
                Title = request.Title,
                Description = request.Description,
                DisplayOrder = lastModule == null ? 0 : lastModule.DisplayOrder + 1
            };

            _context.Modules.Add(module);

            await _context.SaveChangesAsync();

            return new ModuleResponse()
            {
                Id = module.Id,
                CourseId = module.CourseId,
                Title = module.Title,
                Description = module.Description,
                DisplayOrder = module.DisplayOrder
            };
        }

        public async Task<List<ModuleResponse>?> GetAllModulesAsync(string userId, string role, Guid courseId)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return null;
            }

            if (role == "Teacher")
            {
                if (course.TeacherId != userId)
                {
                    return null;
                }
            }
            else if (role == "Student")
            {
                var isEnrolled = await _context.Enrollments.AnyAsync(e =>
                                                                     e.StudentId == userId &&
                                                                     e.CourseId == courseId &&
                                                                     e.Status == "Active");

                if (!isEnrolled)
                {
                    return null;
                }
            }
            else
            {
                return null;
            }

            var result = await _context.Modules.Where(m => m.CourseId == courseId)
                                               .OrderBy(m => m.DisplayOrder)
                                               .Select(m => new ModuleResponse
                                               {
                                                   Id = m.Id,
                                                   CourseId = m.CourseId,
                                                   Title = m.Title,
                                                   Description = m.Description,
                                                   DisplayOrder = m.DisplayOrder
                                               })
                                               .ToListAsync();

            return result;
        }
    }
}
