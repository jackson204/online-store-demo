using MediatR;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 建立商品的 Command。
/// </summary>
public sealed record CreateProductCommand(ProductDto Product) : IRequest<CreateProductResult>;