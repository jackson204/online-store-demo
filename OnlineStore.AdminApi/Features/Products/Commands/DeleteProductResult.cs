using OnlineStore.AdminApi.ViewModels;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 刪除商品結果。
/// </summary>
public sealed class DeleteProductResult
{
    public IEnumerable<ProductViewModel>? Products { get; init; }
    public bool Success { get; init; }
}
