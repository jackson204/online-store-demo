using ECommerceAPI.Features.Products.Commands.CreateProduct;
using ECommerceAPI.Features.Products.DTOs;
using ECommerceAPI.Features.Products.Queries.GetAllProducts;
using ECommerceAPI.Features.Products.Queries.GetProduct;
using MediatR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 情境 A: 只用 MediatR (沒有 Extensions 套件)
builder.Services.AddTransient<IMediator, Mediator>();
builder.Services.AddTransient<ServiceFactory>(sp => type => sp.GetService(type));

// 必須手動註冊每一個 Handler
builder.Services.AddTransient<IRequestHandler<GetProductQuery, ProductDto>, GetProductQueryHandler>();
builder.Services.AddTransient<IRequestHandler<GetAllProductsQuery, List<ProductDto>>, GetAllProductsQueryHandler>();
builder.Services.AddTransient<IRequestHandler<CreateProductCommand, int>, CreateProductCommandHandler>();


var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
