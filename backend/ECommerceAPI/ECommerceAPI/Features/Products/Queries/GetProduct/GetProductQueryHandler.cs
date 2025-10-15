using ECommerceAPI.Features.Products.DTOs;
using MediatR;

namespace ECommerceAPI.Features.Products.Queries.GetProduct;

public class GetProductQueryHandler : IRequestHandler<GetProductQuery, ProductDto>
{
    private readonly ILogger<GetProductQueryHandler> _logger;

    public GetProductQueryHandler(ILogger<GetProductQueryHandler> logger)
    {
        _logger = logger;
    }

    public Task<ProductDto> Handle(GetProductQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("處理 GetProductQuery,產品 ID: {ProductId}", request.Id);
        
        // 模擬從資料庫取得資料
        var product = new ProductDto
        {
            Id = request.Id,
            Name = $"產品 {request.Id}",
            Description = "這是一個展示產品",
            Price = 99.99m
        };

        return Task.FromResult(product);
    }
}
