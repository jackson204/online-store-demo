using MediatR;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.AdminApi.Models;
using OnlineStore.AdminApi.Features.Products.Commands;
using OnlineStore.AdminApi.Features.Products.Queries;

namespace OnlineStore.AdminApi.Controllers;

/// <summary>
/// 商品管理 API 控制器
/// </summary>
[ApiController]
[Route("api/admin/products")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// 建構子，注入 MediatR
    /// </summary>
    /// <param name="mediator">MediatR 實例</param>
    public ProductsController(IMediator mediator)
    {
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
        var result = await _mediator.Send(new CreateProductCommand(dto));
        if (!result.Success)
        {
            return BadRequest(result.ErrorMessage);
        }
        return Ok(result.Products);
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
        var result = await _mediator.Send(new UpdateProductCommand(id, dto));
        if (!result.Success)
        {
            if (result.NotFound)
                return NotFound();
            return BadRequest(result.ErrorMessage);
        }
        return Ok(result.Product);
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
        var result = await _mediator.Send(new DeleteProductCommand(id));
        if (!result.Success)
        {
            return NotFound();
        }
        return Ok(result.Products);
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
        var result = await _mediator.Send(new ToggleFeaturedCommand(id));
        if (!result.Success)
        {
            return NotFound();
        }
        return Ok(result.Product);
    }
}
