using FluentValidation;

namespace Application.Reviews.Commands.UpdateReview
{
  public class UpdateReviewCommandValidator : AbstractValidator<UpdateReviewCommand>
  {
    public UpdateReviewCommandValidator()
    {
      RuleFor(r => r.Rating)
            .NotEmpty().WithMessage("Rating is mandatory")
            .InclusiveBetween(1, 5).WithMessage("The rating must be between 1 and 5");

      RuleFor(r => r.Comment)
            .MaximumLength(500).WithMessage("The comment cannot be longer than 500 characters");
    }
  }
}