using LumiLearn.API.Data;
using LumiLearn.API.Domain.Entities;
using LumiLearn.API.DTO.Enrollments;
using Microsoft.EntityFrameworkCore;

namespace LumiLearn.API.Services
{
    public class EnrollmentService
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<EnrollmentResponse?> EnrollStudentAsync(Guid courseId, string studentId)
        {
            var courseExists = await _context.Courses.AnyAsync(c => c.Id == courseId);

            if (!courseExists)
            {
                return null;
            }

            var alreadyEnrolled = await _context.Enrollments.AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);

            if (alreadyEnrolled)
            {
                throw new InvalidOperationException("Student is already enrolled in this course.");
            }

            var enrollment = new Enrollment
            {
                Id = Guid.NewGuid(),
                CourseId = courseId,
                StudentId = studentId,
                EnrolledAt = DateTime.UtcNow,
                Status = "Active"
            };

            _context.Enrollments.Add(enrollment);

            await _context.SaveChangesAsync();

            return new EnrollmentResponse
            {
                Id = enrollment.Id,
                CourseId = enrollment.CourseId,
                StudentId = enrollment.StudentId,
                EnrolledAt = enrollment.EnrolledAt,
                Status = enrollment.Status
            };
        }
    }
}
