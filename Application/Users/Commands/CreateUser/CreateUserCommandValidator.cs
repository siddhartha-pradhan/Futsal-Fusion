using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.CreateUser
{
  public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
  {
    private readonly IAppDbContext _context;
    public CreateUserCommandValidator(IAppDbContext context)
    {
      _context = context;

      RuleFor(u => u.Email)
          .NotEmpty().WithMessage("Email is required")
          .EmailAddress().WithMessage("The email is not in the correct format")
          .MustAsync(BeUniqueEmail).WithMessage("Email already exists");

      RuleFor(u => u.Username)
          .NotEmpty().WithMessage("Username is required")
          .MustAsync(BeUniqueUsername).WithMessage("Username already exists");

      RuleFor(u => u.Password)
          .NotEmpty().WithMessage("Password is required")
          .MinimumLength(6).WithMessage("Password must be longer than 6 characters");
    }

    public async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
      return await _context.Users.AllAsync(u => u.Email != email);
    }

    public async Task<bool> BeUniqueUsername(string username, CancellationToken cancellationToken)
    {
      return await _context.Users.AllAsync(u => u.UserName != username);
    }
  }
}