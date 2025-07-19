using MediatR;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;
using Microsoft.EntityFrameworkCore;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 建立商品的 Command Handler。
/// </summary>
public sealed class CreateProductCommandHandler(ApplicationDbContext db) : IRequestHandler<CreateProductCommand, CreateProductResult>
{
    public async Task<CreateProductResult> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // 資料驗證（可擴充）
        if (string.IsNullOrWhiteSpace(request.Product.Name))
        {
            return new CreateProductResult { Success = false, ErrorMessage = "商品名稱不得為空" };
        }
        var entity = new Product
        {
            Name = request.Product.Name,
            Description = request.Product.Description,
            Price = request.Product.Price,
            IsFeatured = request.Product.IsFeatured
        };
        db.Products.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        var products = await db.Products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Featured = p.Featured
        }).ToListAsync(cancellationToken);
        return new CreateProductResult { Success = true, Products = products };
    }
}
