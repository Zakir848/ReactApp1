using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.DTOs;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CityController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCities()
        {

            var cities = await _context.Cities
                .AsNoTracking()
                .Select(x => new CityListDto
                {
                    Id = x.Id,
                    Name = x.Name,   
                    CountryId = x.Country.Id,
                    CountryName=  x.Country.Name                    
                })
                .ToListAsync();

            return Ok(cities);
        }
    }
}
