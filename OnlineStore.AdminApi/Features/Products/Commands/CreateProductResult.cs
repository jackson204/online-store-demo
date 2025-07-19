using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 建立商品結果。
/// </summary>
public sealed class CreateProductResult
{
    /// <summary>
    /// 是否成功。
    /// </summary>
    public bool Success { get; init; }
    /// <summary>
    /// 錯誤訊息（失敗時）。
    /// </summary>
    public string? ErrorMessage { get; init; }
    /// <summary>
    /// 商品清單（成功時）。
    /// </summary>
    public IEnumerable<ProductDto>? Products { get; init; }
}
