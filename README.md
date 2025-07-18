# 線上商店系統技術文件

## 專案簡介

本專案為一套完整的線上商店系統，包含前端（客戶端、管理端）與後端 API（.NET 8 Web API），支援商品瀏覽、購物車、訂單、用戶認證、管理後台等功能，並可容器化部署。

---

## 專案結構

```
online-store-demo/
├── frontend/                 # 前端專案 (HTML/CSS/JavaScript + Node.js)
│   ├── client/               # 客戶端介面
│   ├── admin/                # 管理端介面
│   ├── images/               # 圖片資源
│   ├── styles/               # 樣式檔案
│   ├── js/                   # 共用 JavaScript 檔案
│   ├── index.html            # 首頁
│   ├── package.json          # 前端相依套件
│   ├── server.js             # Node.js 開發伺服器
│   └── start.bat             # 前端啟動腳本
├── OnlineStore.AdminApi/     # 後端 API (.NET 8 Web API)
│   ├── Controllers/          # API 控制器
│   ├── Models/               # 資料模型
│   ├── Dockerfile            # Docker 容器化設定
│   ├── Program.cs            # 入口程式
│   └── *.csproj              # 專案檔案
├── README.md                 # 技術說明文件
└── ...
```

---

## 快速開始

### 前端開發

```bash
cd frontend
npm install
npm start
```
前端將於 http://localhost:3000 啟動

### 後端開發

```bash
cd OnlineStore.AdminApi
dotnet restore
dotnet run
```
後端 API 將於 http://localhost:5223 或 https://localhost:7292 啟動

---

## 前端功能說明

### 客戶端
- 商品瀏覽、分類、搜尋、排序
- 購物車管理
- 用戶註冊、登入、登出（JWT 驗證）
- 訂單建立與查詢
- 響應式設計，支援桌機/平板/手機

### 管理端
- 管理員登入
- 商品 CRUD 與庫存管理
- 訂單管理與狀態追蹤
- 用戶管理
- 儀表板統計

### 測試帳號
| 介面   | 帳號              | 密碼      |
|--------|-------------------|-----------|
| 客戶端 | demo@example.com  | demo123   |
| 管理端 | admin             | admin123  |

---

## 後端 API 說明

### 主要 API 端點
- `POST /api/register` - 用戶註冊
- `POST /api/login` - 用戶登入
- `GET /api/products` - 取得商品列表
- `GET /api/products/:id` - 取得單一商品
- `POST /api/orders` - 建立訂單
- `GET /api/orders` - 取得用戶訂單
- `GET /api/categories` - 取得商品分類

#### 管理端 API
- `POST /api/admin/login` - 管理員登入
- `GET /api/admin/stats` - 取得統計資料
- `POST /api/admin/products` - 新增商品
- `PUT /api/admin/products/:id` - 更新商品
- `DELETE /api/admin/products/:id` - 刪除商品
- `GET /api/admin/orders` - 取得所有訂單
- `PUT /api/admin/orders/:id` - 更新訂單狀態

#### 商品 DTO 結構（ProductDto.cs）
```csharp
public class ProductDto {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public int Price { get; set; }
    public int Stock { get; set; }
    public bool Featured { get; set; }
    public string Image { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

---

## 部署與測試

### 本地開發
- 前端：`npm run dev` 或 `npm start`
- 後端：`dotnet run`

### 容器化部署
- 參考 `OnlineStore.AdminApi/Dockerfile`，可用 Docker 建立後端映像
- 建議前後端分開部署，前端可靜態主機/Node.js，後端可用 Azure/AWS/Heroku 等

### 圖片資源
- 請將商品圖片放於 `frontend/images/`，或使用線上圖片 URL

---

## 安全性考量
- 密碼使用 bcryptjs 加密
- JWT token 驗證
- 輸入驗證與清理
- CORS 設定
- 錯誤處理

---

## 版本歷史
- v1.0.0 - 初始版本，完整客戶端/管理端功能、響應式設計、JWT 驗證

---

## 今日 TODO LIST（2025/07/19）

- [x] 完成前端 client 主要功能
- [x] 完成前端 admin 主要功能
- [x] 完成後端 CORS 設定，前後端可正確通訊

> 本日 client 與 admin 前端介面皆由 AI 輔助產生，並已完成主要功能與 CORS 串接測試。

---

## 聯絡與支援
如有問題或建議，請建立 issue 或聯絡開發者。

---

> 本專案僅供學習與展示用途
