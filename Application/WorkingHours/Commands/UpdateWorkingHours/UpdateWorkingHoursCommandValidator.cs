using System;
using FluentValidation;

namespace Application.WorkingHours.Commands.UpdateWorkingHours
{
    public class UpdateWorkingHoursCommandValidator : AbstractValidator<UpdateWorkingHoursCommand>
    {
        public UpdateWorkingHoursCommandValidator()
        {
            RuleFor(wh => wh.WorkingHours.Count)
                .NotEmpty().WithMessage("Working hours are mandatory")
                .InclusiveBetween(7, 7).WithMessage("You must enter working hours for all days");

            RuleForEach(wh => wh.WorkingHours).SetValidator(new WorkingHourValidator());
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
                    .GreaterThan(6).WithMessage("Closing time cannot be later than midnight (24:00)");
            });
        }
    }
}