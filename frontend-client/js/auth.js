/**
 * 認證工具
 * 處理登入/登出/Token 管理
 */

const Auth = {
    // 儲存登入資訊
    saveLoginData(token, user) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    },

    // 清除登入資訊
    clearLoginData() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
    },

    // 檢查是否已登入
    isLoggedIn() {
        return !!localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    // 取得當前使用者
    getCurrentUser() {
        const userJson = localStorage.getItem(CONFIG.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },

    // 檢查是否為管理員
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.isAdmin === true;
    },

    // 登出
    logout() {
        this.clearLoginData();
        window.location.href = 'login.html';
    },

    // 需要登入才能存取的頁面檢查
    requireLogin() {
        if (!this.isLoggedIn()) {
            alert('請先登入');
            window.location.href = 'login.html';
        }
    }
};

// 匯出到全域
window.Auth = Auth;
