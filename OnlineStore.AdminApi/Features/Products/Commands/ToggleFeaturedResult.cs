namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 切換精選狀態結果。
/// </summary>
public sealed class ToggleFeaturedResult
{
    public bool Success { get; init; }
    public Models.ProductViewModel? Product { get; init; }
}
