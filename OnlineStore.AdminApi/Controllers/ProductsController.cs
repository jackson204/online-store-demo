using MediatR;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.AdminApi.Models;
using OnlineStore.AdminApi.Data;
using Microsoft.EntityFrameworkCore;
using OnlineStore.AdminApi.Features.Products;

namespace OnlineStore.AdminApi.Controllers;

/// <summary>
/// 商品管理 API 控制器
/// </summary>
[ApiController]
[Route("api/admin/products")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMediator _mediator;
    public ProductsController(ApplicationDbContext db, IMediator mediator)
    {
        _db = db;
        _mediator = mediator;
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
        var dtos = await _mediator.Send(new GetProductsQuery());
        return Ok(dtos);
    }

    /// <summary>
    /// 新增商品，並回傳所有商品清單
    /// </summary>
    /// <param name="dto">商品資料</param>
    /// <returns>所有商品資料集合</returns>
    /// <response code="200">成功建立商品並取得商品清單</response>
    /// <response code="400">資料驗證失敗</response>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> CreateProduct([FromBody] ProductDto dto)
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

    /// <summary>
    /// 更新商品資料
    /// </summary>
    /// <param name="id">商品 ID</param>
    /// <param name="dto">商品資料</param>
    /// <returns>更新後的商品資料</returns>
    /// <response code="200">成功更新商品資料</response>
    /// <response code="404">找不到指定的商品</response>
    /// <response code="400">資料驗證失敗</response>
    [HttpPut("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductDto>> PutProduct(int id, [FromBody] ProductDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest("路由 id 與資料 id 不符");
        }
        if (string.IsNullOrWhiteSpace(dto.Name) || dto.Price < 0 || dto.Stock < 0)
        {
            return BadRequest("商品名稱、價格與庫存不可為空或負值");
        }
        var product = await _db.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        // 更新欄位
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Category = dto.Category;
        product.Price = dto.Price;
        product.Stock = dto.Stock;
        product.Featured = dto.Featured;
        product.Image = dto.Image;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // 回傳更新後的 DTO
        var result = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Category = product.Category,
            Price = product.Price,
            Stock = product.Stock,
            Featured = product.Featured,
            Image = product.Image,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
        return Ok(result);
    }

    /// <summary>
    /// 刪除指定商品，並回傳所有商品清單
    /// </summary>
    /// <param name="id">商品 ID</param>
    /// <returns>所有商品資料集合</returns>
    /// <response code="200">成功刪除商品並取得商品清單</response>
    /// <response code="404">找不到指定的商品</response>
    [HttpDelete("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> DeleteProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();

        // 刪除後回傳所有商品清單
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
    /// 切換指定商品的精選狀態
    /// </summary>
    /// <param name="id">商品 ID</param>
    /// <returns>更新後的商品資料</returns>
    /// <response code="200">成功切換精選狀態</response>
    /// <response code="404">找不到指定的商品</response>
    [HttpPut("{id}/toggle-featured")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> ToggleFeatured(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null)
        {
            return NotFound();
        }

        product.Featured = !product.Featured;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var dto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Category = product.Category,
            Price = product.Price,
            Stock = product.Stock,
            Featured = product.Featured,
            Image = product.Image,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
        return Ok(dto);
    }
}
