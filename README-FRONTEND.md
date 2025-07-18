# 🛒 線上商店前端展示系統

這是一個完整的線上商店前端展示專案，使用靜態資料運行，專為後續 .NET Core 後端開發而設計。

## 🚀 快速開始

### 開啟方式
1. **主頁面**: 開啟 `index.html` 選擇介面
2. **測試頁面**: 開啟 `test.html` 查看完整說明
3. **直接進入**:
   - 客戶端：`client/index.html`
   - 管理端：`admin/index.html`

### 本地伺服器（建議）
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# VS Code Live Server 擴充功能
# 右鍵 index.html -> Open with Live Server
```

## 🔐 測試帳號

| 介面 | 帳號 | 密碼 | 說明 |
|------|------|------|------|
| 客戶端 | demo@example.com | demo123 | 一般使用者 |
| 管理端 | admin | admin123 | 系統管理員 |

## 📱 功能展示

### 🛍️ 客戶端功能
- ✅ **商品展示**: 6 項靜態商品，完整資訊
- ✅ **搜尋過濾**: 關鍵字搜尋、分類篩選
- ✅ **價格排序**: 升序/降序排列
- ✅ **星級評分**: 商品評分顯示
- ✅ **購物車**: 加入/移除商品、數量調整
- ✅ **使用者系統**: 註冊、登入、個人資料
- ✅ **訂單管理**: 訂單建立、歷史查看
- ✅ **響應式設計**: 支援手機、平板、桌面

### ⚙️ 管理端功能
- ✅ **管理員認證**: 安全登入系統
- ✅ **數據儀表板**: 銷售統計、圖表展示
- ✅ **商品管理**: CRUD 操作、庫存管理
- ✅ **訂單管理**: 訂單狀態、處理流程
- ✅ **使用者管理**: 客戶資料管理
- ✅ **即時通知**: 操作回饋系統

## 📁 專案結構

```
online-store-demo/
├── 📄 index.html          # 主入口頁面
├── 📄 test.html           # 系統測試頁面
├── 📁 client/             # 客戶端介面
│   ├── 📄 index.html      # 客戶端主頁
│   ├── 📁 css/
│   │   └── 📄 style.css   # 客戶端樣式
│   └── 📁 js/
│       ├── 📄 app.js      # 主程式邏輯 + 靜態資料
│       ├── 📄 auth.js     # 認證系統
│       ├── 📄 cart.js     # 購物車功能
│       └── 📄 products.js # 商品與訂單
├── 📁 admin/              # 管理端介面
│   ├── 📄 index.html      # 管理端主頁
│   ├── 📁 css/
│   │   └── 📄 admin.css   # 管理端樣式
│   └── 📁 js/
│       ├── 📄 admin.js    # 主程式 + 管理資料
│       ├── 📄 admin-auth.js    # 管理員認證
│       ├── 📄 admin-products.js # 商品管理
│       └── 📄 admin-orders.js   # 訂單管理
└── 📁 images/             # 圖片資源
```

## 💾 靜態資料說明

### 商品資料 (6 項)
- 👕 經典白色T恤 - NT$ 590
- 👖 修身牛仔褲 - NT$ 1,290
- 👟 運動休閒鞋 - NT$ 2,490
- ⌚ 時尚手錶 - NT$ 3,580
- 🎧 藍牙耳機 - NT$ 4,990
- 👝 皮革錢包 - NT$ 890

### 分類系統
- 👔 **服飾類**: T恤、牛仔褲
- 👟 **鞋類**: 運動鞋
- 💼 **配件類**: 手錶、錢包
- 📱 **電子產品**: 藍牙耳機

### 使用者資料
- **客戶帳號**: demo@example.com (含訂單記錄)
- **管理員**: admin (完整權限)

## 🛠️ 技術規格

### 前端技術
- **HTML5**: 語義化標籤
- **CSS3**: Flexbox、Grid、響應式設計
- **JavaScript ES6+**: 模組化、非同步處理
- **Font Awesome 6**: 圖示系統
- **LocalStorage**: 本地資料儲存

### 設計特色
- 🎨 現代化漸層設計
- 📱 RWD 響應式布局
- ⚡ 流暢動畫效果
- 🔔 即時通知系統
- 🌙 友善的使用者介面

## 🌐 瀏覽器相容性

| 瀏覽器 | 版本要求 | 支援狀態 |
|--------|----------|----------|
| Chrome | 60+ | ✅ 完全支援 |
| Firefox | 55+ | ✅ 完全支援 |
| Safari | 12+ | ✅ 完全支援 |
| Edge | 79+ | ✅ 完全支援 |

## 🔗 後端整合指南

### API 端點設計建議
```typescript
// 商品 API
GET    /api/products           # 獲取商品列表
POST   /api/products           # 新增商品
PUT    /api/products/{id}      # 更新商品
DELETE /api/products/{id}      # 刪除商品

// 認證 API  
POST   /api/auth/login         # 使用者登入
POST   /api/auth/register      # 使用者註冊
POST   /api/auth/logout        # 登出

// 訂單 API
GET    /api/orders             # 獲取使用者訂單
POST   /api/orders             # 建立新訂單
GET    /api/orders/{id}        # 獲取訂單詳情

// 管理 API
POST   /api/admin/login        # 管理員登入
GET    /api/admin/dashboard    # 儀表板資料
GET    /api/admin/orders       # 所有訂單
PUT    /api/admin/orders/{id}  # 更新訂單狀態
```

### 資料模型參考
參考檔案中的靜態資料結構：
- `client/js/app.js` → `MOCK_DATA`
- `admin/js/admin.js` → `ADMIN_MOCK_DATA`

### 前端準備
- ✅ API 呼叫已預留位置
- ✅ 錯誤處理機制完整
- ✅ Loading 狀態處理
- ✅ 資料驗證邏輯
- ✅ JWT Token 支援準備

## 🚧 開發狀態

| 模組 | 狀態 | 說明 |
|------|------|------|
| 🛍️ 客戶端 | ✅ 完成 | 所有功能可用 |
| ⚙️ 管理端 | ✅ 完成 | 所有功能可用 |
| 🔐 認證系統 | ✅ 完成 | 靜態驗證 |
| 💾 資料儲存 | ✅ 完成 | LocalStorage |
| 🎨 UI/UX | ✅ 完成 | 響應式設計 |
| 🔌 API 整合 | ⏳ 待開發 | .NET Core 後端 |

## 📈 下一步計劃

### 後端開發 (.NET Core)
1. **專案設定**: Web API、Entity Framework
2. **資料庫設計**: 參考靜態資料結構
3. **認證系統**: JWT Token、角色權限
4. **API 開發**: RESTful API 設計
5. **整合測試**: 前後端聯調

### 功能擴展
- 💳 支付系統整合
- 📧 電子郵件通知
- 📊 進階報表
- 🔍 全文搜尋
- 📱 PWA 支援

## 🐛 已知限制

- 🖼️ 商品圖片使用 placeholder 服務
- 💳 支付功能尚未實現
- 📧 郵件通知需要後端支援
- 🔍 搜尋僅限於靜態資料

## 🤝 使用方式

1. **開發者**: 可以此為基礎開發後端
2. **測試者**: 使用測試帳號體驗功能
3. **展示**: 完整的前端功能展示

## 📞 技術支援

如有問題歡迎提出 Issue 或進行討論。

---

**專案狀態**: 前端完成，等待後端整合  
**最後更新**: 2024年  
**授權**: 僅供學習展示使用
