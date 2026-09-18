using LumiLearn.API.Data;
using LumiLearn.API.Domain.Entities;
using LumiLearn.API.DTO.Courses;
using Microsoft.EntityFrameworkCore;

namespace LumiLearn.API.Services
{
    public class CourseService
    {
        private readonly ApplicationDbContext _context;

        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CourseResponse>> GetCoursesAsync(string userId, string role)
        {
            IQueryable<Course> query = _context.Courses;

            if (role == "Teacher")
            {
                query = query.Where(c => c.TeacherId == userId);
            }
            else if (role == "Student")
            {
                query = query.Where(c => c.Enrollments.Any(e => e.StudentId == userId && e.Status == "Active"));
            }
            else
            {
                return [];
            }

            var result = await query.OrderByDescending(c => c.CreatedAt)
                                    .Select(c => new CourseResponse
                                    {
                                        Id = c.Id,
                                        Name = c.Name,
                                        Subject = c.Subject,
                                        Description = c.Description,
                                        TeacherId = c.TeacherId,
                                        CreatedAt = c.CreatedAt
                                    })
                                    .ToListAsync();

            return result;
        }

        public async Task<CourseResponse> CreateCourseAsync(string teacherId, CreateCourseRequest request)
        {
            var course = new Course
            {
                Id = Guid.NewGuid(),
                TeacherId = teacherId,
                Name = request.Name.Trim(),
                Subject = request.Subject.Trim(),
                Description = string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);

            await _context.SaveChangesAsync();

            return new CourseResponse
            {
                Id = course.Id,
                Name = course.Name,
                Subject = course.Subject,
                Description = course.Description,
                TeacherId = course.TeacherId,
                CreatedAt = course.CreatedAt
            };
        }
    }
}
