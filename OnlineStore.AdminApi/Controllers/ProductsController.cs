using Microsoft.AspNetCore.Mvc;
using OnlineStore.AdminApi.Models;

namespace OnlineStore.AdminApi.Controllers;

/// <summary>
/// 商品管理 API 控制器
/// </summary>
[ApiController]
[Route("api/admin/products")]
public class ProductsController : ControllerBase
{
    // TODO: 後續可改為資料庫存取，這裡先用靜態資料模擬
    private static readonly List<ProductDto> products = new()
    {
        new ProductDto { Id = 1, Name = "藍牙耳機", Description = "高音質無線藍牙耳機，支援降噪功能。", Category = "電子產品", Price = 4990, Stock = 8, Featured = false, Image = "https://example.com/images/earbuds.jpg", CreatedAt = new DateTime(2024, 1, 10), UpdatedAt = new DateTime(2025, 6, 1) },
        new ProductDto { Id = 2, Name = "運動休閒鞋", Description = "舒適透氣運動鞋，適合日常與運動穿著。", Category = "鞋類", Price = 2490, Stock = 25, Featured = true, Image = "https://example.com/images/shoes.jpg", CreatedAt = new DateTime(2024, 2, 5), UpdatedAt = new DateTime(2025, 5, 20) },
        new ProductDto { Id = 3, Name = "皮革錢包", Description = "真皮製作，經典設計，耐用實用。", Category = "配件", Price = 890, Stock = 35, Featured = false, Image = "https://example.com/images/wallet.jpg", CreatedAt = new DateTime(2024, 3, 15), UpdatedAt = new DateTime(2025, 4, 18) },
        new ProductDto { Id = 4, Name = "經典白色T恤", Description = "百搭純棉T恤，舒適透氣。", Category = "服飾", Price = 590, Stock = 50, Featured = true, Image = "https://example.com/images/tshirt.jpg", CreatedAt = new DateTime(2024, 4, 1), UpdatedAt = new DateTime(2025, 6, 10) },
        new ProductDto { Id = 5, Name = "修身牛仔褲", Description = "修身剪裁，經典藍色牛仔褲。", Category = "服飾", Price = 1290, Stock = 30, Featured = false, Image = "https://example.com/images/jeans.jpg", CreatedAt = new DateTime(2024, 5, 12), UpdatedAt = new DateTime(2025, 5, 30) },
        new ProductDto { Id = 6, Name = "時尚手錶", Description = "簡約時尚設計，防水功能。", Category = "配件", Price = 3580, Stock = 15, Featured = true, Image = "https://example.com/images/watch.jpg",  CreatedAt = new DateTime(2024, 6, 8), UpdatedAt = new DateTime(2025, 6, 15) }
    };

    /// <summary>
    /// 取得所有商品清單
    /// </summary>
    /// <returns>商品資料集合</returns>
    /// <response code="200">成功取得商品清單</response>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<ProductDto>> GetProducts()
    {
        // 回傳靜態商品資料
        return Ok(products);
    }
}
