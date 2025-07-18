// 管理端主要功能

// 全域變數
let currentAdmin = null;
let products = [];
let orders = [];
let users = [];
let stats = {};

// API 基礎 URL（目前使用靜態資料，暫時保留供未來使用）
const API_BASE = 'http://localhost:5000/api';

// 靜態資料 - 模擬管理端資料
const ADMIN_MOCK_DATA = {
    admin: {
        username: 'admin',
        password: 'admin123',
        email: 'admin@store.com',
        role: 'admin'
    },
    
    // 使用客戶端的商品資料
    products: [
        {
            id: '1',
            name: '經典白色T恤',
            description: '100%純棉材質，舒適透氣，適合日常穿著',
            price: 590,
            image: 'https://via.placeholder.com/300x300/f0f0f0/333?text=白色T恤',
            category: 'clothing',
            stock: 50,
            featured: true,
            rating: 4.5,
            reviews: 128
        },
        {
            id: '2',
            name: '修身牛仔褲',
            description: '高品質牛仔布料，修身版型設計',
            price: 1290,
            image: 'https://via.placeholder.com/300x300/4169e1/fff?text=牛仔褲',
            category: 'clothing',
            stock: 30,
            featured: false,
            rating: 4.3,
            reviews: 89
        },
        {
            id: '3',
            name: '運動休閒鞋',
            description: '輕量化設計，舒適鞋底，適合運動與日常',
            price: 2490,
            image: 'https://via.placeholder.com/300x300/ff6b6b/fff?text=運動鞋',
            category: 'shoes',
            stock: 25,
            featured: true,
            rating: 4.7,
            reviews: 203
        },
        {
            id: '4',
            name: '時尚手錶',
            description: '精工製作，防水設計，商務休閒兩相宜',
            price: 3580,
            image: 'https://via.placeholder.com/300x300/2c3e50/fff?text=手錶',
            category: 'accessories',
            stock: 15,
            featured: true,
            rating: 4.6,
            reviews: 67
        },
        {
            id: '5',
            name: '藍牙耳機',
            description: '高音質無線耳機，降噪功能，長效電池',
            price: 4990,
            image: 'https://via.placeholder.com/300x300/9b59b6/fff?text=耳機',
            category: 'electronics',
            stock: 8,
            featured: false,
            rating: 4.8,
            reviews: 245
        },
        {
            id: '6',
            name: '皮革錢包',
            description: '頂級真皮製作，精美工藝，多卡位設計',
            price: 890,
            image: 'https://via.placeholder.com/300x300/8b4513/fff?text=錢包',
            category: 'accessories',
            stock: 35,
            featured: false,
            rating: 4.4,
            reviews: 156
        }
    ],
    
    orders: [
        {
            id: 'ORD001',
            userId: '1',
            customerName: 'demo',
            customerEmail: 'demo@example.com',
            status: 'completed',
            total: 3170,
            items: [
                { productId: '1', name: '經典白色T恤', price: 590, quantity: 2 },
                { productId: '3', name: '運動休閒鞋', price: 2490, quantity: 1 }
            ],
            shippingAddress: '台北市信義區信義路五段7號',
            paymentMethod: 'credit',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-16T14:20:00Z'
        },
        {
            id: 'ORD002',
            userId: '2',
            customerName: 'user2',
            customerEmail: 'user2@example.com',
            status: 'shipped',
            total: 4470,
            items: [
                { productId: '4', name: '時尚手錶', price: 3580, quantity: 1 },
                { productId: '6', name: '皮革錢包', price: 890, quantity: 1 }
            ],
            shippingAddress: '新北市板橋區民權路158號',
            paymentMethod: 'credit',
            createdAt: '2024-01-16T14:15:00Z',
            updatedAt: '2024-01-17T09:30:00Z'
        },
        {
            id: 'ORD003',
            userId: '3',
            customerName: 'user3',
            customerEmail: 'user3@example.com',
            status: 'processing',
            total: 6280,
            items: [
                { productId: '5', name: '藍牙耳機', price: 4990, quantity: 1 },
                { productId: '2', name: '修身牛仔褲', price: 1290, quantity: 1 }
            ],
            shippingAddress: '台中市西屯區台灣大道三段99號',
            paymentMethod: 'bank_transfer',
            createdAt: '2024-01-17T16:45:00Z',
            updatedAt: '2024-01-17T16:45:00Z'
        },
        {
            id: 'ORD004',
            userId: '1',
            customerName: 'demo',
            customerEmail: 'demo@example.com',
            status: 'pending',
            total: 1480,
            items: [
                { productId: '6', name: '皮革錢包', price: 890, quantity: 1 },
                { productId: '1', name: '經典白色T恤', price: 590, quantity: 1 }
            ],
            shippingAddress: '台北市大安區忠孝東路四段169號',
            paymentMethod: 'credit',
            createdAt: '2024-01-18T11:20:00Z',
            updatedAt: '2024-01-18T11:20:00Z'
        },
        {
            id: 'ORD005',
            userId: '4',
            customerName: 'user4',
            customerEmail: 'user4@example.com',
            status: 'delivered',
            total: 7070,
            items: [
                { productId: '3', name: '運動休閒鞋', price: 2490, quantity: 1 },
                { productId: '4', name: '時尚手錶', price: 3580, quantity: 1 },
                { productId: '1', name: '經典白色T恤', price: 590, quantity: 2 }
            ],
            shippingAddress: '高雄市前金區中正四路211號',
            paymentMethod: 'cash_on_delivery',
            createdAt: '2024-01-14T08:30:00Z',
            updatedAt: '2024-01-18T10:15:00Z'
        }
    ],
    
    users: [
        {
            id: '1',
            username: 'demo',
            email: 'demo@example.com',
            status: 'active',
            createdAt: '2024-01-10T08:00:00Z',
            lastLogin: '2024-01-18T10:30:00Z'
        },
        {
            id: '2',
            username: 'user2',
            email: 'user2@example.com',
            status: 'active',
            createdAt: '2024-01-12T14:22:00Z',
            lastLogin: '2024-01-17T09:15:00Z'
        },
        {
            id: '3',
            username: 'user3',
            email: 'user3@example.com',
            status: 'active',
            createdAt: '2024-01-14T11:30:00Z',
            lastLogin: '2024-01-18T08:45:00Z'
        },
        {
            id: '4',
            username: 'user4',
            email: 'user4@example.com',
            status: 'inactive',
            createdAt: '2024-01-08T16:45:00Z',
            lastLogin: '2024-01-15T12:20:00Z'
        },
        {
            id: '5',
            username: 'user5',
            email: 'user5@example.com',
            status: 'active',
            createdAt: '2024-01-16T09:10:00Z',
            lastLogin: '2024-01-18T14:30:00Z'
        }
    ]
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('管理端頁面載入完成');
    
    // 初始化靜態資料
    products = ADMIN_MOCK_DATA.products;
    orders = ADMIN_MOCK_DATA.orders;
    users = ADMIN_MOCK_DATA.users;
    
    checkAdminAuth();
    bindEvents();
});

// 檢查管理員認證狀態
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (token && adminData) {
        currentAdmin = JSON.parse(adminData);
        showAdminInterface();
        updateAdminUI();
        loadDashboard();
    } else {
        showLoginPage();
    }
}

// 顯示登入頁面
function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('admin-interface').style.display = 'none';
}

// 顯示管理介面
function showAdminInterface() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-interface').style.display = 'flex';
}

// 更新管理員 UI
function updateAdminUI() {
    if (currentAdmin) {
        document.getElementById('admin-name').textContent = currentAdmin.username;
    }
}

// 綁定事件
function bindEvents() {
    // 管理員登入表單
    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
    
    // 新增商品表單
    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);
    
    // 編輯商品表單
    document.getElementById('edit-product-form').addEventListener('submit', handleEditProduct);
    
    // 訂單狀態篩選
    document.getElementById('order-status-filter').addEventListener('change', filterOrders);
    
    // 報表期間選擇
    document.getElementById('report-period').addEventListener('change', generateReport);
    
    // 設定表單
    document.getElementById('site-settings-form').addEventListener('submit', handleSiteSettings);
    document.getElementById('email-settings-form').addEventListener('submit', handleEmailSettings);
}

// 顯示管理區域
function showAdminSection(sectionId) {
    // 隱藏所有區域
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // 更新側邊欄選中狀態
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // 顯示指定區域
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // 更新側邊欄選中狀態
        const activeMenuItem = document.querySelector(`.menu-item[onclick="showAdminSection('${sectionId}')"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }
    }
    
    // 根據區域載入相應資料
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'reports':
            generateReport();
            break;
    }
}

// 載入儀表板資料
async function loadDashboard() {
    console.log('載入儀表板資料...');
    try {
        await Promise.all([
            loadStats(),
            loadRecentOrders(),
            loadPopularProducts()
        ]);
        console.log('儀表板資料載入完成！');
    } catch (error) {
        console.error('載入儀表板失敗:', error);
        showNotification('載入儀表板失敗', 'error');
    }
}

// 載入統計資料
async function loadStats() {
    console.log('載入統計資料...');
    try {
        // 使用靜態資料計算統計
        const totalUsers = ADMIN_MOCK_DATA.users.length;
        const totalProducts = ADMIN_MOCK_DATA.products.length;
        const totalOrders = ADMIN_MOCK_DATA.orders.length;
        const totalRevenue = ADMIN_MOCK_DATA.orders.reduce((sum, order) => sum + order.total, 0);
        
        // 計算本月統計
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyOrders = ADMIN_MOCK_DATA.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        
        stats = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            monthlyOrders: monthlyOrders.length,
            monthlyRevenue: monthlyOrders.reduce((sum, order) => sum + order.total, 0),
            activeProducts: ADMIN_MOCK_DATA.products.filter(p => p.stock > 0).length,
            lowStockProducts: ADMIN_MOCK_DATA.products.filter(p => p.stock <= 5).length
        };
        
        console.log('統計資料:', stats);
        updateStatsUI();
    } catch (error) {
        console.error('載入統計資料失敗:', error);
    }
}

// 更新統計資料 UI
function updateStatsUI() {
    // 基本統計
    const totalUsersElement = document.getElementById('total-users');
    const totalProductsElement = document.getElementById('total-products');
    const totalOrdersElement = document.getElementById('total-orders');
    const totalRevenueElement = document.getElementById('total-revenue');
    
    if (totalUsersElement) totalUsersElement.textContent = stats.totalUsers || 0;
    if (totalProductsElement) totalProductsElement.textContent = stats.totalProducts || 0;
    if (totalOrdersElement) totalOrdersElement.textContent = stats.totalOrders || 0;
    if (totalRevenueElement) totalRevenueElement.textContent = formatCurrency(stats.totalRevenue || 0);
    
    // 額外統計
    const monthlyOrdersElement = document.getElementById('monthly-orders');
    const monthlyRevenueElement = document.getElementById('monthly-revenue');
    const activeProductsElement = document.getElementById('active-products');
    const lowStockProductsElement = document.getElementById('low-stock-products');
    
    if (monthlyOrdersElement) monthlyOrdersElement.textContent = stats.monthlyOrders || 0;
    if (monthlyRevenueElement) monthlyRevenueElement.textContent = formatCurrency(stats.monthlyRevenue || 0);
    if (activeProductsElement) activeProductsElement.textContent = stats.activeProducts || 0;
    if (lowStockProductsElement) lowStockProductsElement.textContent = stats.lowStockProducts || 0;
}

// 載入最近訂單
async function loadRecentOrders() {
    try {
        // 使用靜態資料，取最近5筆訂單
        const recentOrders = ADMIN_MOCK_DATA.orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        displayRecentOrders(recentOrders);
    } catch (error) {
        console.error('載入最近訂單失敗:', error);
    }
}

// 顯示最近訂單
function displayRecentOrders(recentOrders) {
    const container = document.getElementById('recent-orders-chart');
    
    if (!container) {
        console.warn('找不到最近訂單容器');
        return;
    }
    
    if (recentOrders.length === 0) {
        container.innerHTML = '<p>暫無最近訂單</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="recent-orders-list">
            ${recentOrders.map(order => `
                <div class="recent-order-item">
                    <span class="order-id">#${order.id}</span>
                    <span class="customer-name">${order.customerName}</span>
                    <span class="order-amount">${formatCurrency(order.total)}</span>
                    <span class="order-status status-badge ${order.status}">${getStatusText(order.status)}</span>
                    <span class="order-date">${formatDate(order.createdAt)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// 載入熱門商品
async function loadPopularProducts() {
    try {
        // 使用靜態資料，按評分和評論數排序來模擬熱門商品
        const popularProducts = ADMIN_MOCK_DATA.products
            .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
            .slice(0, 5)
            .map((product, index) => ({
                ...product,
                salesCount: Math.floor(product.reviews * 0.6), // 模擬銷量
                rank: index + 1
            }));
        
        displayPopularProducts(popularProducts);
    } catch (error) {
        console.error('載入熱門商品失敗:', error);
    }
}

// 顯示熱門商品
function displayPopularProducts(popularProducts) {
    const container = document.getElementById('popular-products-chart');
    
    if (!container) {
        console.warn('找不到熱門商品容器');
        return;
    }
    
    if (popularProducts.length === 0) {
        container.innerHTML = '<p>暫無熱門商品資料</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="popular-products-list">
            ${popularProducts.map((product, index) => `
                <div class="popular-product-item">
                    <span class="product-rank">#${index + 1}</span>
                    <span class="product-name">${product.name}</span>
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <span class="product-sales">${product.salesCount || 0} 件</span>
                    <span class="product-rating">⭐ ${product.rating}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// 重新整理儀表板
function refreshDashboard() {
    loadDashboard();
    showNotification('儀表板已更新', 'success');
}

// 獲取管理員認證 headers
function getAdminAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// 處理 API 錯誤
function handleApiError(response) {
    if (response.status === 401) {
        // Token 過期或無效
        adminLogout();
        showNotification('登入已過期，請重新登入', 'error');
    } else if (response.status === 403) {
        showNotification('沒有權限執行此操作', 'error');
    } else {
        showNotification('操作失敗，請稍後再試', 'error');
    }
}

// 顯示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 顯示模態框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// 關閉模態框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // 清空表單
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// 點擊模態框外部關閉
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 格式化貨幣
function formatCurrency(amount) {
    return `NT$ ${amount.toLocaleString()}`;
}

// 獲取訂單狀態文字
function getStatusText(status) {
    const statusMap = {
        pending: '待處理',
        processing: '處理中',
        shipped: '已出貨',
        delivered: '已送達',
        completed: '已完成',
        cancelled: '已取消'
    };
    return statusMap[status] || status;
}

// 顯示載入狀態
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                載入中...
            </div>
        `;
    }
}

// 顯示空狀態
function showEmptyState(containerId, message, icon = 'fas fa-inbox') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="${icon}"></i>
                <h3>${message}</h3>
                <p>暫時沒有資料</p>
            </div>
        `;
    }
}

// 匯出資料為 CSV
function exportToCSV(data, filename) {
    const csv = convertArrayToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// 轉換陣列為 CSV 格式
function convertArrayToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

// 匯出訂單
function exportOrders() {
    if (orders.length === 0) {
        showNotification('沒有訂單資料可匯出', 'warning');
        return;
    }
    
    const exportData = orders.map(order => ({
        訂單編號: order.id,
        客戶ID: order.userId,
        總金額: order.totalAmount,
        狀態: getStatusText(order.status),
        訂單日期: formatDate(order.createdAt)
    }));
    
    exportToCSV(exportData, 'orders.csv');
    showNotification('訂單資料已匯出', 'success');
}

// 生成報表
function generateReport() {
    const period = document.getElementById('report-period').value;
    
    // 這裡可以實作更複雜的報表邏輯
    showNotification(`正在生成 ${period} 天的報表...`, 'info');
    
    // 模擬報表生成
    setTimeout(() => {
        showNotification('報表生成完成', 'success');
    }, 2000);
}

// 處理設定表單
function handleSiteSettings(event) {
    event.preventDefault();
    
    const siteName = document.getElementById('site-name').value;
    const siteDescription = document.getElementById('site-description').value;
    
    // 這裡可以實作儲存設定的邏輯
    showNotification('網站設定已儲存', 'success');
}

function handleEmailSettings(event) {
    event.preventDefault();
    
    const smtpServer = document.getElementById('smtp-server').value;
    const smtpPort = document.getElementById('smtp-port').value;
    
    // 這裡可以實作儲存設定的邏輯
    showNotification('郵件設定已儲存', 'success');
}

// 搜尋功能
function searchUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    
    if (searchTerm === '') {
        displayUsers(users);
        return;
    }
    
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    
    displayUsers(filteredUsers);
}

// 工具函數：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函數：節流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 確認對話框
function showConfirmDialog(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// 初始化管理介面
function initAdminInterface() {
    // 載入初始資料
    loadDashboard();
    
    // 設定定期重新整理
    setInterval(() => {
        if (currentAdmin) {
            loadStats();
        }
    }, 60000); // 每分鐘更新一次統計資料
    
    console.log('管理介面初始化完成');
}
