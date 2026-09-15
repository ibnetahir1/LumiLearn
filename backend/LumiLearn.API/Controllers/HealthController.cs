using Microsoft.AspNetCore.Mvc;

namespace LumiLearn.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "ok",
                application = "LumiLearn.API"
            });
        }
    }
}
