using ECommerceAPI.Features.Products.DTOs;
using MediatR;

namespace ECommerceAPI.Features.Products.Queries.GetAllProducts;

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
{
    private readonly ILogger<GetAllProductsQueryHandler> _logger;

    public GetAllProductsQueryHandler(ILogger<GetAllProductsQueryHandler> logger)
    {
        _logger = logger;
    }

    public Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("處理 GetAllProductsQuery");
        
        // 模擬從資料庫取得資料
        var products = new List<ProductDto>
        {
            new() { Id = 1, Name = "產品 1", Description = "描述 1", Price = 10.99m },
            new() { Id = 2, Name = "產品 2", Description = "描述 2", Price = 20.99m },
            new() { Id = 3, Name = "產品 3", Description = "描述 3", Price = 30.99m }
        };

        return Task.FromResult(products);
    }
}
