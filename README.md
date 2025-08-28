# 線上商店系統 (Online Store Demo)

一個功能完整的全端線上商店系統，包含前端購物介面和後端 API 服務。

## 🏗️ 專案架構

`
online-store-demo/
├── frontend/          # 前端應用程式 (HTML/CSS/JavaScript)
├── backend/           # 後端 API 服務 (.NET Core/C#)
├── docs/             # 專案文件
└── README.md         # 專案說明
`

## 🚀 快速開始

### 環境需求
- Node.js >= 14.0.0 (前端)
- .NET 8.0 SDK (後端)
- npm >= 6.0.0

### 安裝與啟動

#### 方法一：一鍵啟動 (推薦)
`ash
# 安裝所有相依套件
npm run install:all

# 同時啟動前端和後端
npm start
`

#### 方法二：Windows 批次檔
`ash
# 雙擊執行 start-all.bat
start-all.bat
`

#### 方法三：分別啟動
`ash
# 前端 (Port 3000)
npm run start:frontend

# 後端 (Port 5000)
npm run start:backend
`

### 存取網址
- **前端介面**: http://localhost:3000
- **後端 API**: http://localhost:5000
- **管理後台**: http://localhost:3000/admin.html
- **API 文件**: http://localhost:5000/swagger

## 📁 專案結構

### 前端 (/frontend)
- 客戶端購物介面
- 管理員後台
- 響應式網頁設計
- 技術: HTML5, CSS3, Vanilla JavaScript

### 後端 (/backend)
- RESTful API 服務
- JWT 認證系統
- 商品與訂單管理
- 技術: .NET 8.0, C#, Entity Framework

## 🛠️ 開發指令

`ash
# 安裝相依套件
npm run install:all

# 開發模式 (熱重載)
npm run dev

# 執行測試
npm test

# 建構生產版本
npm run build

# 清除 node_modules
npm run clean
`

## 📚 技術文件

詳細的技術需求文件請參考：[技術需求文件.md](./frontend/技術需求文件.md)

## 🔧 開發工具

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **後端**: .NET 8.0, C#, ASP.NET Core
- **版控**: Git, GitHub
- **測試**: Jest (前端), xUnit (.NET)
- **開發工具**: Nodemon, Concurrently

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 👥 貢獻

歡迎提交 Issue 和 Pull Request！

---

**開發者**: jackson204  
**GitHub**: https://github.com/jackson204/online-store-demo
