using MediatR;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 切換商品精選狀態的 Command Handler。
/// </summary>
public class ToggleFeaturedCommandHandler : IRequestHandler<ToggleFeaturedCommand, ToggleFeaturedResult>
{
    private readonly ApplicationDbContext _db;
    public ToggleFeaturedCommandHandler(ApplicationDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }
    public async Task<ToggleFeaturedResult> Handle(ToggleFeaturedCommand request, CancellationToken cancellationToken)
    {
        var entity = await _db.Products.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity is null)
        {
            return new ToggleFeaturedResult { Success = false };
        }
        entity.Featured = !entity.Featured;
        entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        var viewModel = new ProductViewModel
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Category = entity.Category,
            Price = entity.Price,
            Stock = entity.Stock,
            Featured = entity.Featured,
            Image = entity.Image,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
        return new ToggleFeaturedResult { Success = true, Product = viewModel };
    }
}
