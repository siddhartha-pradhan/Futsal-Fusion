using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class AppDbContextSeed
    {
        public static async Task SeedAsync(AppDbContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roles = new List<IdentityRole>
        {
          new IdentityRole { Name = "admin"},
          new IdentityRole { Name = "client"},
          new IdentityRole { Name = "user"}
        };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }

            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
        {
          new AppUser { Email = "admin@test.com", UserName = "admin@test.com" },
          new AppUser { Email = "bob@test.com", UserName = "bob@test.com" },
          new AppUser { Email = "john@test.com", UserName = "john@test.com" },
          new AppUser { Email = "rob@test.com", UserName = "rob@test.com" }
        };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "test12");
                }
            }

            if (!context.UserRoles.Any())
            {
                var users = await userManager.Users.ToListAsync();

                foreach (var user in users)
                {
                    await userManager.AddToRoleAsync(user, "user");
                }

                var admin = await userManager.FindByNameAsync("admin@test.com");
                await userManager.AddToRoleAsync(admin, "admin");
            }

            if (!context.Countries.Any())
            {
                var countries = new List<Country>
        {
            new Country
            {
              Name = "Nepal",
              Cities = new List<City> { new City { Name = "Kathmandu" }, new City { Name = "Nis"}, new City { Name = "Lalitpur"}}
            },
            new Country { Name = "India", Cities = new List<City> { new City { Name = "Delhi" }} },
            new Country { Name = "Bhutan", Cities = new List<City> { new City { Name = "Thimpu" }} }
        };

                await context.Countries.AddRangeAsync(countries);

                await context.SaveChangesAsync();
            }

            if (!context.Sports.Any())
            {
                var sports = new List<Sport>
        {
          new Sport { Name = "Football" },
          new Sport { Name = "Basketball" },
          new Sport { Name = "Tennis" },
          new Sport { Name = "Gym" },
        };

                await context.Sports.AddRangeAsync(sports);

                await context.SaveChangesAsync();
            }

            if (!context.ReservationStatuses.Any())
            {
                var reservationStatuses = new List<ReservationStatus>
        {
          new ReservationStatus {Status = Status.Pending},
          new ReservationStatus {Status = Status.Accepted},
          new ReservationStatus {Status = Status.Declined}
        };

                await context.ReservationStatuses.AddRangeAsync(reservationStatuses);

                await context.SaveChangesAsync();
            }
        }
    }
}