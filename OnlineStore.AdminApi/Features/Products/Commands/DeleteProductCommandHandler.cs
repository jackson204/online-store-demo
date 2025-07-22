using OnlineStore.AdminApi.ViewModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 刪除商品的 Command Handler。
/// </summary>
public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, DeleteProductResult>
{
    private readonly ApplicationDbContext _db;
    public DeleteProductCommandHandler(ApplicationDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }
    public async Task<DeleteProductResult> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var entity = await _db.Products.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity is null)
        {
            return new DeleteProductResult { Success = false };
        }
        _db.Products.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        var products = await _db.Products.Select(p => new ProductViewModel
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Category = p.Category,
            Price = p.Price,
            Stock = p.Stock,
            Featured = p.Featured,
            Image = p.Image,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        }).ToListAsync(cancellationToken);
        return new DeleteProductResult { Success = true, Products = products };
    }
}
