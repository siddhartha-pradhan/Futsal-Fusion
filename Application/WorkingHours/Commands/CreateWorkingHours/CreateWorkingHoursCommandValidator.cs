using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.WorkingHours.Commands.CreateWorkingHours
{
    public class CreateWorkingHoursCommandValidator : AbstractValidator<CreateWorkingHoursCommand>
    {
        private readonly IAppDbContext _context;
        public CreateWorkingHoursCommandValidator(IAppDbContext context)
        {
            _context = context;

            RuleFor(wh => wh.WorkingHours.Count)
                .NotEmpty().WithMessage("Working hours are mandatory")
                .InclusiveBetween(7, 7).WithMessage("You must enter working hours for all days");

            RuleFor(wh => wh.SportObjectId)
                .MustAsync(WorkingHoursExists)
                .WithMessage("The working hours for the selected sports facility already exist");

            RuleForEach(wh => wh.WorkingHours).SetValidator(new WorkingHourValidator());
        }

        public async Task<bool> WorkingHoursExists(int sportObjectId, CancellationToken cancellationToken)
        {
            return await _context.WorkingHours.AllAsync(wh => wh.SportObjectId != sportObjectId);
        }
    }

    public class WorkingHourValidator : AbstractValidator<WorkingHourDto>
    {
        public WorkingHourValidator()
        {
            RuleFor(x => TimeSpan.Parse(x.OpenTime).Hours)
                .GreaterThanOrEqualTo(6).WithMessage("Opening time must be at 06:00 or later");

            RuleFor(x => TimeSpan.Parse(x.OpenTime))
                .LessThan(x => TimeSpan.Parse(x.CloseTime))
                .When(x => TimeSpan.Parse(x.CloseTime).Hours <= 23 && TimeSpan.Parse(x.CloseTime).Hours > 6)
                .WithMessage("The opening time must be less than the closing time");

            When(x => TimeSpan.Parse(x.CloseTime).Hours <= 6 && TimeSpan.Parse(x.CloseTime).Hours >= 1, () =>
            {
                RuleFor(x => TimeSpan.Parse(x.CloseTime).Hours)
                    .GreaterThan(6).WithMessage("The closing time cannot be later than midnight (00:00).");
            });
        }
    }
}