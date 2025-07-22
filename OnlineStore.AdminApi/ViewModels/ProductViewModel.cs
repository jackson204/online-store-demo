namespace OnlineStore.AdminApi.ViewModels;

/// <summary>
/// 商品資料 ViewModel
/// </summary>
public class ProductViewModel
{
    /// <summary>商品編號</summary>
    public int Id { get; set; }

    /// <summary>商品名稱</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>商品描述</summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>商品分類</summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>價格（單位：新台幣）</summary>
    public int Price { get; set; }

    /// <summary>庫存數量</summary>
    public int Stock { get; set; }

    /// <summary>是否為精選商品</summary>
    public bool Featured { get; set; }

    /// <summary>商品圖片網址</summary>
    public string Image { get; set; } = string.Empty;

    /// <summary>建立日期</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>更新日期（可選）</summary>
    public DateTime? UpdatedAt { get; set; }
}
