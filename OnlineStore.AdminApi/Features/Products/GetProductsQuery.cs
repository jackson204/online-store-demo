using MediatR;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products;

public record GetProductsQuery() : IRequest<IEnumerable<ProductDto>>;
