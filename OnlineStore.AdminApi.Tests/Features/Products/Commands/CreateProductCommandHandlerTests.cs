using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Features.Products.Commands;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Tests.Features.Products.Commands;

public class CreateProductCommandHandlerTests : IDisposable
{
    private readonly ApplicationDbContext _db;
    private readonly CreateProductCommandHandler _target;

    public CreateProductCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase($"TestDb_{Guid.NewGuid()}")
            .Options;
        _db = new ApplicationDbContext(options);
        _target = new CreateProductCommandHandler(_db);
    }

    [Fact]
    public async Task Handle_ShouldCreateProduct_WhenInputIsValid()
    {
        var command = new CreateProductCommand(CreateDto(_ => { }));
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
        var command = new CreateProductCommand(CreateDto(dto => dto.Name = string.Empty));
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Products.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenPriceIsNegative()
    {
        var command = new CreateProductCommand(CreateDto(dto => {
            dto.Name = "Negative Price";
            dto.Price = -1;
            dto.Description = "Price is negative";
        }));
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Products.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task Handle_ShouldFail_WhenStockIsNegative()
    {
        var command = new CreateProductCommand(CreateDto(dto => {
            dto.Name = "Negative Stock";
            dto.Stock = -10;
            dto.Description = "Stock is negative";
        }));
        var result = await _target.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Products.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task Handle_ShouldCreateProduct_WithExtremeValues()
    {
        var command = new CreateProductCommand(CreateDto(dto => {
            dto.Name = "MaxPrice";
            dto.Description = "Max price test";
            dto.Price = int.MaxValue;
            dto.Stock = int.MaxValue;
            dto.Featured = false;
            dto.Image = "img.jpg";
        }));
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
            var command = new CreateProductCommand(CreateDto(dto => {
                dto.Name = "Test";
                dto.Description = "Test";
                dto.Category = "Test";
                dto.Price = 1;
                dto.Stock = 1;
                dto.Featured = false;
                dto.Image = "img.jpg";
            }));
            await handler.Handle(command, CancellationToken.None);
        });
    }

    [Fact]
    public async Task Handle_ShouldCreateProduct_WhenDuplicateNameAllowed()
    {
        var dto1 = CreateDto(dto => {
            dto.Name = "Duplicate";
            dto.Description = "First";
            dto.Category = "TestCategory";
            dto.Price = 10;
            dto.Stock = 1;
            dto.Featured = false;
            dto.Image = "img1.jpg";
        });
        await _target.Handle(new CreateProductCommand(dto1), CancellationToken.None);
        var dto2 = CreateDto(dto => {
            dto.Name = "Duplicate";
            dto.Description = "Second";
            dto.Category = "TestCategory";
            dto.Price = 20;
            dto.Stock = 2;
            dto.Featured = true;
            dto.Image = "img2.jpg";
        });
        var result = await _target.Handle(new CreateProductCommand(dto2), CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Products.Should().Contain(p => p.Name == "Duplicate" && p.Description == "Second");
    }

    private static ProductDto CreateDto(Action<ProductDto> action)
    {
        var dto = new ProductDto
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
        action(dto);
        return dto;
    }

    public void Dispose()
    {
        _db.Dispose();
    }
}
