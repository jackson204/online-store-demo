using MediatR;
using OnlineStore.AdminApi.ViewModels;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 建立商品的 Command。
/// </summary>
public sealed class CreateProductCommand : IRequest<CreateProductResult>
{
    public string Name { get; }
    public string Description { get; }
    public string Category { get; }
    public int Price { get; }
    public int Stock { get; }
    public bool Featured { get; }
    public string Image { get; }
    public DateTime CreatedAt { get; }
    public DateTime? UpdatedAt { get; }
 
    public CreateProductCommand(ProductViewModel viewModel)
    {
        Name = viewModel.Name;
        Description = viewModel.Description;
        Category = viewModel.Category;
        Price = viewModel.Price;
        Stock = viewModel.Stock;
        Featured = viewModel.Featured;
        Image = viewModel.Image;
        CreatedAt = viewModel.CreatedAt;
        UpdatedAt = viewModel.UpdatedAt;
    }
}
