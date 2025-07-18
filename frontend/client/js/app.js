// 全域變數
let currentUser = null;
let cart = [];
let products = [];
let categories = [];

// API 基礎 URL（目前使用靜態資料，暫時保留供未來使用）
const API_BASE = 'http://localhost:5000/api';

// 靜態資料 - 模擬 API 回應
const MOCK_DATA = {
    categories: [
        { id: 'clothing', name: '服飾' },
        { id: 'shoes', name: '鞋類' },
        { id: 'accessories', name: '配件' },
        { id: 'electronics', name: '電子產品' }
    ],
    
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
            description: '精緻金屬錶帶，防水設計',
            price: 3580,
            image: 'https://via.placeholder.com/300x300/feca57/333?text=手錶',
            category: 'accessories',
            stock: 15,
            featured: true,
            rating: 4.6,
            reviews: 156
        },
        {
            id: '5',
            name: '藍牙耳機',
            description: '高音質無線耳機，降噪功能',
            price: 4990,
            image: 'https://via.placeholder.com/300x300/48dbfb/333?text=耳機',
            category: 'electronics',
            stock: 20,
            featured: false,
            rating: 4.4,
            reviews: 97
        },
        {
            id: '6',
            name: '皮革錢包',
            description: '真皮材質，多卡位設計',
            price: 890,
            image: 'https://via.placeholder.com/300x300/8b4513/fff?text=錢包',
            category: 'accessories',
            stock: 40,
            featured: false,
            rating: 4.2,
            reviews: 74
        }
    ],
    
    users: [
        {
            id: '1',
            username: 'demo',
            email: 'demo@example.com',
            password: 'demo123'
        }
    ]
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面載入完成，開始初始化...');
    
    // 初始化靜態資料
    categories = MOCK_DATA.categories;
    products = MOCK_DATA.products;
    
    // 直接顯示精選商品
    const featuredProducts = MOCK_DATA.products.filter(product => product.featured);
    console.log('精選商品數量:', featuredProducts.length);
    displayProducts(featuredProducts, 'featured-products-grid');
    
    // 直接顯示所有商品
    console.log('所有商品數量:', MOCK_DATA.products.length);
    displayProducts(MOCK_DATA.products, 'products-grid');
    
    // 載入分類
    loadCategories();
    
    // 檢查是否有儲存的使用者資訊
    checkAuthStatus();
    
    // 嘗試更新購物車 UI（如果函式存在）
    try {
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
    } catch (error) {
        console.log('購物車 UI 更新跳過:', error.message);
    }
    
    // 綁定表單事件
    bindFormEvents();
    
    // 載入購物車
    try {
        if (typeof loadCart === 'function') {
            loadCart();
        }
    } catch (error) {
        console.log('購物車載入跳過:', error.message);
    }
    
    // 設定搜尋功能
    setupSearch();
    
    console.log('初始化完成！');
});

// 檢查認證狀態
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateAuthUI();
        loadOrders();
    }
}

// 更新認證相關的 UI
function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const username = document.getElementById('username');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'block';
        username.textContent = `歡迎, ${currentUser.username}`;
    } else {
        authButtons.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

// 顯示指定的區域
function showSection(sectionId) {
    // 隱藏所有區域
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // 顯示指定區域
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 根據區域載入相應資料
    switch(sectionId) {
        case 'products':
            loadProducts();
            break;
        case 'cart':
            updateCartUI();
            break;
        case 'orders':
            if (currentUser) {
                loadOrders();
            } else {
                showNotification('請先登入查看訂單', 'error');
                showSection('home');
            }
            break;
    }
}

// 載入分類資料
async function loadCategories() {
    try {
        // 使用靜態資料
        categories = MOCK_DATA.categories;
        
        // 更新分類選擇器
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">所有分類</option>';
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('載入分類失敗:', error);
    }
}

// 載入商品資料
async function loadProducts(category = '', search = '') {
    try {
        showLoading('products-grid');
        
        // 使用靜態資料進行篩選
        let filteredProducts = [...MOCK_DATA.products];
        
        // 分類篩選
        if (category && category !== '') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        // 搜尋篩選
        if (search && search.trim() !== '') {
            const searchTerm = search.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // 更新全域商品變數
        products = filteredProducts;
        
        // 稍微延遲顯示商品，讓使用者看到載入效果
        setTimeout(() => {
            displayProducts(filteredProducts, 'products-grid');
        }, 500);
        
    } catch (error) {
        console.error('載入商品失敗:', error);
        showNotification('載入商品失敗', 'error');
    }
}

// 載入精選商品
async function loadFeaturedProducts() {
    try {
        // 使用靜態資料篩選精選商品
        const featuredProducts = MOCK_DATA.products.filter(product => product.featured);
        
        displayProducts(featuredProducts, 'featured-products-grid');
    } catch (error) {
        console.error('載入精選商品失敗:', error);
    }
}

// 顯示商品
function displayProducts(productList, containerId) {
    console.log(`正在顯示商品到容器 ${containerId}，商品數量: ${productList.length}`);
    
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`容器 ${containerId} 不存在`);
        return;
    }
    
    console.log(`找到容器: ${containerId}`);
    
    if (productList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>沒有找到商品</h3>
                <p>請嘗試調整搜尋條件</p>
            </div>
        `;
        return;
    }
    
    const productsHTML = productList.map(product => {
        console.log(`處理商品: ${product.name}`);
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="image-placeholder" style="display:none;">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">NT$ ${product.price.toLocaleString()}</div>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)} 
                        <span class="rating-text">(${product.reviews} 評價)</span>
                    </div>
                    <div class="product-stock ${product.stock <= 5 ? 'low-stock' : ''}">
                        庫存: ${product.stock}
                    </div>
                    <div class="product-actions">
                        <button class="btn-primary" onclick="addToCartSimple('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.stock === 0 ? '缺貨' : '加入購物車'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = productsHTML;
    console.log(`商品已顯示到容器 ${containerId}`);
}

// 搜尋商品
function searchProducts() {
    const category = document.getElementById('category-filter').value;
    const search = document.getElementById('search-input').value;
    
    loadProducts(category, search);
}

// 綁定表單事件
function bindFormEvents() {
    // 登入表單
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 註冊表單
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // 結帳表單
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// 設定搜尋功能
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const searchButton = document.getElementById('search-button');
    
    // 搜尋按鈕點擊事件
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }
    
    // 輸入框 Enter 事件
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
        
        // 即時搜尋（防抖）
        searchInput.addEventListener('input', debounce(searchProducts, 300));
    }
    
    // 分類篩選變更事件
    if (categoryFilter) {
        categoryFilter.addEventListener('change', searchProducts);
    }
}

// 顯示載入狀態
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>載入中...</p>
            </div>
        `;
    }
}

// 隱藏載入中狀態
function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loading = container.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
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
    }
}

// 顯示登入模態框
function showLoginModal() {
    showModal('login-modal');
}

// 顯示註冊模態框
function showRegisterModal() {
    showModal('register-modal');
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

// 工具函數：深拷貝
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
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

// 工具函數：產生星級評分
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHTML = '';
    
    // 滿星
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // 半星
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // 空星
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return `<div class="star-rating">${starsHTML}</div>`;
}

// 載入購物車
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// 儲存購物車
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 初始化頁面
function init() {
    // 設定預設顯示首頁
    showSection('home');
    
    // 其他初始化邏輯
    console.log('線上商店初始化完成');
}

// 簡化的加入購物車函式（備用）
function addToCartSimple(productId) {
    console.log(`嘗試加入商品到購物車: ${productId}`);
    
    // 如果有完整的 addToCart 函式，使用它
    if (typeof addToCart === 'function') {
        addToCart(productId);
        return;
    }
    
    // 否則使用簡化版本
    const product = MOCK_DATA.products.find(p => p.id === productId);
    if (!product) {
        console.error('商品不存在');
        return;
    }
    
    // 簡單通知
    if (typeof showNotification === 'function') {
        showNotification(`${product.name} 已加入購物車`, 'success');
    } else {
        alert(`${product.name} 已加入購物車`);
    }
    
    console.log(`商品 ${product.name} 已加入購物車`);
}
