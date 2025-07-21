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
            Category = request.Product.Category,
            Price = request.Product.Price,
            Stock = request.Product.Stock,
            Featured = request.Product.Featured,
            Image = request.Product.Image,
            CreatedAt = request.Product.CreatedAt,
            UpdatedAt = request.Product.UpdatedAt
        };
        db.Products.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        var products = await db.Products.Select(p => new ProductDto
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
        return new CreateProductResult { Success = true, Products = products };
    }
}
