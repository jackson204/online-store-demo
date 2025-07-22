using MediatR;

namespace OnlineStore.AdminApi.Features.Products.Commands;

/// <summary>
/// 更新商品的 Command。
/// </summary>
public sealed class UpdateProductCommand : IRequest<UpdateProductResult>
{
    public int Id { get; }
    public string Name { get; }
    public string? Description { get; }
    public string? Category { get; }
    public decimal Price { get; }
    public int Stock { get; }
    public bool Featured { get; }
    public string? Image { get; }
    public DateTime? CreatedAt { get; }
    public DateTime? UpdatedAt { get; }

    public UpdateProductCommand(
        int id,
        string name,
        string? description,
        string? category,
        decimal price,
        int stock,
        bool featured,
        string? image,
        DateTime? createdAt = null,
        DateTime? updatedAt = null)
    {
        Id = id;
        Name = name;
        Description = description;
        Category = category;
        Price = price;
        Stock = stock;
        Featured = featured;
        Image = image;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }
}
