using OnlineStore.AdminApi.ViewModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;

namespace OnlineStore.AdminApi.Features.Products.Queries;

public class GetProductsQueryHandler(ApplicationDbContext db) : IRequestHandler<GetProductsQuery, IEnumerable<ProductViewModel>>
{
    /// <summary>
    /// 處理產品查詢，回傳產品 DTO 清單。
    /// </summary>
    /// <param name="request">查詢參數</param>
    /// <param name="cancellationToken">取消權杖</param>
    /// <returns>產品 DTO 清單</returns>
    public async Task<IEnumerable<ProductViewModel>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        return await db.Products
            .Select(p => new ProductViewModel
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
    }
}
