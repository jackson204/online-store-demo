using MediatR;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;
using Microsoft.EntityFrameworkCore;

namespace OnlineStore.AdminApi.Features.Products;

/// <summary>
/// 刪除商品的 Command Handler。
/// </summary>
public sealed class DeleteProductCommandHandler(ApplicationDbContext db) : IRequestHandler<DeleteProductCommand, DeleteProductResult>
{
    public async Task<DeleteProductResult> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var entity = await db.Products.FindAsync([request.Id], cancellationToken);
        if (entity is null)
        {
            return new DeleteProductResult { Success = false };
        }
        db.Products.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        var products = await db.Products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Featured = p.Featured
        }).ToListAsync(cancellationToken);
        return new DeleteProductResult { Success = true, Products = products };
    }
}
