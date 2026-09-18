using LumiLearn.API.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace LumiLearn.API.Data
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Course> CoursesTaught { get; set; } = new List<Course>();

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
