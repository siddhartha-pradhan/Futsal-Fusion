using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Roles.Commands.UpdateRole
{
  public class UpdateRoleCommandValidator : AbstractValidator<UpdateRoleCommand>
  {
    private readonly RoleManager<IdentityRole> _roleManager;
    public UpdateRoleCommandValidator(RoleManager<IdentityRole> roleManager)
    {
      _roleManager = roleManager;

      RuleFor(v => v.Name)
          .NotEmpty().WithMessage("Name is required")
          .MaximumLength(30).WithMessage("The name must not be longer than 30 characters")
          .MustAsync(BeUniqueName).WithMessage("The selected name already exists");
    }

    public async Task<bool> BeUniqueName(UpdateRoleCommand model, string name, CancellationToken cancellationToken)
    {
      return await _roleManager.Roles
          .Where(r => r.Id != model.Id)
          .AllAsync(r => r.Name != name);
    }
  }
}