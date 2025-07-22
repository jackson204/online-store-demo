using MediatR;
using OnlineStore.AdminApi.ViewModels;

namespace OnlineStore.AdminApi.Features.Products.Queries;

public class GetProductsQuery : IRequest<IEnumerable<ProductViewModel>>
{
}
