using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Data;
using OnlineStore.AdminApi.Features.Products.Queries;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Tests.Features.Products.Queries
{
    public class GetProductsQueryHandlerTests
    {
        private DbContextOptions<ApplicationDbContext> CreateInMemoryOptions()
        {
            return new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
        }

        [Fact]
        public async Task Handle_ReturnsAllProducts_WhenProductsExist()
        {
            // Arrange
            var options = CreateInMemoryOptions();
            await using (var context = new ApplicationDbContext(options))
            {
                context.Products.AddRange(new List<Product>
                {
                    new() { Id = 1, Name = "A", Description = "DescA", Category = "Cat1", Price = 100, Stock = 10, Featured = true, Image = "img1", CreatedAt = DateTime.UtcNow },
                    new() { Id = 2, Name = "B", Description = "DescB", Category = "Cat2", Price = 200, Stock = 20, Featured = false, Image = "img2", CreatedAt = DateTime.UtcNow }
                });
                await context.SaveChangesAsync();
            }

            await using (var context = new ApplicationDbContext(options))
            {
                var target = new GetProductsQueryHandler(context);
                var query = new GetProductsQuery();

                // Act
                var result = await target.Handle(query, CancellationToken.None);

                // Assert
                result.Should().NotBeNull();
                result.Should().HaveCount(2);
                result.Select(x => x.Name).Should().Contain(["A", "B"]);
            }
        }

        [Fact]
        public async Task Handle_ReturnsEmptyList_WhenNoProductsExist()
        {
            // Arrange
            var options = CreateInMemoryOptions();
            await using (var context = new ApplicationDbContext(options))
            {
                // 不新增任何產品
                await context.SaveChangesAsync();
            }

            await using (var context = new ApplicationDbContext(options))
            {
                var target = new GetProductsQueryHandler(context);
                var query = new GetProductsQuery();

                // Act
                var result = await target.Handle(query, CancellationToken.None);

                // Assert
                result.Should().NotBeNull();
                result.Should().BeEmpty();
            }
        }
    }
}
