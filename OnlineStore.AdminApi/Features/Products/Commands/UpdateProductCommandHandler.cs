using MediatR;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 更新商品的 Command Handler。
/// </summary>
public sealed class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, UpdateProductResult>
{
    private readonly ApplicationDbContext _db;
    public UpdateProductCommandHandler(ApplicationDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }
    public async Task<UpdateProductResult> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = await _db.Products.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity is null)
        {
            return new UpdateProductResult { Success = false, NotFound = true };
        }
        if (string.IsNullOrWhiteSpace(request.Name) || request.Price < 0 || request.Stock < 0)
        {
            return new UpdateProductResult { Success = false, ErrorMessage = "Invalid product data." };
        }
        entity.Name = request.Name;
        entity.Description = request.Description ?? string.Empty;
        entity.Category = request.Category ?? string.Empty;
        entity.Price = (int)request.Price;
        entity.Stock = request.Stock;
        entity.Featured = request.Featured;
        entity.Image = request.Image ?? string.Empty;
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
        return new UpdateProductResult { Success = true, Product = viewModel };
    }
}
