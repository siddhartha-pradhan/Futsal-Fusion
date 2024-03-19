using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Countries.Commands.CreateCountry
{
  public class CreateCountryCommandValidator : AbstractValidator<CreateCountryCommand>
  {
    private readonly IAppDbContext _context;

    public CreateCountryCommandValidator(IAppDbContext context)
    {
      _context = context;

      RuleFor(c => c.Name)
        .NotEmpty().WithMessage("Name is required")
        .MaximumLength(200).WithMessage("The name must not be longer than 200 characters.")
        .MustAsync(BeUniqueName).WithMessage("The selected name already exists.");
    }

    public async Task<bool> BeUniqueName(string name, CancellationToken cancellationToken)
    {
      return await _context.Countries.AllAsync(c => c.Name != name);
    }
  }
}