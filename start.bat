@echo off
echo 正在啟動線上商店系統...
echo.

REM 檢查是否已安裝 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 錯誤: 未安裝 Node.js
    echo 請先安裝 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 安裝相依套件
echo 正在安裝相依套件...
npm install

REM 檢查安裝是否成功
if %errorlevel% neq 0 (
    echo 錯誤: 套件安裝失敗
    pause
    exit /b 1
)

echo.
echo 套件安裝完成！
echo.

REM 啟動伺服器
echo 正在啟動伺服器...
echo.
echo 伺服器啟動後請在瀏覽器開啟：
echo.
echo 客戶端: http://localhost:3000/client/index.html
echo 管理端: http://localhost:3000/admin/index.html
echo.
echo 管理員預設帳號: admin / 密碼: admin123
echo.
echo 按 Ctrl+C 停止伺服器
echo.

npm start
