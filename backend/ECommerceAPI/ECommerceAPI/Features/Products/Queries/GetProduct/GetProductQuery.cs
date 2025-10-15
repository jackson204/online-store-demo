using ECommerceAPI.Features.Products.DTOs;
using MediatR;

namespace ECommerceAPI.Features.Products.Queries.GetProduct;

public class GetProductQuery : IRequest<ProductDto>
{
    public int Id { get; set; }
}