using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Countries.Commands.UpdateCountry
{
  public class UpdateCountryCommandValidator : AbstractValidator<UpdateCountryCommand>
  {
    private readonly IAppDbContext _context;
    public UpdateCountryCommandValidator(IAppDbContext context)
    {
      _context = context;

      RuleFor(v => v.Name)
        .NotEmpty().WithMessage("Name is required.")
        .MaximumLength(200).WithMessage("The name must not be longer than 200 characters.")
        .MustAsync(BeUniqueName).WithMessage("The selected name already exists.");
    }

    public async Task<bool> BeUniqueName(UpdateCountryCommand model, string name, CancellationToken cancellationToken)
    {
      return await _context.Countries
            .Where(c => c.Id != model.Id)
            .AllAsync(c => c.Name != name);
    }
  }
}