# 線上商店系統

完整的線上商店系統，包含前端與後端 API。

## 專案結構

```
online-store-demo/
├── frontend/                 # 前端專案 (HTML/CSS/JavaScript + Node.js 開發伺服器)
│   ├── client/               # 客戶端介面
│   ├── admin/                # 管理端介面
│   ├── images/               # 圖片資源
│   ├── styles/               # 樣式檔案
│   ├── js/                   # JavaScript 檔案
│   ├── index.html            # 主頁面
│   ├── package.json          # 前端相依套件
│   ├── server.js             # Node.js 開發伺服器
│   └── start.bat             # 前端啟動腳本
├── OnlineStore.AdminApi/     # 後端 API (.NET Core 8 Web API)
│   ├── Controllers/          # API 控制器
│   ├── Dockerfile            # Docker 容器化設定
│   ├── Program.cs            # 主程式
│   └── *.csproj              # 專案檔案
├── .gitignore                # Git 忽略檔案
└── README.md                 # 專案說明文件
```

## 快速開始

### 前端開發

```bash
cd frontend
npm install
npm start
```

前端將在 http://localhost:3000 啟動

### 後端開發

```bash
cd OnlineStore.AdminApi
dotnet restore
dotnet run
```

後端 API 將在 http://localhost:5000 啟動
# 執行 start.bat 檔案
start.bat
```

#### 方法二：手動安裝
```bash
# 安裝相依套件
npm install

# 啟動伺服器
npm start
```

### 3. 存取系統
- 客戶端: http://localhost:3000/client/index.html
- 管理端: http://localhost:3000/admin/index.html

### 4. 預設帳號
- 管理員帳號: `admin`
- 管理員密碼: `admin123`

## 專案結構

```
online-store-demo/
├── client/                 # 客戶端檔案
│   ├── css/
│   │   └── style.css      # 客戶端樣式
│   ├── js/
│   │   ├── app.js         # 主要應用程式邏輯
│   │   ├── auth.js        # 認證功能
│   │   ├── cart.js        # 購物車功能
│   │   └── products.js    # 商品相關功能
│   └── index.html         # 客戶端主頁
├── admin/                 # 管理端檔案
│   ├── css/
│   │   └── admin.css      # 管理端樣式
│   ├── js/
│   │   ├── admin.js       # 管理端主要邏輯
│   │   ├── admin-auth.js  # 管理員認證
│   │   ├── admin-products.js # 商品管理
│   │   └── admin-orders.js   # 訂單管理
│   └── index.html         # 管理端主頁
├── images/                # 圖片資源
├── server.js              # 後端伺服器
├── package.json           # 專案設定
├── start.bat              # Windows 啟動腳本
└── README.md              # 專案說明
```

## API 端點

### 客戶端 API
- `POST /api/register` - 使用者註冊
- `POST /api/login` - 使用者登入
- `GET /api/products` - 獲取商品列表
- `GET /api/products/:id` - 獲取單一商品
- `POST /api/orders` - 建立訂單
- `GET /api/orders` - 獲取使用者訂單
- `GET /api/categories` - 獲取商品分類

### 管理端 API
- `POST /api/admin/login` - 管理員登入
- `GET /api/admin/stats` - 獲取統計資料
- `POST /api/admin/products` - 新增商品
- `PUT /api/admin/products/:id` - 更新商品
- `DELETE /api/admin/products/:id` - 刪除商品
- `GET /api/admin/orders` - 獲取所有訂單
- `PUT /api/admin/orders/:id` - 更新訂單狀態

## 功能說明

### 客戶端功能

#### 使用者認證
- 註冊新帳號
- 登入/登出
- JWT token 驗證

#### 商品功能
- 瀏覽所有商品
- 按分類篩選
- 搜尋商品
- 查看商品詳情

#### 購物車功能
- 加入商品到購物車
- 修改商品數量
- 移除商品
- 計算總金額

#### 訂單功能
- 結帳流程
- 填寫配送資訊
- 查看訂單歷史
- 訂單狀態追蹤

### 管理端功能

#### 儀表板
- 統計資料顯示
- 最近訂單
- 熱門商品

#### 商品管理
- 新增/編輯/刪除商品
- 庫存管理
- 精選商品設定
- 批量操作

#### 訂單管理
- 查看所有訂單
- 更新訂單狀態
- 訂單詳情查看
- 狀態篩選

#### 使用者管理
- 查看使用者列表
- 使用者詳情
- 帳號狀態管理

## 擴展功能

### 可新增的功能
- 商品圖片上傳
- 優惠券系統
- 庫存預警
- 郵件通知
- 支付整合
- 物流追蹤
- 商品評價
- 願望清單

### 資料庫整合
目前使用內存資料庫，可以擴展為：
- MongoDB
- MySQL
- PostgreSQL
- SQLite

## 開發說明

### 新增功能
1. 後端：在 `server.js` 中新增 API 端點
2. 前端：在對應的 JavaScript 檔案中新增功能
3. 樣式：在 CSS 檔案中新增樣式

### 自訂設定
- 修改 `server.js` 中的 JWT_SECRET
- 調整商品分類和預設資料
- 自訂樣式和佈局

## 部署

### 本地開發
```bash
npm run dev  # 使用 nodemon 自動重啟
```

### 生產環境
```bash
npm start
```

### 雲端部署
可部署到以下平台：
- Heroku
- Vercel
- Netlify
- Azure
- AWS

## 安全性考量

- 密碼使用 bcryptjs 加密
- JWT token 驗證
- 輸入驗證和清理
- CORS 設定
- 錯誤處理

## 授權

MIT License

## 支援

如有問題或建議，請建立 issue 或聯絡開發者。

## 版本歷史

- v1.0.0 - 初始版本
  - 完整的客戶端功能
  - 完整的管理端功能
  - 響應式設計
  - JWT 認證系統
# online-store-demo
