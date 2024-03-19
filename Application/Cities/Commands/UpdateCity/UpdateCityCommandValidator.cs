using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Cities.Commands.UpdateCity
{
    public class UpdateCountryCommandValidator : AbstractValidator<UpdateCityCommand>
    {
        private readonly IAppDbContext _context;

        public UpdateCountryCommandValidator(IAppDbContext context)
        {
            _context = context;

            RuleFor(c => c.Name)
              .NotEmpty().WithMessage("Name is required.")
              .MaximumLength(30).WithMessage("The name must not be longer than 30 characters.")
              .MustAsync(BeUniqueName).WithMessage("The selected name already exists.");

            RuleFor(c => c.CountryId)
                .NotEmpty().WithMessage("The state is mandatory.")
                .MustAsync(CountryExists).WithMessage("The selected country does not exist.");
        }

        public async Task<bool> BeUniqueName(UpdateCityCommand model, string name, CancellationToken cancellationToken)
        {
            return await _context.Cities
                  .Where(c => c.Id != model.Id)
                  .AllAsync(c => c.Name != name);
        }

        public async Task<bool> CountryExists(int id, CancellationToken cancellationToken)
        {
            return await _context.Countries.AnyAsync(c => c.Id == id);
        }
    }
}