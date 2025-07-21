using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Features.Products.Commands;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Tests.Features.Products.Commands;

public class CreateProductCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldCreateProduct_WhenInputIsValid()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var context = new ApplicationDbContext(options);
        var target = new CreateProductCommandHandler(context);

        var createProductCommand = new CreateProductCommand(
            new ProductDto
            {
                Name = "Test Product",
                Description = "This is a test product.",
                Category = "TestCategory",
                Price = 99,
                Stock = 10,
                Featured = true,
                Image = "test.jpg",
                CreatedAt = DateTime.UtcNow
            }
        );
        var result = await target.Handle(createProductCommand, CancellationToken.None);
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Products.Should().NotBeNull();
        result.Products.Should().ContainSingle(p =>
            p.Name == "Test Product" &&
            p.Description == "This is a test product." &&
            p.Category == "TestCategory" &&
            p.Price == 99 &&
            p.Stock == 10 &&
            p.Featured == true &&
            p.Image == "test.jpg"
        );
    }
}
