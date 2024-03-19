using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Reservations.Commands.CreateReservation
{
    public class CreateReservationCommandValidator : AbstractValidator<CreateReservationCommand>
    {
        private readonly IAppDbContext _context;
        public CreateReservationCommandValidator(IAppDbContext context)
        {
            _context = context;

            RuleFor(r => r.SportObjectId)
                 .NotEmpty().WithMessage("A sports facility is mandatory");

            RuleFor(r => r.StartTime)
                  .NotEmpty().WithMessage("The starting time is mandatory")
                  .MustAsync(ReservationExists).WithMessage("The reservation for the selected time already exists")
                  .MustAsync(TimeInWorkingHours).WithMessage("The sports facility does not work at the selected time");

            RuleFor(r => r.Date)
                    .NotEmpty().WithMessage("The date is mandatory");
        }

        public async Task<bool> ReservationExists(CreateReservationCommand model, string startTime, CancellationToken cancellationToken)
        {
            return await _context.Reservations
                .Where(r => r.SportObjectId == model.SportObjectId && r.Date == DateTime.Parse(model.Date))
                .AllAsync(r => r.StartTime != TimeSpan.Parse(startTime));
        }

        public async Task<bool> TimeInWorkingHours(CreateReservationCommand model, string startTime, CancellationToken cancellationToken)
        {
            bool isValid = false;

            // converting to DayOfWeek starts with monday with int value of 1, sunday have value 7
            var day = ((int)DateTime.Parse(model.Date).DayOfWeek == 0) ? 7 : (int)DateTime.Parse(model.Date).DayOfWeek;
            var timeOfStart = TimeSpan.Parse(startTime);

            var sportObject = await _context.SportObjects.FindAsync(model.SportObjectId);

            var workingHour = sportObject.WorkingHours.SingleOrDefault(wh => wh.Day == day);

            if (workingHour.CloseTime.Hours == 0)
            {
                if (timeOfStart >= workingHour.OpenTime && timeOfStart.Hours < 24)
                {
                    isValid = true;
                }
            }
            else
            {
                if (timeOfStart >= workingHour.OpenTime && timeOfStart < workingHour.CloseTime)
                {
                    isValid = true;
                }
            }

            return isValid;
        }
    }
}