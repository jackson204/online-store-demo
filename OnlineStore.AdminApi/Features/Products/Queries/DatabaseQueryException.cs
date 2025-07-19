namespace OnlineStore.AdminApi.Features.Products.Queries;

/// <summary>
/// 代表資料庫查詢異常的自訂例外。
/// </summary>
public class DatabaseQueryException : Exception
{
    public DatabaseQueryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
