using MediatR;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 刪除商品的 Command。
/// </summary>
public sealed class DeleteProductCommand : IRequest<DeleteProductResult>
{
    public int Id { get; }
    public DeleteProductCommand(int id)
    {
        Id = id;
    }
}