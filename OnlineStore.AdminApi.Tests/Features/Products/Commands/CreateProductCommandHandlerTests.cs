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
    public async Task Handle_ShouldCreateProduct_WhenInputIsValid()
    {
        var vm = CreateViewModel(_ => { });
        var command = new CreateProductCommand(
            vm.Name,
            vm.Description,
            vm.Category,
            vm.Price,
            vm.Stock,
            vm.Featured,
            vm.Image,
            vm.CreatedAt,
            vm.UpdatedAt
        );
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Products.Should().NotBeNull();
        result.Products.Should().ContainSingle(p =>
            p.Name == "Test Product" &&
            p.Description == "This is a test product." &&
            p.Category == "TestCategory" &&
            p.Price == 99 &&
            p.Stock == 10 &&
            p.Featured &&
            p.Image == "test.jpg"
        );
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenNameIsEmpty()
    {
        var vm = CreateViewModel(dto => dto.Name = string.Empty);
        var command = new CreateProductCommand(
            vm.Name,
            vm.Description,
            vm.Category,
            vm.Price,
            vm.Stock,
            vm.Featured,
            vm.Image,
            vm.CreatedAt,
            vm.UpdatedAt
        );
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Products.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenPriceIsNegative()
    {
        var vm = CreateViewModel(dto => {
            dto.Name = "Negative Price";
            dto.Price = -1;
            dto.Description = "Price is negative";
        });
        var command = new CreateProductCommand(
            vm.Name,
            vm.Description,
            vm.Category,
            vm.Price,
            vm.Stock,
            vm.Featured,
            vm.Image,
            vm.CreatedAt,
            vm.UpdatedAt
        );
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Products.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenStockIsNegative()
    {
        var vm = CreateViewModel(dto => {
            dto.Name = "Negative Stock";
            dto.Stock = -10;
            dto.Description = "Stock is negative";
        });
        var command = new CreateProductCommand(
            vm.Name,
            vm.Description,
            vm.Category,
            vm.Price,
            vm.Stock,
            vm.Featured,
            vm.Image,
            vm.CreatedAt,
            vm.UpdatedAt
        );
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Products.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task Handle_ShouldCreateProduct_WithExtremeValues()
    {
        var vm = CreateViewModel(dto => {
            dto.Name = "MaxPrice";
            dto.Description = "Max price test";
            dto.Price = int.MaxValue;
            dto.Stock = int.MaxValue;
            dto.Featured = false;
            dto.Image = "img.jpg";
        });
        var command = new CreateProductCommand(
            vm.Name,
            vm.Description,
            vm.Category,
            vm.Price,
            vm.Stock,
            vm.Featured,
            vm.Image,
            vm.CreatedAt,
            vm.UpdatedAt
        );
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Products.Should().ContainSingle(p => p.Price == int.MaxValue && p.Stock == int.MaxValue);
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenContextIsNull()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
        {
            var handler = new CreateProductCommandHandler(null!);
            var vm = CreateViewModel(dto => {
                dto.Name = "Test";
                dto.Description = "Test";
                dto.Category = "Test";
                dto.Price = 1;
                dto.Stock = 1;
                dto.Featured = false;
                dto.Image = "img.jpg";
            });
            var command = new CreateProductCommand(
                vm.Name,
                vm.Description,
                vm.Category,
                vm.Price,
                vm.Stock,
                vm.Featured,
                vm.Image,
                vm.CreatedAt,
                vm.UpdatedAt
            );
            await handler.Handle(command, CancellationToken.None);
        });
    }

    [Fact]
    public async Task Handle_ShouldCreateProduct_WhenDuplicateNameAllowed()
    {
        var dto1 = CreateViewModel(dto => {
            dto.Name = "Duplicate";
            dto.Description = "First";
            dto.Category = "TestCategory";
            dto.Price = 10;
            dto.Stock = 1;
            dto.Featured = false;
            dto.Image = "img1.jpg";
        });
        await _target.Handle(new CreateProductCommand(
            dto1.Name,
            dto1.Description,
            dto1.Category,
            dto1.Price,
            dto1.Stock,
            dto1.Featured,
            dto1.Image,
            dto1.CreatedAt,
            dto1.UpdatedAt
        ), CancellationToken.None);
        var dto2 = CreateViewModel(dto => {
            dto.Name = "Duplicate";
            dto.Description = "Second";
            dto.Category = "TestCategory";
            dto.Price = 20;
            dto.Stock = 2;
            dto.Featured = true;
            dto.Image = "img2.jpg";
        });
        var result = await _target.Handle(new CreateProductCommand(
            dto2.Name,
            dto2.Description,
            dto2.Category,
            dto2.Price,
            dto2.Stock,
            dto2.Featured,
            dto2.Image,
            dto2.CreatedAt,
            dto2.UpdatedAt
        ), CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Products.Should().Contain(p => p.Name == "Duplicate" && p.Description == "Second");
    }

    private static ProductViewModel CreateViewModel(Action<ProductViewModel> action)
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
        return model;
    }

    public void Dispose()
    {
        _db.Dispose();
    }
}
