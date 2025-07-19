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

    /// <summary>
    /// 是否為精選商品
    /// </summary>
    public bool IsFeatured
    {
        get => Featured;
        set => Featured = value;
    }

    //TODO: 以下屬性可根據實際需求決定是否需要
    /// <summary>商品評分</summary>
    // public double Rating { get; set; }
    
    //TODO: 以下屬性可根據實際需求決定是否需要
    /// <summary>評論數</summary>
    // public int Reviews { get; set; }

    /// <summary>建立日期</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>更新日期（可選）</summary>
    public DateTime? UpdatedAt { get; set; }
}
