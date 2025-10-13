# 管理員後台 (Frontend-Admin)

## 📋 功能說明

這是電子商城的管理員後台系統，提供管理員管理商品、訂單等功能。

## 🔐 登入資訊

**管理員測試帳號：**
- Email: `admin@example.com`
- 密碼: 任意（Mock 模式）

## 📁 頁面結構

```
frontend-admin/
├── index.html         # 管理員登入頁面
├── dashboard.html     # 儀表板（統計資訊）
├── products.html      # 商品管理（新增/編輯/刪除商品）
├── orders.html        # 訂單管理（查看所有訂單、更新狀態）
└── README.md          # 說明文件
```

## ✨ 主要功能

### 1. 儀表板 (dashboard.html)
- 📊 顯示統計資訊
  - 商品總數
  - 訂單總數
  - 待處理訂單
  - 總銷售額
- 📋 顯示最近訂單列表
- 🚀 快速操作連結

### 2. 商品管理 (products.html)
- ➕ 新增商品
- ✏️ 編輯商品資訊
- 🗑️ 刪除商品
- 📦 管理商品庫存
- 🏷️ 商品分類管理

### 3. 訂單管理 (orders.html)
- 📋 查看所有訂單
- 🔍 訂單詳情查看
- 🔄 更新訂單狀態
  - 待處理 (Pending)
  - 處理中 (Processing)
  - 已出貨 (Shipped)
  - 已送達 (Delivered)
  - 已取消 (Cancelled)
- 🎯 依狀態篩選訂單

## 🚀 使用方式

### 方法 1：使用 Live Server（推薦）
1. 在 VS Code 中開啟 `index.html`
2. 右鍵選擇 "Open with Live Server"
3. 使用管理員帳號登入

### 方法 2：直接開啟檔案
```bash
# 在瀏覽器中開啟
start index.html
```

### 方法 3：使用簡易伺服器
```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js
npx http-server -p 8080
```

然後在瀏覽器中開啟：`http://localhost:8080`

## 🔒 權限控制

- ✅ 只有 `isAdmin: true` 的使用者可以存取後台
- ✅ 每個頁面都會檢查管理員權限
- ✅ 非管理員會被導向登入頁面

## 🎨 使用技術

- **Vue 3**: 前端框架
- **Pico.css**: CSS 框架
- **Mock API**: 模擬後端 API
- **LocalStorage**: 儲存登入狀態

## 📝 注意事項

1. **Mock 模式**：目前使用 Mock API，資料儲存在記憶體中，重新整理頁面後會恢復初始狀態
2. **共用 API**：與 frontend-client 共用 API 和認證模組
3. **獨立系統**：管理後台是獨立的系統，與消費者前台分離

## 🔗 相關連結

- 消費者前台：`../frontend-client/index.html`
- 後端 API：`../backend/` (如果有)

## 🛠️ 開發建議

如果要連接真實後端 API：
1. 修改 `../frontend-client/js/config.js` 中的 API 端點
2. 將 `USE_MOCK_API` 設為 `false`
3. 確保後端 API 實作相應的管理員端點

---

**建立日期：** 2025年10月13日
