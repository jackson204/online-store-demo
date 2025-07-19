using MediatR;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 刪除商品的 Command。
/// </summary>
public sealed record DeleteProductCommand(int Id) : IRequest<DeleteProductResult>;