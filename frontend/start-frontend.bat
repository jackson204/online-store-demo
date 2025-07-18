@echo off
chcp 65001 >nul
echo ==========================================
echo         線上商店前端展示系統
echo ==========================================
echo.
echo 🚀 啟動本地伺服器中...
echo.
echo 📱 系統將在瀏覽器中開啟以下頁面：
echo    - 主頁面: http://localhost:8000
echo    - 測試頁面: http://localhost:8000/test.html
echo.
echo 🔐 測試帳號：
echo    客戶端 - demo@example.com / demo123
echo    管理端 - admin / admin123
echo.
echo ⚠️  使用 Ctrl+C 停止伺服器
echo ==========================================
echo.

:: 嘗試使用 Python 啟動伺服器
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ 使用 Python 啟動伺服器...
    start http://localhost:8000
    start http://localhost:8000/test.html
    python -m http.server 8000
) else (
    echo ❌ 未安裝 Python
    echo.
    echo 📝 請安裝 Python 或直接開啟以下檔案：
    echo    - index.html
    echo    - test.html
    echo.
    pause
)
