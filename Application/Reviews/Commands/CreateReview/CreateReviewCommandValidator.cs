using FluentValidation;

namespace Application.Reviews.Commands.CreateReview
{
  public class CreateReviewCommandValidator : AbstractValidator<CreateReviewCommand>
  {
    public CreateReviewCommandValidator()
    {
      RuleFor(r => r.Rating)
            .NotEmpty().WithMessage("Rating is mandatory")
            .InclusiveBetween(1, 5).WithMessage("The rating must be between 1 and 5");

      RuleFor(r => r.Comment)
            .MaximumLength(500).WithMessage("The comment must not be greater than 500 characters.");
    }
  }
}