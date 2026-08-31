namespace ReactApp1.Server.DTOs
{
    public class CityListDto
    {
        public int? Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CountryId { get; set; }
        public string CountryName { get; set; } = string.Empty;
    }
}