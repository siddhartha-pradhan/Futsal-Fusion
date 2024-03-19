using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.SportObjects.Commands.UpdateSportObject
{
  public class UpdateSportObjectCommandValidator : AbstractValidator<UpdateSportObjectCommand>
  {
    private readonly IAppDbContext _context;
    public UpdateSportObjectCommandValidator(IAppDbContext context)
    {
      _context = context;

      //RuleFor(so => so.Email)
      //      .NotEmpty().WithMessage("Email je obavezan")
      //      .MaximumLength(256).WithMessage("Email ne sme biti duzi od 256 karaktera")
      //      .EmailAddress().WithMessage("Email nije u ispravnom formatu")
      //      .MustAsync(BeUniqueEmail).WithMessage("Izabrani email vec postoji");

      RuleFor(so => so.Name)
          .NotEmpty().WithMessage("Name is required")
          .MaximumLength(30).WithMessage("The name must not be longer than 30 characters")
          .MustAsync(BeUniqueName).WithMessage("The selected name already exists");

      RuleFor(so => so.Address)
          .NotEmpty().WithMessage("Address is required")
          .MaximumLength(50).WithMessage("The address must not be longer than 50 characters");

      RuleFor(so => so.Phone)
          .NotEmpty().WithMessage("Phone Number is required")
          .MaximumLength(10).WithMessage("The phone number must not be longer than 10 characters");

      RuleFor(so => so.Description)
          .NotEmpty().WithMessage("Description is required")
          .MaximumLength(500).WithMessage("The description must not be longer than 500 characters");

      RuleFor(so => so.SportId)
          .NotEmpty().WithMessage("Sport facility is required")
          .MustAsync(SportExists).WithMessage("The selected sport does not exist");

      RuleFor(so => so.CityId)
          .NotEmpty().WithMessage("City is required")
          .MustAsync(CityExists).WithMessage("The selected city does not exist");
    }

    //public async Task<bool> BeUniqueEmail(UpdateSportObjectCommand model, string email, CancellationToken cancellationToken)
    //{
    //  return await _context.SportObjects
    //        .Where(so => so.Id != model.Id)
    //        .AllAsync(so => so.Email != email);
    //}

    public async Task<bool> BeUniqueName(UpdateSportObjectCommand model, string name, CancellationToken cancellationToken)
    {
      return await _context.SportObjects
            .Where(so => so.Id != model.Id)
            .AllAsync(so => so.Name != name);
    }

    public async Task<bool> SportExists(int id, CancellationToken cancellationToken)
    {
      return await _context.Sports.AnyAsync(c => c.Id == id);
    }

    public async Task<bool> CityExists(int id, CancellationToken cancellationToken)
    {
      return await _context.Cities.AnyAsync(c => c.Id == id);
    }
  }
}
