namespace ReactApp1.Server.DTOs
{
    public class TicketQueryDto
    {
        public string? Search { get; set; }

        public int? ToCityId { get; set; }
        public int? FromCityId { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public int Page { get; set; } = 1;

        public int PageSize { get; set; } = 8;

        public string Sort { get; set; } = "newest";
    }
}
