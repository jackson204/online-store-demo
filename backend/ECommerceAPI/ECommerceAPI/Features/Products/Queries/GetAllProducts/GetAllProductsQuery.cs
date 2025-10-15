using ECommerceAPI.Features.Products.DTOs;
using MediatR;

namespace ECommerceAPI.Features.Products.Queries.GetAllProducts;

public class GetAllProductsQuery : IRequest<List<ProductDto>>
{
}