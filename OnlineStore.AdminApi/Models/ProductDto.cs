namespace OnlineStore.AdminApi.Models;

/// <summary>
/// 商品資料 DTO
/// </summary>
public class ProductDto
{
    /// <summary>商品編號</summary>
    public int Id { get; set; }
    /// <summary>商品名稱</summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>商品分類</summary>
    public string Category { get; set; } = string.Empty;
    /// <summary>價格（單位：新台幣）</summary>
    public int Price { get; set; }
    /// <summary>庫存數量</summary>
    public int Stock { get; set; }
    /// <summary>是否為精選商品</summary>
    public bool Featured { get; set; }
}