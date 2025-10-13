# 電子商務開發專案 (Online Store Demo)

輕量級電子商務平台 Side Project，採用前後端分離架構。

## 📋 專案簡介

本專案為學習用途的電商平台，提供完整的核心功能：
- 🛍️ 商品瀏覽與詳情查看
- 🛒 購物車管理
- 📦 訂單建立與查詢
- 👤 會員註冊與登入
- 🔐 JWT 認證機制
- 🎯 管理後台（商品與訂單管理）

## 🏗️ 技術架構

### 前端
- **框架**: Vue 3 (CDN 版本)
- **UI**: Pico.css
- **特色**: 無需編譯，開箱即用

### 後端
- **框架**: .NET 8 Web API (Controller-based)
- **ORM**: Entity Framework Core 8
- **資料庫**: MS SQL Server / LocalDB
- **認證**: JWT Token

## 📂 專案結構

```
online-store-demo/
├── frontend-client/          # 客戶端前端
│   ├── index.html           # 商品列表
│   ├── login.html           # 登入/註冊
│   ├── cart.html            # 購物車
│   ├── checkout.html        # 結帳
│   └── orders.html          # 訂單列表
│
├── frontend-admin/          # 管理後台前端（待開發）
│
├── backend/                 # 後端 API（待開發）
│
└── 電子商務開發專案技術文件_new.md  # 完整技術規格書
```

## 🚀 快速開始

### 前端（當前可用）

1. 使用 VSCode Live Server 開啟 `frontend-client/index.html`
2. 或使用任何靜態伺服器執行前端

目前前端使用 **Mock API**，可以完整測試所有功能而無需後端。

### 測試帳號（Mock 資料）

**一般使用者**:
- Email: `user@example.com`
- Password: 任意（Mock 模式下）

**管理員**:
- Email: `admin@example.com`
- Password: 任意（Mock 模式下）

## 📖 開發文件

完整的技術規格、API 設計、資料庫結構請參考：
- [電子商務開發專案技術文件](./電子商務開發專案技術文件_new.md)

## 🔧 開發狀態

- ✅ 前端客戶端（使用 Mock API）
- ⏳ 前端管理後台（規劃中）
- ⏳ 後端 API（待開發）
- ⏳ 資料庫設計（待實作）

## 📝 待辦事項

- [ ] 完成後端 .NET 8 Web API 開發
- [ ] 設定 MS SQL Server 資料庫
- [ ] 實作 JWT 認證機制
- [ ] 建立管理後台前端
- [ ] 撰寫單元測試
- [ ] 部署至測試環境

## 📄 授權

本專案為學習用途，僅供參考。

## 👨‍💻 作者

Jackson

## 🙏 致謝

感謝所有開源專案的貢獻者！
