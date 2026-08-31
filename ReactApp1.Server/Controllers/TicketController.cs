using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.DTOs;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTickets([FromQuery] TicketQueryDto query)
        {

            var ticketQuery = _context.Tickets.AsNoTracking()
                                               .Include(t => t.FromCity)
                                               .Include(t => t.ToCity)
                                               .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                ticketQuery = ticketQuery.Where(x => x.FromCity.Name.Contains(query.Search));
            }

            if (query.ToCityId.HasValue)
            {
                ticketQuery = ticketQuery.Where(x => x.ToCity.Id == query.ToCityId.Value);
            }

            if (query.FromCityId.HasValue)
            {
                ticketQuery = ticketQuery.Where(x => x.FromCity.Id == query.FromCityId.Value);
            }

            if (query.MinPrice.HasValue)
            {
                ticketQuery.Where(m => m.Price > query.MinPrice.Value);
            }

            if (query.MaxPrice.HasValue)
            {
                ticketQuery.Where(m => m.Price < query.MinPrice.Value);
            }

            if(query.FromCityId.HasValue && query.ToCityId.HasValue)
            {
                if(query.FromCityId.Value == query.ToCityId.Value)
                    return BadRequest("Eyni seheri seche bilmezsiniz");
            }

            ticketQuery = query.Sort.ToLower() switch
            {
                "priceasc" => ticketQuery.OrderBy(x => x.Price),
                "pricedesc" => ticketQuery.OrderByDescending(x => x.Price),

                "nameasc" => ticketQuery.OrderBy(n => n.FromCity.Name),
                "namedesc" => ticketQuery.OrderByDescending(n => n.FromCity.Name),

                _ => ticketQuery.OrderByDescending(t => t.Departure)
            };

            var totalCount = await ticketQuery.CountAsync();

            var pageSize = Math.Clamp(query.PageSize, 1, 50);

            var page = Math.Max(query.Page, 1);

            var ticket = await ticketQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new TicketListDto
                {
                    No = x.No,
                    FromCityName = x.FromCity.Name,
                    ToCityName = x.ToCity.Name,
                    ToId = x.ToCity.Id,
                    FromId = x.FromCity.Id,
                    NeedCheckUp = x.NeedCheckUp,
                    Transfer = x.Transfer,
                    Departure = x.Departure,
                    Arrival = x.Arrival,
                }).ToListAsync();

            var totalPage = (int)Math.Ceiling(totalCount / (double)pageSize);

            var result = new PagedResultDto<TicketListDto>
            {
                Items = ticket,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPage,
            };

            return Ok(result);
        }

        //[HttpGet]
        //public async Task<IActionResult> GetFlight(int fromCityId, int toCityId)
        //{
        //    //var fromCity = await _context.Tickets.FirstOrDefaultAsync(f => f.FromCity.Id == fromCityId);
        //    //var toCity = await _context.Tickets.FirstOrDefaultAsync(f => f.ToCity.Id == fromCityId);



        //}

        [HttpPost]
        public async Task<ActionResult<CreatedTicketDto>> CreateTicket([FromBody] CreatedTicketDto dto)
        {
            if (dto == null)
            {
                return BadRequest("It's value null");
            }

            if (dto?.Departure == null)
            {
                return BadRequest("Requeried Departure Time");
            }

            if (dto?.Arrival == null)
            {
                return BadRequest("Requeried arrival Time");
            }

            if (dto?.Arrival < dto?.Departure)
            {
                return BadRequest("the flight's departure time should be before it is Arrival time");
            }

            var fromCityExits = await _context.Cities.AnyAsync(c => c.Id == dto.FromCityId);
            var toCityExits = await _context.Cities.AnyAsync(c => c.Id == dto.ToCityId);

            if (!toCityExits)
            {
                return BadRequest("Not find this To city");
            }

            if (!fromCityExits)
            {
                return BadRequest("Not find this From city");
            }



            var lastTicket = await _context.Tickets
                               .OrderByDescending(i => i.No)
                               .FirstOrDefaultAsync();

            int lastNo = lastTicket?.No ?? 0;

            var result = new Ticket
            {
                No = lastNo + 1,
                ToCityId = dto?.ToCityId,
                FromCityId = dto?.FromCityId,
                Transfer = dto.Transfer,
                NeedCheckUp = dto.NeedCheckUp,
                Departure = dto.Departure,
                Arrival = dto.Arrival,
            };

            await _context.Tickets.AddAsync(result);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTickets), new { id = result.Id }, result);
        }

    }
}
