# 線上商店前端

這是線上商店系統的前端專案，包含客戶端和管理端介面。

## 專案結構

```
frontend/
├── client/                   # 客戶端介面
│   ├── index.html           # 客戶端主頁面
│   ├── css/                 # 客戶端樣式
│   └── js/                  # 客戶端腳本
├── admin/                   # 管理端介面
│   ├── index.html           # 管理端主頁面
│   ├── css/                 # 管理端樣式
│   └── js/                  # 管理端腳本
├── images/                  # 圖片資源
├── styles/                  # 共用樣式
├── js/                      # 共用腳本
├── index.html               # 主頁面 (選擇介面)
├── package.json             # 專案相依套件
├── server.js                # Node.js 開發伺服器
└── start.bat                # 啟動腳本
```

## 快速開始

### 安裝相依套件
```bash
npm install
```

### 啟動開發伺服器
```bash
npm start
```

或使用啟動腳本：
```bash
start.bat
```

前端將在 http://localhost:3000 啟動

## 功能特色

### 客戶端功能
- 🛍️ 商品瀏覽與搜尋
- 🛒 購物車功能
- 👤 使用者認證 (註冊/登入)
- 📦 訂單管理
- 💳 結帳流程

### 管理端功能
- 📊 儀表板統計
- 📦 商品管理 (新增/編輯/刪除)
- 🛒 訂單管理
- 👥 使用者管理
- 📈 報表分析

## 測試帳號

### 客戶端
- 帳號：demo@example.com
- 密碼：demo123

### 管理端
- 帳號：admin
- 密碼：admin123

## 技術棧

- HTML5 / CSS3 / JavaScript (ES6+)
- Node.js (開發伺服器)
- Express.js (開發 API)
- JWT 認證
- Local Storage (客戶端資料儲存)

## 開發說明

目前前端使用靜態資料 (MOCK_DATA) 進行開發和測試。當後端 API 完成後，可以輕鬆整合真實的資料來源。

### 資料結構
- 使用者資料
- 商品資料
- 訂單資料
- 類別資料

### API 準備
前端已經準備好接收來自後端 API 的資料，API 端點包括：
- /api/auth/* (認證相關)
- /api/products/* (商品相關)
- /api/orders/* (訂單相關)
- /api/users/* (使用者相關)

## 部署

### 靜態檔案部署
可以直接將 HTML、CSS、JavaScript 檔案部署到：
- Nginx
- Apache
- CDN (如 Cloudflare)
- 靜態主機 (如 Netlify, Vercel)

### Node.js 伺服器部署
如果需要開發伺服器功能，可以部署到：
- Heroku
- Vercel
- Railway
- 自建伺服器
