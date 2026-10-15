using LumiLearn.API.DTO.Topics;
using LumiLearn.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Claims;

namespace LumiLearn.API.Controllers
{
    [ApiController]
    [Route("api/modules/{moduleId}/topics")]
    [Authorize]
    public class TopicsController : ControllerBase
    {
        private readonly TopicService _topicService;

        public TopicsController(TopicService topicService)
        {
            _topicService = topicService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<TopicResponse>>> GetTopics(Guid moduleId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            IReadOnlyList<TopicResponse> topics;

            try
            {
                topics = await _topicService.GetTopicsAsync(moduleId, userId, userRole);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }

            return Ok(topics);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<TopicResponse>> CreateTopic(Guid moduleId, CreateTopicRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            TopicResponse topic;

            try
            {
                topic = await _topicService.CreateTopicAsync(moduleId, userId, "Teacher", request);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            return CreatedAtAction(nameof(CreateTopic), topic);
        }
    }
}
