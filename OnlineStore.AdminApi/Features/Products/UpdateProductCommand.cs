using MediatR;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products;

/// <summary>
/// 更新商品的 Command。
/// </summary>
public sealed record UpdateProductCommand(int Id, ProductDto Product) : IRequest<UpdateProductResult>;

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
