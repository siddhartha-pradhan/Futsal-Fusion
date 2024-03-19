using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Prices.Commands.UpdatePrice
{
    public class UpdatePriceCommand : IRequest
    {
        public int PriceId { get; set; }
        public int SportObjectId { get; set; }
        public int PricePerHour { get; set; }
        public string TimeFrom { get; set; }
        public string TimeTo { get; set; }
    }

    public class UpdatePriceCommandHandler : IRequestHandler<UpdatePriceCommand>
    {
        private readonly IAppDbContext _context;
        private readonly IIdentityService _identityService;

        public UpdatePriceCommandHandler(IAppDbContext context, IIdentityService identityService)
        {
            _context = context;
            _identityService = identityService;
        }

        public async Task<Unit> Handle(UpdatePriceCommand request, CancellationToken cancellationToken)
        {
            var timeFrom = TimeSpan.Parse(request.TimeFrom);
            var timeTo = TimeSpan.Parse(request.TimeTo);

            if (timeFrom.Hours > timeTo.Hours && timeTo.Hours != 0)
            {
                throw new Exception("The starting time must be greater than the ending time");
            }

            var sportObject = await _context.SportObjects.FindAsync(request.SportObjectId);

            if (sportObject == null)
            {
                throw new NotFoundException(nameof(SportObject), request.SportObjectId);
            }

            var isOwner = await _identityService.CheckIfClientIsOwnerAsync(sportObject);

            if (!isOwner)
            {
                throw new Exception("Bad client");
            }

            var minTimeWorkingHour = sportObject.WorkingHours.Min(wh => wh.OpenTime);
            var maxTimeWorkingHour = sportObject.WorkingHours.Min(wh => wh.CloseTime);

            if (maxTimeWorkingHour.Hours != 0)
            {
                maxTimeWorkingHour = sportObject.WorkingHours.Max(wh => wh.CloseTime);
            }

            if (sportObject.Prices.Count <2)
            {
                throw new Exception("You must have at least 2 prices");
            }

            var price = sportObject.Prices.SingleOrDefault(p => p.Id == request.PriceId);

            if (price == null)
            {
                throw new NotFoundException(nameof(Price), request.PriceId);
            }

            if (price.TimeFrom == minTimeWorkingHour && timeFrom != minTimeWorkingHour)
            {
                throw new Exception("The starting time of the first price cannot be changed");
            }

            if (price.TimeTo == maxTimeWorkingHour && timeTo != maxTimeWorkingHour)
            {
                throw new Exception("The end time of the last price cannot be changed");
            }

            var priceBefore = sportObject.Prices.FirstOrDefault(p => p.TimeTo.Hours == price.TimeFrom.Hours);
            var priceAfter = sportObject.Prices.FirstOrDefault(p => p.TimeFrom.Hours == price.TimeTo.Hours);

            if (priceBefore != null)
            {
                if (timeFrom.Hours <= priceBefore.TimeFrom.Hours)
                {
                    throw new Exception("Bad starting time");
                }

                priceBefore.TimeTo = timeFrom;
            }

            if (priceAfter != null)
            {
                if ((timeTo.Hours >= priceAfter.TimeTo.Hours && priceAfter.TimeTo.Hours != 0) || timeTo.Hours == priceAfter.TimeTo.Hours)
                {
                    throw new Exception("Bad timing");
                }

                priceAfter.TimeFrom = timeTo;
            }

            price.PricePerHour = request.PricePerHour;
            price.TimeFrom = timeFrom;
            price.TimeTo = timeTo;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
/*
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */