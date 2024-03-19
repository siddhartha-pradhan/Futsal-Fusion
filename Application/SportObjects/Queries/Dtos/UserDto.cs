using Application.Common.Mappings;
using Domain.Entities;

namespace Application.SportObjects.Queries.Dtos
{
  public class UserDto : IMapFrom<AppUser>
  {
    public string Id { get; set; }
    public string Username { get; set; }
  }
}