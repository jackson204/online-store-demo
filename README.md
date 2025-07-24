# 線上商店系統技術文件

## 專案簡介

本專案為一套完整的線上商店系統，包含前端（客戶端、管理端）與後端 API（.NET 8 Web API），支援商品瀏覽、購物車、訂單、用戶認證、管理後台等功能，並可容器化部署。

---

## 專案結構

```
online-store-demo/
├── frontend/                 # 前端專案 (HTML/CSS/JavaScript + Node.js)
│   ├── client/               # 客戶端介面
│   │   ├── index.html        # 客戶端首頁
│   │   ├── css/              # 客戶端樣式
│   │   └── js/               # 客戶端 JS
│   ├── admin/                # 管理端介面
│   │   ├── index.html        # 管理端首頁
│   │   ├── css/              # 管理端樣式
│   │   └── js/               # 管理端 JS
│   ├── images/               # 圖片資源
│   ├── styles/               # 共用樣式
│   ├── js/                   # 共用 JavaScript 檔案
│   ├── index.html            # 首頁
│   ├── admin.html            # 管理端入口
│   ├── product-detail-test.html # 商品詳情測試頁
│   ├── system-test.html      # 系統測試頁
│   ├── test.html             # 測試頁
│   ├── package.json          # 前端相依套件
│   ├── package-lock.json     # 前端鎖定檔
│   ├── server.js             # Node.js 開發伺服器
│   ├── start-frontend.bat    # 前端靜態伺服器啟動腳本
│   └── start.bat             # Node.js 伺服器啟動腳本
├── OnlineStore.AdminApi/     # 後端 API (.NET 8 Web API)
│   ├── Controllers/          # API 控制器
│   ├── Models/               # 資料模型
│   ├── Data/                 # EF Core DbContext
│   ├── Features/             # CQRS/功能模組
│   ├── Migrations/           # EF Core 資料庫遷移
│   ├── Properties/           # 專案屬性
│   ├── Dockerfile            # Docker 容器化設定
│   ├── Program.cs            # 入口程式
│   ├── appsettings.json      # 設定檔
│   ├── appsettings.Development.json # 開發用設定
│   └── *.csproj              # 專案檔案
├── OnlineStore.AdminApi.Tests/ # 後端單元測試專案
│   ├── Features/             # 測試功能模組
│   └── *.csproj              # 測試專案檔案
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
- v1.1.0 - 新增後端 Products 查詢單元測試，提升 API 測試覆蓋率，優化 README 與容器化部署說明

---

## 進階功能規劃與學習路線

建議學習與實作順序如下：

1. **JWT（JSON Web Token）**
   - 實作 API 認證與授權的基礎，確保用戶身分安全。
2. **權限區分（角色/權限控管）**
   - 根據用戶角色（如管理員/一般用戶）限制 API 與前端功能存取。
3. **NLog（記錄）**
   - 導入 NLog 進行日誌記錄，方便除錯、稽核與追蹤異常。
4. **Redis（快取/分散式 Session）**
   - 使用 Redis 儲存快取資料、Session 或作為訊息佇列，提升效能與可用性。
5. **匯出 Excel**
   - 提供報表或資料匯出功能，常用於後台管理。
6. **推播（推送通知，建議可用 SignalR 或 Firebase Cloud Messaging）**
   - 即時通知用戶訂單狀態、促銷等訊息。

---

## 今日 TODO LIST（2025/07/25）

### 已完成
- 完成前端 client 主要功能與管理端主要功能
- 完成後端 CORS 設定，前後端可正確通訊
- 使用 Docker 啟動 MSSQL 容器並完成資料庫連線
- 完成 Entity Framework Core 整合與資料表遷移
- ProductsController 已改為資料庫查詢
- 新增 GetProductsQueryHandler 單元測試，提升查詢功能測試覆蓋率

### 今日進度（2025/07/25）
- 完成前端 client 主要功能與管理端主要功能
- 完成後端 CORS 設定，前後端可正確通訊
- 使用 Docker 啟動 MSSQL 容器並完成資料庫連線
- 完成 Entity Framework Core 整合與資料表遷移
- ProductsController 已改為資料庫查詢
- 新增 GetProductsQueryHandler 單元測試，提升查詢功能測試覆蓋率

### 開發中/待辦功能
- [ ] JWT token 認證/授權（前後端皆需串接）
- [ ] 實作權限區分（管理員/一般用戶 API 權限控管）
- [ ] 導入 NLog 日誌記錄（API 層級 log）
- [ ] Redis 快取/Session 整合（效能優化）
- [ ] 匯出 Excel 報表功能（管理端匯出商品/訂單資料）
- [ ] 推播（SignalR/Firebase Demo，管理端即時通知）
- [ ] 強化後端 API 單元測試覆蓋率（持續新增 Products/Orders 相關測試）
- [ ] 檢查資料庫 Migration 與模型同步狀態
- [ ] 優化 Dockerfile 與 .dockerignore，確保映像檔最佳化
- [ ] 撰寫/補充 README 測試與部署章節

> 近期已完成主要架構與資料庫整合，今日聚焦於測試覆蓋率提升、容器化最佳實踐與進階功能學習。

---

## 聯絡與支援
如有問題或建議，請建立 issue 或聯絡開發者。

---

> 本專案僅供學習與展示用途
