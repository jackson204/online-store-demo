namespace OnlineStore.AdminApi.Features.Products;

/// <summary>
/// 刪除商品結果。
/// </summary>
public sealed class DeleteProductResult
{
    public bool Success { get; init; }
    public IEnumerable<Models.ProductDto>? Products { get; init; }
}
