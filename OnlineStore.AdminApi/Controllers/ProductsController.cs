using Microsoft.AspNetCore.Mvc;
using OnlineStore.AdminApi.Models;
using OnlineStore.AdminApi.Data;
using Microsoft.EntityFrameworkCore;

namespace OnlineStore.AdminApi.Controllers;

/// <summary>
/// 商品管理 API 控制器
/// </summary>
[ApiController]
[Route("api/admin/products")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ProductsController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// 取得所有商品清單
    /// </summary>
    /// <returns>商品資料集合</returns>
    /// <response code="200">成功取得商品清單</response>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _db.Products.AsNoTracking().ToListAsync();
        var dtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Category = p.Category,
            Price = p.Price,
            Stock = p.Stock,
            Featured = p.Featured,
            Image = p.Image,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        }).ToList();
        return Ok(dtos);
    }

    /// <summary>
    /// 新增商品
    /// </summary>
    /// <param name="dto">商品資料</param>
    /// <returns>建立成功的商品資料</returns>
    /// <response code="201">成功建立商品</response>
    /// <response code="400">資料驗證失敗</response>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] ProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || dto.Price < 0 || dto.Stock < 0)
        {
            return BadRequest("商品名稱、價格與庫存不可為空或負值");
        }
        var now = DateTime.UtcNow;
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            Price = dto.Price,
            Stock = dto.Stock,
            Featured = dto.Featured,
            Image = dto.Image,
            CreatedAt = now,
            UpdatedAt = null
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        // 取得所有商品清單
        var products = await _db.Products.AsNoTracking().ToListAsync();
        var dtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Category = p.Category,
            Price = p.Price,
            Stock = p.Stock,
            Featured = p.Featured,
            Image = p.Image,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        }).ToList();

        return Ok(dtos);
    }
}
