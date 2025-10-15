using MediatR;

namespace ECommerceAPI.Features.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
{
    private readonly ILogger<CreateProductCommandHandler> _logger;

    public CreateProductCommandHandler(ILogger<CreateProductCommandHandler> logger)
    {
        _logger = logger;
    }

    public Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("建立新產品: {ProductName}", request.Name);
        
        // 模擬儲存到資料庫並回傳新的 ID
        var newProductId = Random.Shared.Next(100, 999);
        
        return Task.FromResult(newProductId);
    }
}