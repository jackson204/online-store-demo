using MediatR;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 更新商品的 Command Handler。
/// </summary>
public sealed class UpdateProductCommandHandler(ApplicationDbContext db) : IRequestHandler<UpdateProductCommand, UpdateProductResult>
{
    public async Task<UpdateProductResult> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = await db.Products.FindAsync([request.Id], cancellationToken);
        if (entity is null)
        {
            return new UpdateProductResult { Success = false, NotFound = true };
        }
        // 資料驗證（可擴充）
        if (string.IsNullOrWhiteSpace(request.Product.Name))
        {
            return new UpdateProductResult { Success = false, ErrorMessage = "商品名稱不得為空" };
        }
        entity.Name = request.Product.Name;
        entity.Description = request.Product.Description;
        entity.Price = request.Product.Price;
        entity.IsFeatured = request.Product.IsFeatured;
        await db.SaveChangesAsync(cancellationToken);
        var dto = new ProductDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Price = entity.Price,
            Featured = entity.Featured
        };
        return new UpdateProductResult { Success = true, Product = dto };
    }
}
