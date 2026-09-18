using LumiLearn.API.DTO.Courses;
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

        public CoursesController(CourseService courseService)
        {
            _courseService = courseService;
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
    }
}
