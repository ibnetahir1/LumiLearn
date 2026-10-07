//using LumiLearn.API.DTO.Modules;
//using LumiLearn.API.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using System.Security.Claims;

//namespace LumiLearn.API.Controllers
//{
//    [ApiController]
//    [Route("api/modules")]
//    [Authorize]
//    public class ModulesController : ControllerBase
//    {
//        private readonly ModuleService _moduleService;

//        public ModulesController(ModuleService moduleService)
//        {
//            _moduleService = moduleService;
//        }

//        [HttpPost]
//        [Authorize(Roles = "Teacher")]
//        public async Task<ActionResult<ModuleResponse>> CreateModule(CreateModuleRequest request)
//        {
//            //if doesn't own the course, unauthorized
//            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//            if (teacherId == null)
//            {
//                return Unauthorized();
//            }

//            var course = 

//        }
//    }
//}
