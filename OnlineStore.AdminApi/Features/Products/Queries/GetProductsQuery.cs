using MediatR;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Features.Products.Queries;

public record GetProductsQuery() : IRequest<IEnumerable<ProductDto>>;
