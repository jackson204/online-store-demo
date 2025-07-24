using MediatR;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;
using Microsoft.EntityFrameworkCore;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 建立商品的 Command Handler。
/// </summary>
public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, CreateProductResult>
{
    private readonly ApplicationDbContext _db;
    public CreateProductCommandHandler(ApplicationDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }
    public async Task<CreateProductResult> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || request.Price < 0 || request.Stock < 0)
        {
            return new CreateProductResult { Success = false, ErrorMessage = "Invalid product data." };
        }
        var entity = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            Price = request.Price,
            Stock = request.Stock,
            Featured = request.Featured,
            Image = request.Image,
            CreatedAt = request.CreatedAt
        };
        _db.Products.Add(entity);
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
        return new CreateProductResult { Success = true, Products = products };
    }
}
