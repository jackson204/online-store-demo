using OnlineStore.AdminApi.Data;
using Microsoft.EntityFrameworkCore;
using MediatR;
using OnlineStore.AdminApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// 註冊 MediatR，讓系統自動找到所有 Handler
builder.Services.AddMediatR(typeof(Program));


// 註冊 CORS 服務
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins(
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 註冊全域例外處理中介層（要放在最前面，越早越好）
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 啟用 CORS
app.UseCors("AllowFrontend");

// app.UseHttpsRedirection(); // 開發階段暫時註解，避免 307 轉址導致 CORS 問題

app.UseAuthorization();

app.MapControllers();

app.Run();
