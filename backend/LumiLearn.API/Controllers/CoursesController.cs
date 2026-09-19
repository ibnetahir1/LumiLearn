using LumiLearn.API.DTO.Courses;
using LumiLearn.API.DTO.Enrollments;
using LumiLearn.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LumiLearn.API.Controllers
{
    [ApiController]
    [Route("api/courses")]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly CourseService _courseService;
        private readonly EnrollmentService _enrollmentService;

        public CoursesController(CourseService courseService, EnrollmentService enrollmentService)
        {
            _courseService = courseService;
            _enrollmentService = enrollmentService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CourseResponse>>> GetCourses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (userId == null || role == null)
            {
                return Unauthorized();
            }

            var courses = await _courseService.GetCoursesAsync(userId, role);

            return Ok(courses);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<CourseResponse>> CreateCourse(CreateCourseRequest request)
        {
            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (teacherId == null)
            {
                return Unauthorized();
            }

            var course = await _courseService.CreateCourseAsync(teacherId, request);

            return CreatedAtAction("CreateCourse", course);
        }

        [HttpPost("{courseId}/enroll")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<EnrollmentResponse>> EnrollStudent(Guid courseId)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (studentId == null)
            {
                return Unauthorized();
            }
            try
            {
                var enrollment = await _enrollmentService.EnrollStudentAsync(courseId, studentId);

                if (enrollment == null)
                {
                    return NotFound();
                }

                return CreatedAtAction("EnrollStudent", enrollment);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpGet("available")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<List<CourseResponse>>> GetAvailableCourses()
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (studentId == null)
            {
                return Unauthorized();
            }

            var courses = await _courseService.GetAvailableCoursesAsync(studentId);

            return Ok(courses);
        }
    }
}
