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
        new ProductDto { Id = 1, Name = "藍牙耳機", Category = "電子產品", Price = 4990, Stock = 8, Featured = false },
        new ProductDto { Id = 2, Name = "運動休閒鞋", Category = "鞋類", Price = 2490, Stock = 25, Featured = true },
        new ProductDto { Id = 3, Name = "皮革錢包", Category = "配件", Price = 890, Stock = 35, Featured = false },
        new ProductDto { Id = 4, Name = "經典白色T恤", Category = "服飾", Price = 590, Stock = 50, Featured = true },
        new ProductDto { Id = 5, Name = "修身牛仔褲", Category = "服飾", Price = 1290, Stock = 30, Featured = false },
        new ProductDto { Id = 6, Name = "時尚手錶", Category = "配件", Price = 3580, Stock = 15, Featured = true }
    };

    /// <summary>
    /// 取得所有商品清單
    /// </summary>
    /// <returns>商品資料集合</returns>
    [HttpGet]
    public ActionResult<IEnumerable<ProductDto>> GetProducts()
    {
        // 回傳靜態商品資料
        return Ok(products);
    }
}