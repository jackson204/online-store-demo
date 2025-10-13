/**
 * 工具函式
 */

const Utils = {
    // 格式化金額
    formatPrice(price) {
        return `NT$ ${price.toLocaleString('zh-TW')}`;
    },

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // 顯示 Toast 訊息
    showToast(message, type = 'success') {
        // 簡易實作，可替換為更美觀的 Toast 元件
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            border-radius: 4px;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // 顯示 Loading
    showLoading() {
        const loading = document.createElement('div');
        loading.id = 'loading';
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9998;
            ">
                <div style="color: white; font-size: 18px;">載入中...</div>
            </div>
        `;
        document.body.appendChild(loading);
    },

    // 隱藏 Loading
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.remove();
        }
    },

    // 取得 URL 參數
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
};

// 匯出到全域
window.Utils = Utils;
