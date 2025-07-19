using System.Data.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Queries;

public class GetProductsQueryHandler(ApplicationDbContext db) : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
{
    public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var products = await db.Products.AsNoTracking().ToListAsync(cancellationToken);
            return products.Select(p => new ProductDto
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
            });
        }
        catch (Exception ex) when (ex is DbUpdateException or DbUpdateConcurrencyException or ObjectDisposedException or DbException)
        {
            throw new DatabaseQueryException("資料庫查詢異常", ex);
        }
    }
}
