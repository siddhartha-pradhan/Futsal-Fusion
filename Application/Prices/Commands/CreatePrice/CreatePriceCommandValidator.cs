using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Prices.Commands.CreatePrice
{
    public class CreatePriceCommandValidator : AbstractValidator<CreatePriceCommand>
    {
        private readonly IAppDbContext _context;
        public CreatePriceCommandValidator(IAppDbContext context)
        {
            _context = context;

            RuleFor(p => p.PricePerHour)
                  .NotEmpty().WithMessage("Price is mandatory")
                  .LessThanOrEqualTo(99999).WithMessage("The price cannot be higher than 99999");

            RuleFor(p => p.SportObjectId)
                    .NotEmpty().WithMessage("A sports facility is mandatory");

            // RuleFor(p => p.TimeFrom)
            //         .NotEmpty().WithMessage("Vreme pocetka intervala je obavezno")
            //         .MustAsync(BeUniqueTimeFrom).WithMessage("Izabrani interval vec postoji");

            // RuleFor(p => p.TimeTo)
            //         .NotEmpty().WithMessage("Vreme kraja intervala je obavezno");
        }

        public async Task<bool> BeUniqueTimeFrom(CreatePriceCommand model, string timeFrom, CancellationToken cancellationToken)
        {
            var time = TimeSpan.Parse(timeFrom);

            return await _context.Prices
                .Where(p => p.SportObjectId == model.SportObjectId)
                .AllAsync(p => time > p.TimeTo || time < p.TimeFrom);
        }
    }
}