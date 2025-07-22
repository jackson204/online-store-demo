using MediatR;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 切換商品精選狀態的 Command。
/// </summary>
public sealed class ToggleFeaturedCommand : IRequest<ToggleFeaturedResult>
{
    public int Id { get; }
    public ToggleFeaturedCommand(int id)
    {
        Id = id;
    }
}