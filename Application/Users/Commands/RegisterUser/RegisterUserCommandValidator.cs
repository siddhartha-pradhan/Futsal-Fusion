using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.RegisterUser
{
  public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
  {
    private readonly IAppDbContext _context;
    public RegisterUserCommandValidator(IAppDbContext context)
    {
      _context = context;

      RuleFor(v => v.Email)
          .NotEmpty().WithMessage("Email is required")
          .EmailAddress().WithMessage("The email is not in the correct format")
          .MustAsync(BeUniqueEmail).WithMessage("Email already exists");

      RuleFor(u => u.Username)
          .NotEmpty().WithMessage("Username is required")
          .MustAsync(BeUniqueUsername).WithMessage("Username already exists");

      RuleFor(v => v.Password)
          .NotEmpty().WithMessage("Password is required");
    }

    public async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
      return await _context.Users.AllAsync(c => c.Email != email);
    }

    public async Task<bool> BeUniqueUsername(string username, CancellationToken cancellationToken)
    {
      return await _context.Users.AllAsync(u => u.UserName != username);
    }
  }
}