using MediatR;

namespace OnlineStore.AdminApi.Features.Products;

/// <summary>
/// 切換商品精選狀態的 Command。
/// </summary>
public sealed record ToggleFeaturedCommand(int Id) : IRequest<ToggleFeaturedResult>;