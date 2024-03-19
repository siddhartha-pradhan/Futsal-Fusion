using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Sports.Commands.CreateSport
{
  public class CreateSportCommandValidator : AbstractValidator<CreateSportCommand>
  {
    private readonly IAppDbContext _context;
    public CreateSportCommandValidator(IAppDbContext context)
    {
      _context = context;

      RuleFor(s => s.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(15).WithMessage("The name must not be longer than 15 characters")
            .MustAsync(BeUniqueName).WithMessage("The selected name already exists");
    }

    public async Task<bool> BeUniqueName(string name, CancellationToken cancellationToken)
    {
      return await _context.Sports.AllAsync(s => s.Name != name);
    }
  }
}