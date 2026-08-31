namespace ReactApp1.Server.Entities
{
    public class Ticket
    {
        public int Id { get; set; }

        public int No { get; set; }
        public int? ToCityId { get; set; }
        public City? ToCity { get; set; }
        public int? FromCityId { get; set; }
        public City? FromCity { get; set; }
        public decimal Price { get; set; }
        public bool NeedCheckUp { get; set; } = false;
        public bool Transfer { get; set; } = false;
        public DateTime Departure { get; set; }
        public DateTime Arrival { get; set; }
    }
}
