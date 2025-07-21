using MediatR;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Queries;

public class GetProductsQueryHandler(ApplicationDbContext db) : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
{
    /// <summary>
    /// 處理產品查詢，回傳產品 DTO 清單。
    /// </summary>
    /// <param name="request">查詢參數</param>
    /// <param name="cancellationToken">取消權杖</param>
    /// <returns>產品 DTO 清單</returns>
    public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await db.Products
            .AsNoTracking()
            .Select(p => new ProductDto
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
            })
            .ToListAsync(cancellationToken);
        return products;
    }
}
