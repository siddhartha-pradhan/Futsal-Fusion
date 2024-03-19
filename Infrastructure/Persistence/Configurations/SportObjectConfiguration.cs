using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class SportObjectConfiguration : IEntityTypeConfiguration<SportObject>
  {
    public void Configure(EntityTypeBuilder<SportObject> builder)
    {
      builder.Property(so => so.Email)
          .HasMaxLength(256)
          .IsRequired();

      builder.Property(so => so.Name)
          .HasMaxLength(30)
          .IsRequired();

      builder.Property(so => so.Address)
          .HasMaxLength(50)
          .IsRequired();

      builder.Property(so => so.Phone)
          .HasMaxLength(10)
          .IsRequired();

      builder.Property(so => so.Description)
          .HasMaxLength(500)
          .IsRequired();

      builder.Property(so => so.SportId).IsRequired();

      builder.Property(so => so.CityId).IsRequired();
    }
  }
}