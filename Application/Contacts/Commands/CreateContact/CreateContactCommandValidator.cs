using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Contacts.Commands.CreateContact
{
    public class CreateContactCommandValidator : AbstractValidator<CreateContactCommand>
    {
        public CreateContactCommandValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("The name of the sports facility is mandatory")
                .MaximumLength(30).WithMessage("The name must not be longer than 30 characters");

            RuleFor(c => c.Email)
                .NotEmpty().WithMessage("Email is required")
                .MaximumLength(30).WithMessage("The email must not be longer than 30 characters.");

            RuleFor(c => c.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is mandatory.")
                .MaximumLength(20).WithMessage("The phone number must not be longer than 20 characters.");

            RuleFor(c => c.Package)
                .NotEmpty().WithMessage("Package is required.")
                .MaximumLength(20).WithMessage("The package must not be longer than 30 characters.");

            RuleFor(c => c.Message)
                .MaximumLength(300).WithMessage("The message must not be longer than 300 characters.");
        }
    }
}
