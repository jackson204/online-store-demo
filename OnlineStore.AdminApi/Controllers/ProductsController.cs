using MediatR;
using Microsoft.AspNetCore.Mvc;
using OnlineStore.AdminApi.ViewModels;
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
    [ProducesResponseType(typeof(IEnumerable<ProductViewModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductViewModel>>> GetProducts()
    {
        var viewModels = await _mediator.Send(new GetProductsQuery());
        return Ok(viewModels);
    }

    /// <summary>
    /// 新增商品，並回傳所有商品清單
    /// </summary>
    /// <param name="viewModel">商品資料</param>
    /// <returns>所有商品資料集合</returns>
    /// <response code="200">成功建立商品並取得商品清單</response>
    /// <response code="400">資料驗證失敗</response>
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(typeof(IEnumerable<ProductViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<ProductViewModel>>> CreateProduct([FromBody] ProductViewModel viewModel)
    {
        var command = new CreateProductCommand(
            viewModel.Name,
            viewModel.Description,
            viewModel.Category,
            viewModel.Price,
            viewModel.Stock,
            viewModel.Featured,
            viewModel.Image,
            viewModel.CreatedAt,
            viewModel.UpdatedAt
        );
        var result = await _mediator.Send(command);
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
    /// <param name="viewModel">商品資料</param>
    /// <returns>更新後的商品資料</returns>
    /// <response code="200">成功更新商品資料</response>
    /// <response code="404">找不到指定的商品</response>
    /// <response code="400">資料驗證失敗</response>
    [HttpPut("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ProductViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductViewModel>> PutProduct(int id, [FromBody] ProductViewModel viewModel)
    {
        var result = await _mediator.Send(new UpdateProductCommand(
            id,
            viewModel.Name,
            viewModel.Description,
            viewModel.Category,
            viewModel.Price,
            viewModel.Stock,
            viewModel.Featured,
            viewModel.Image,
            viewModel.CreatedAt,
            viewModel.UpdatedAt
        ));
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
    [ProducesResponseType(typeof(IEnumerable<ProductViewModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<ProductViewModel>>> DeleteProduct(int id)
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
    [ProducesResponseType(typeof(ProductViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductViewModel>> ToggleFeatured(int id)
    {
        var result = await _mediator.Send(new ToggleFeaturedCommand(id));
        if (!result.Success)
        {
            return NotFound();
        }
        return Ok(result.Product);
    }
}
