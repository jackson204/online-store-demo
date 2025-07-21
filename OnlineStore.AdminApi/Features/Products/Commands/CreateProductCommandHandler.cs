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
    private readonly ApplicationDbContext _db = db ?? throw new ArgumentNullException(nameof(db));

    public async Task<CreateProductResult> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // 資料驗證
        if (string.IsNullOrWhiteSpace(request.Product.Name))
        {
            return new CreateProductResult { Success = false, ErrorMessage = "商品名稱不得為空" };
        }
        if (request.Product.Price < 0)
        {
            return new CreateProductResult { Success = false, ErrorMessage = "價格不可為負" };
        }
        if (request.Product.Stock < 0)
        {
            return new CreateProductResult { Success = false, ErrorMessage = "庫存不可為負" };
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
        _db.Products.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        var products = await _db.Products.Select(p => new ProductDto
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
