using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 更新商品結果。
/// </summary>
public sealed class UpdateProductResult
{
    public bool Success { get; init; }
    public bool NotFound { get; init; }
    public string? ErrorMessage { get; init; }
    public ProductDto? Product { get; init; }
}
