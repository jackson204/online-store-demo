/**
 * API 設定檔
 * 開發階段設定 USE_MOCK_API = true，後端完成後改為 false
 */

const CONFIG = {
    // 🎭 開發階段使用 Mock API
    USE_MOCK_API: true,
    
    // 🔌 API Base URL
    API_BASE_URL: 'http://localhost:5000/api',
    
    // 🔑 LocalStorage Keys
    TOKEN_KEY: 'ecommerce_token',
    USER_KEY: 'ecommerce_user',
    
    // ⏱️ API Timeout (ms)
    API_TIMEOUT: 10000
};

// 匯出設定
window.CONFIG = CONFIG;
