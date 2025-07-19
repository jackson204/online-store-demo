using MediatR;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 切換商品精選狀態的 Command Handler。
/// </summary>
public sealed class ToggleFeaturedCommandHandler(ApplicationDbContext db) : IRequestHandler<ToggleFeaturedCommand, ToggleFeaturedResult>
{
    public async Task<ToggleFeaturedResult> Handle(ToggleFeaturedCommand request, CancellationToken cancellationToken)
    {
        var entity = await db.Products.FindAsync([request.Id], cancellationToken);
        if (entity is null)
        {
            return new ToggleFeaturedResult { Success = false };
        }
        entity.IsFeatured = !entity.IsFeatured;
        await db.SaveChangesAsync(cancellationToken);
        var dto = new ProductDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Price = entity.Price,
            Featured = entity.Featured
        };
        return new ToggleFeaturedResult { Success = true, Product = dto };
    }
}
