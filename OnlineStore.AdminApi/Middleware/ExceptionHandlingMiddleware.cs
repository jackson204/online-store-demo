using System.Net;
using System.Text.Json;
using OnlineStore.AdminApi.Features.Products.Queries;

namespace OnlineStore.AdminApi.Middleware;

/// <summary>
/// 全域例外處理中介層，統一攔截未處理例外並回傳標準化錯誤格式。
/// </summary>
public class ExceptionHandlingMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (DatabaseQueryException ex)
        {
            await HandleExceptionAsync(context, ex, HttpStatusCode.InternalServerError, "資料庫查詢異常");
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex, HttpStatusCode.InternalServerError, "伺服器內部錯誤");
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception ex, HttpStatusCode statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;
        var error = new
        {
            error = message,
            detail = ex.Message
        };
        await context.Response.WriteAsync(JsonSerializer.Serialize(error));
    }
}
