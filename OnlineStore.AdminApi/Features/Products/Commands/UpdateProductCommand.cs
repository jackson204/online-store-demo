using MediatR;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 更新商品的 Command。
/// </summary>
public sealed record UpdateProductCommand(int Id, ProductDto Product) : IRequest<UpdateProductResult>;
