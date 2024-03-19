using System.Collections.Generic;
using Application.Cities.Queries.Dtos;

namespace Application.Cities.Queries.GetCitiesList
{
    public class CitiesListVm
    {
        public IList<CityDto> Cities { get; set; }
        public int CitiesCount { get; set; }
    }
}