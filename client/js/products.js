// 商品和訂單相關功能

// 載入訂單
async function loadOrders() {
    if (!checkLogin()) return;
    
    try {
        showLoading('orders-list');
        
        // 使用靜態資料，依照當前使用者過濾
        const currentUser = getCurrentUser();
        const userOrders = MOCK_DATA.orders.filter(order => order.userId === currentUser.id);
        displayOrders(userOrders);
    } catch (error) {
        console.error('載入訂單失敗:', error);
        showNotification('載入訂單失敗', 'error');
    }
}

// 顯示訂單
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>暫無訂單</h3>
                <p>您還沒有任何訂單記錄</p>
                <button class="btn-primary" onclick="showSection('products')">立即購物</button>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">訂單編號: ${order.id}</div>
                <div class="order-date">${formatDate(order.createdAt)}</div>
                <div class="order-status ${order.status}">${getStatusText(order.status)}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.productName} x ${item.quantity}</span>
                        <span>NT$ ${(item.productPrice * item.quantity).toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-shipping">
                <strong>配送資訊:</strong><br>
                ${order.shippingAddress.name}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.phone}
            </div>
            <div class="order-total">
                總計: NT$ ${order.totalAmount.toLocaleString()}
            </div>
            <div class="order-actions">
                ${getOrderActions(order)}
            </div>
        </div>
    `).join('');
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

// 獲取訂單操作按鈕
function getOrderActions(order) {
    let actions = [];
    
    switch (order.status) {
        case 'pending':
            actions.push(`<button class="btn-danger" onclick="cancelOrder('${order.id}')">取消訂單</button>`);
            break;
        case 'delivered':
            actions.push(`<button class="btn-primary" onclick="confirmOrder('${order.id}')">確認收貨</button>`);
            break;
        case 'completed':
            actions.push(`<button class="btn-secondary" onclick="reorderItems('${order.id}')">重新訂購</button>`);
            break;
    }
    
    return actions.join(' ');
}

// 取消訂單
async function cancelOrder(orderId) {
    if (!confirm('確定要取消此訂單嗎？')) return;
    
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showNotification('訂單已取消', 'success');
            loadOrders();
        } else {
            const error = await response.json();
            showNotification(error.error || '取消訂單失敗', 'error');
        }
    } catch (error) {
        console.error('取消訂單失敗:', error);
        showNotification('取消訂單失敗', 'error');
    }
}

// 確認收貨
async function confirmOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/confirm`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showNotification('已確認收貨', 'success');
            loadOrders();
        } else {
            const error = await response.json();
            showNotification(error.error || '確認收貨失敗', 'error');
        }
    } catch (error) {
        console.error('確認收貨失敗:', error);
        showNotification('確認收貨失敗', 'error');
    }
}

// 重新訂購
async function reorderItems(orderId) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const order = await response.json();
            
            // 將訂單商品加入購物車
            order.items.forEach(item => {
                addToCart(item.productId, item.quantity);
            });
            
            showNotification('商品已加入購物車', 'success');
            showSection('cart');
        } else {
            const error = await response.json();
            showNotification(error.error || '重新訂購失敗', 'error');
        }
    } catch (error) {
        console.error('重新訂購失敗:', error);
        showNotification('重新訂購失敗', 'error');
    }
}

// 商品詳情
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="product-detail">
                <div class="product-detail-image">
                    <i class="fas fa-image"></i>
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-price">NT$ ${product.price.toLocaleString()}</div>
                    <div class="product-detail-stock">庫存: ${product.stock}</div>
                    <div class="product-detail-category">分類: ${getCategoryName(product.category)}</div>
                    <div class="product-detail-actions">
                        <div class="quantity-selector">
                            <label>數量:</label>
                            <input type="number" id="product-quantity" value="1" min="1" max="${product.stock}">
                        </div>
                        <button class="btn-primary" onclick="addToCartFromDetail('${product.id}')">
                            加入購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// 從商品詳情加入購物車
function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('product-quantity').value);
    addToCart(productId, quantity);
    
    // 關閉模態框
    const modal = document.querySelector('.modal:last-child');
    if (modal) modal.remove();
}

// 獲取分類名稱
function getCategoryName(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

// 商品收藏功能
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(productId) {
    if (!checkLogin()) return;
    
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('已從收藏中移除', 'info');
    } else {
        favorites.push(productId);
        showNotification('已加入收藏', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        const productId = button.dataset.productId;
        const isFavorite = favorites.includes(productId);
        button.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        button.classList.toggle('active', isFavorite);
    });
}

// 商品評價功能
async function loadProductReviews(productId) {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}/reviews`);
        if (response.ok) {
            const reviews = await response.json();
            displayProductReviews(reviews);
        }
    } catch (error) {
        console.error('載入評價失敗:', error);
    }
}

function displayProductReviews(reviews) {
    const reviewsContainer = document.getElementById('product-reviews');
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>暫無評價</p>';
        return;
    }
    
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-date">${formatDate(review.createdAt)}</span>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <div class="review-content">${review.content}</div>
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

// 提交商品評價
async function submitReview(productId, rating, content) {
    if (!checkLogin()) return;
    
    try {
        const response = await fetch(`${API_BASE}/products/${productId}/reviews`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ rating, content })
        });
        
        if (response.ok) {
            showNotification('評價已提交', 'success');
            loadProductReviews(productId);
        } else {
            const error = await response.json();
            showNotification(error.error || '提交評價失敗', 'error');
        }
    } catch (error) {
        console.error('提交評價失敗:', error);
        showNotification('提交評價失敗', 'error');
    }
}

// 商品搜尋建議
function setupSearchSuggestions() {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchInput.parentElement.appendChild(suggestionsContainer);
    
    const debouncedSearch = debounce(async (query) => {
        if (query.length < 2) {
            suggestionsContainer.innerHTML = '';
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/products/search-suggestions?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const suggestions = await response.json();
                displaySearchSuggestions(suggestions, suggestionsContainer);
            }
        } catch (error) {
            console.error('載入搜尋建議失敗:', error);
        }
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
    
    // 點擊外部關閉建議
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.innerHTML = '';
        }
    });
}

function displaySearchSuggestions(suggestions, container) {
    container.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.name}')">
            <i class="fas fa-search"></i>
            <span>${suggestion.name}</span>
        </div>
    `).join('');
}

function selectSuggestion(productName) {
    document.getElementById('search-input').value = productName;
    searchProducts();
    document.querySelector('.search-suggestions').innerHTML = '';
}

// 商品排序
function sortProducts(sortBy) {
    let sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        default:
            // 預設排序
            break;
    }
    
    displayProducts(sortedProducts, 'products-grid');
}

// 初始化商品相關功能
document.addEventListener('DOMContentLoaded', function() {
    setupSearchSuggestions();
    updateFavoriteButtons();
});
