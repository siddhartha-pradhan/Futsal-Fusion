using FluentValidation;

namespace Application.Prices.Commands.UpdatePrice
{
  public class UpdatePriceCommandValidator : AbstractValidator<UpdatePriceCommand>
  {
    public UpdatePriceCommandValidator()
    {
      RuleFor(p => p.PricePerHour)
            .NotEmpty().WithMessage("Price is mandatory")
            .LessThanOrEqualTo(99999).WithMessage("The price cannot be higher than 99999");

      RuleFor(p => p.TimeFrom)
              .NotEmpty().WithMessage("The start time of the interval is mandatory");

      RuleFor(p => p.TimeTo)
              .NotEmpty().WithMessage("The end time of the interval is mandatory");
    }
  }
}