namespace ReactApp1.Server.DTOs
{
    public class TicketListDto
    {
        public int No { get; set; }
        public int ToId { get; set; }
        public int FromId { get; set; }
        public string? FromCityName { get; set; }
        public string? ToCityName { get; set; }
        public bool NeedCheckUp { get; set; }
        public bool Transfer { get; set; }
        public DateTime Departure { get; set; }
        public DateTime Arrival { get; set; }
    }
}
