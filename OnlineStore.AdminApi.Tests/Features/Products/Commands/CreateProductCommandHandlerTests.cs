using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Features.Products.Commands;
using OnlineStore.AdminApi.ViewModels;

namespace OnlineStore.AdminApi.Tests.Features.Products.Commands;

public class CreateProductCommandHandlerTests : IDisposable
{
    private readonly ApplicationDbContext _db;
    private readonly CreateProductCommandHandler _target;

    public CreateProductCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new ApplicationDbContext(options);
        _target = new CreateProductCommandHandler(_db);
    }

    [Fact]
    public async Task Handle_ValidInput_ShouldCreateProductAndReturnSuccess()
    {
        var result = await WhenHandle(_ =>
        {
        });
        result.Should().BeEquivalentTo(new 
        {
            Success = true,
            Products = new []
            {
                new
                {
                    Name = "Test Product",
                    Description = "This is a test product.",
                    Category = "TestCategory",
                    Price = 99,
                    Stock = 10,
                    Featured = true,
                    Image = "test.jpg",
              
                }
            }

        });
    }

    [Fact]
    public async Task Handle_EmptyName_ShouldFail()
    {
        var result = await WhenHandle(x => x.Name = "");
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.ErrorMessage.Should().NotBeNullOrEmpty();
        (await _db.Products.CountAsync()).Should().Be(0);
    }

    [Fact]
    public async Task Handle_NegativePrice_ShouldFail()
    {
        var result = await WhenHandle(x => x.Price = -100);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.ErrorMessage.Should().NotBeNullOrEmpty();
        (await _db.Products.CountAsync()).Should().Be(0);
    }

    [Fact]
    public async Task Handle_NegativeStock_ShouldFail()
    {
        var result = await WhenHandle(x => x.Stock = -5);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.ErrorMessage.Should().NotBeNullOrEmpty();
        (await _db.Products.CountAsync()).Should().Be(0);
    }

    [Fact]
    public async Task Handle_ExtremeValues_ShouldCreateProduct()
    {
        var result = await WhenHandle(x =>
        {
            x.Price = int.MaxValue;
            x.Stock = int.MaxValue;
            x.Name = "Extreme";
        });
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        var dbProduct = await _db.Products.FirstOrDefaultAsync(p => p.Name == "Extreme");
        dbProduct.Should().NotBeNull();
        dbProduct!.Price.Should().Be(int.MaxValue);
        dbProduct.Stock.Should().Be(int.MaxValue);
    }

    private async Task<CreateProductResult> WhenHandle(Action<ProductViewModel> action)
    {
        var model = new ProductViewModel
        {
            Name = "Test Product",
            Description = "This is a test product.",
            Category = "TestCategory",
            Price = 99,
            Stock = 10,
            Featured = true,
            Image = "test.jpg",
            CreatedAt = DateTime.UtcNow
        };
        action(model);
        return await _target.Handle(new CreateProductCommand(model), CancellationToken.None);
    }

    public void Dispose()
    {
        _db.Dispose();
    }
}
