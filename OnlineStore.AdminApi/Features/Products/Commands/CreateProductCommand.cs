using MediatR;

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

    public CreateProductCommand(
        string name,
        string description,
        string category,
        int price,
        int stock,
        bool featured,
        string image,
        DateTime createdAt,
        DateTime? updatedAt = null)
    {
        Name = name ?? string.Empty;
        Description = description ?? string.Empty;
        Category = category ?? string.Empty;
        Price = price;
        Stock = stock;
        Featured = featured;
        Image = image ?? string.Empty;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }
}
