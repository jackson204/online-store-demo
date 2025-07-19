using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Features.Products.Queries;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Tests.Features.Products.Queries;

public class GetProductsQueryHandlerTests
{
    private readonly ApplicationDbContext _context;
    private readonly GetProductsQueryHandler _target;

    public GetProductsQueryHandlerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new ApplicationDbContext(options);
        _target = new GetProductsQueryHandler(_context);
    }

    [Fact]
    public async Task Handle_ReturnsAllProducts_WhenProductsExist()
    {
        // Arrange
        await GivenProductsExist();

        // Act
        var result = await WhenQueryingProducts();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.Select(x => x.Name).Should().Contain(["A", "B"]);
    }

    [Fact]
    public async Task Handle_ReturnsEmptyList_WhenNoProductsExist()
    {
        // Act
        var result = await WhenQueryingProducts();

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_ReturnsProducts_WithSpecialCharacters()
    {
        // Arrange
        await GivenProductsWithSpecialCharactersExist();

        // Act
        var result = await WhenQueryingProducts();

        // Assert
        result.Should().Contain(x => x.Name == "🦄 彩虹獨角獸" && x.Description.Contains("emoji"));
        result.Should().Contain(x => x.Name == "測試#商品!@%" && x.Description.Contains("特殊符號"));
    }

    private Task<IEnumerable<ProductDto>> WhenQueryingProducts()
    {
        return _target.Handle(new GetProductsQuery(), CancellationToken.None);
    }

    private async Task GivenProductsExist()
    {
        _context.Products.AddRange(
            new Product
            {
                Id = 1, Name = "A", Description = "DescA", Category = "Cat1", Price = 100, Stock = 10, Featured = true, Image = "img1",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = 2, Name = "B", Description = "DescB", Category = "Cat2", Price = 200, Stock = 20, Featured = false, Image = "img2",
                CreatedAt = DateTime.UtcNow
            }
        );
        await _context.SaveChangesAsync();
    }

    private async Task GivenProductsWithSpecialCharactersExist()
    {
        _context.Products.AddRange(
            new Product
            {
                Id = 101, Name = "🦄 彩虹獨角獸", Description = "描述含 emoji 😃", Category = "特別", Price = 999, Stock = 1, Featured = true, Image = "img-emoji",
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = 102, Name = "測試#商品!@%", Description = "特殊符號!@#$%^&*()_+", Category = "符號", Price = 123, Stock = 2, Featured = false, Image = "img-symbol",
                CreatedAt = DateTime.UtcNow
            }
        );
        await _context.SaveChangesAsync();
    }
}
