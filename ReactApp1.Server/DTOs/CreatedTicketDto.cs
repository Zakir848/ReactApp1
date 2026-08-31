using ReactApp1.Server.Entities;

namespace ReactApp1.Server.DTOs
{
    public class CreatedTicketDto
    {
        public int ToCityId { get; set; }
        public int FromCityId { get; set; }
        public bool NeedCheckUp { get; set; } = false;
        public bool Transfer { get; set; } = false;
        public decimal Price { get; set; }
        public DateTime Departure { get; set; }
        public DateTime Arrival { get; set; }
    }
}