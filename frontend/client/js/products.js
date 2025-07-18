// 商品和訂單相關功能（更新版，包含評論和評分功能）

// 全域變數
let productReviews = JSON.parse(localStorage.getItem("productReviews")) || [];

// 載入訂單
async function loadOrders() {
    if (!checkLogin()) return;
    
    try {
        showLoading("orders-list");
        // 使用靜態資料，依照當前使用者過濾
        const currentUser = getCurrentUser();
        const userOrders = MOCK_DATA.orders.filter(order => order.userId === currentUser.id);
        displayOrders(userOrders);
    } catch (error) {
        console.error("載入訂單失敗:", error);
        showNotification("載入訂單失敗", "error");
    }
}

// 顯示訂單
function displayOrders(orders) {
    const ordersContainer = document.getElementById("orders-list");
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>暫無訂單</h3>
                <p>您還沒有任何訂單記錄</p>
                <button class="btn-primary" onclick="showSection(\"products\")">立即購物</button>
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
                `).join("")}
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
    `).join("");
}

// 獲取訂單狀態文字
function getStatusText(status) {
    const statusMap = {
        pending: "待處理",
        processing: "處理中",
        shipped: "已出貨",
        delivered: "已送達",
        completed: "已完成",
        cancelled: "已取消"
    };
    return statusMap[status] || status;
}

// 獲取訂單操作按鈕
function getOrderActions(order) {
    let actions = [];
    switch (order.status) {
        case "pending":
            actions.push(`<button class="btn-danger" onclick="cancelOrder(\"${order.id}\")">取消訂單</button>`);
            break;
        case "delivered":
            actions.push(`<button class="btn-primary" onclick="confirmOrder(\"${order.id}\")">確認收貨</button>`);
            break;
        case "completed":
            actions.push(`<button class="btn-secondary" onclick="reorderItems(\"${order.id}\")">重新訂購</button>`);
            break;
    }
    return actions.join(" ");
}

// 取消訂單
async function cancelOrder(orderId) {
    if (!confirm("確定要取消此訂單嗎？")) return;
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        if (response.ok) {
            showNotification("訂單已取消", "success");
            loadOrders();
        } else {
            const error = await response.json();
            showNotification(error.error || "取消訂單失敗", "error");
        }
    } catch (error) {
        console.error("取消訂單失敗:", error);
        showNotification("取消訂單失敗", "error");
    }
}

// 確認收貨
async function confirmOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/confirm`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        if (response.ok) {
            showNotification("已確認收貨", "success");
            loadOrders();
        } else {
            const error = await response.json();
            showNotification(error.error || "確認收貨失敗", "error");
        }
    } catch (error) {
        console.error("確認收貨失敗:", error);
        showNotification("確認收貨失敗", "error");
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
            showNotification("商品已加入購物車", "success");
            showSection("cart");
        } else {
            const error = await response.json();
            showNotification(error.error || "重新訂購失敗", "error");
        }
    } catch (error) {
        console.error("重新訂購失敗:", error);
        showNotification("重新訂購失敗", "error");
    }
}

// 商品詳情頁面（包含評分和評論功能）
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement("div");
    modal.className = "modal product-detail-modal";
    modal.innerHTML = `
        <div class="modal-content product-detail-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            
            <div class="product-detail">
                <!-- 商品基本資訊 -->
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src=\"https://via.placeholder.com/400x400/f0f0f0/333?text=商品圖片\"">
                </div>
                
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="product-detail-description">${product.description}</p>
                    
                    <div class="product-rating-display">
                        <div class="stars">
                            ${generateStars(product.rating || 0)}
                        </div>
                        <span class="rating-text">${product.rating || 0}/5 (${product.reviews || 0} 評論)</span>
                    </div>
                    
                    <div class="product-detail-price">NT$ ${product.price.toLocaleString()}</div>
                    <div class="product-detail-stock">庫存: ${product.stock}</div>
                    <div class="product-detail-category">分類: ${getCategoryName(product.category)}</div>
                    
                    <div class="product-detail-actions">
                        <div class="quantity-selector">
                            <label>數量:</label>
                            <input type="number" id="product-quantity" value="1" min="1" max="${product.stock}">
                        </div>
                        <button class="btn-primary" onclick="addToCartFromDetail(\"${product.id}\")">
                            <i class="fas fa-cart-plus"></i> 加入購物車
                        </button>
                        <button class="btn-secondary favorite-btn" data-product-id="${product.id}" onclick="toggleFavorite(\"${product.id}\")">
                            <i class="far fa-heart"></i> 收藏
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 分頁標籤 -->
            <div class="product-tabs">
                <button class="tab-button active" onclick="showTab(event, \"reviews\")">評論 (${product.reviews || 0})</button>
                <button class="tab-button" onclick="showTab(event, \"details\")">商品詳情</button>
            </div>
            
            <!-- 評論區域 -->
            <div id="reviews-tab" class="tab-content active">
                <div class="reviews-section">
                    <h3>顧客評論</h3>
                    
                    <!-- 評分統計 -->
                    <div class="rating-summary">
                        <div class="average-rating">
                            <span class="rating-score">${product.rating || 0}</span>
                            <div class="rating-stars">
                                ${generateStars(product.rating || 0)}
                            </div>
                            <span class="rating-count">共 ${product.reviews || 0} 則評論</span>
                        </div>
                        <div class="rating-breakdown">
                            ${generateRatingBreakdown(product.id)}
                        </div>
                    </div>
                    
                    <!-- 評論表單 -->
                    <div class="review-form-section">
                        <h4>分享您的評論</h4>
                        <form id="review-form-${product.id}" class="review-form">
                            <div class="rating-input">
                                <label>您的評分:</label>
                                <div class="star-rating">
                                    <input type="radio" name="rating" value="5" id="star5-${product.id}">
                                    <label for="star5-${product.id}"><i class="fas fa-star"></i></label>
                                    <input type="radio" name="rating" value="4" id="star4-${product.id}">
                                    <label for="star4-${product.id}"><i class="fas fa-star"></i></label>
                                    <input type="radio" name="rating" value="3" id="star3-${product.id}">
                                    <label for="star3-${product.id}"><i class="fas fa-star"></i></label>
                                    <input type="radio" name="rating" value="2" id="star2-${product.id}">
                                    <label for="star2-${product.id}"><i class="fas fa-star"></i></label>
                                    <input type="radio" name="rating" value="1" id="star1-${product.id}">
                                    <label for="star1-${product.id}"><i class="fas fa-star"></i></label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="review-title-${product.id}">評論標題:</label>
                                <input type="text" id="review-title-${product.id}" placeholder="請輸入評論標題..." required>
                            </div>
                            
                            <div class="form-group">
                                <label for="review-content-${product.id}">評論內容:</label>
                                <textarea id="review-content-${product.id}" rows="4" placeholder="請分享您的使用心得..." required></textarea>
                            </div>
                            
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-paper-plane"></i> 提交評論
                            </button>
                        </form>
                    </div>
                    
                    <!-- 評論列表 -->
                    <div id="reviews-list-${product.id}" class="reviews-list">
                        <!-- 評論將在這裡動態載入 -->
                    </div>
                </div>
            </div>
            
            <!-- 商品詳情區域 -->
            <div id="details-tab" class="tab-content">
                <div class="product-specifications">
                    <h3>商品規格</h3>
                    <table class="spec-table">
                        <tr>
                            <td>商品名稱</td>
                            <td>${product.name}</td>
                        </tr>
                        <tr>
                            <td>商品分類</td>
                            <td>${getCategoryName(product.category)}</td>
                        </tr>
                        <tr>
                            <td>價格</td>
                            <td>NT$ ${product.price.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>庫存狀態</td>
                            <td>${product.stock > 0 ? "有庫存" : "缺貨"}</td>
                        </tr>
                        <tr>
                            <td>建立日期</td>
                            <td>${formatDate(product.createdAt || new Date())}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "block";
    
    // 初始化評論表單
    initializeReviewForm(product.id);
    
    // 載入評論
    loadProductReviews(product.id);
    
    // 更新收藏按鈕狀態
    updateFavoriteButtons();
}

// 標籤切換功能
function showTab(event, tabName) {
    // 移除所有活動狀態
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
    
    // 添加活動狀態
    event.target.classList.add("active");
    document.getElementById(`${tabName}-tab`).classList.add("active");
}

// 初始化評論表單
function initializeReviewForm(productId) {
    const form = document.getElementById(`review-form-${productId}`);
    if (!form) return;
    
    // 星級評分互動
    const starInputs = form.querySelectorAll(".star-rating input");
    const starLabels = form.querySelectorAll(".star-rating label");
    
    starLabels.forEach((label, index) => {
        label.addEventListener("mouseover", () => {
            highlightStars(starLabels, starInputs.length - index);
        });
        
        label.addEventListener("mouseout", () => {
            const checkedStar = form.querySelector(".star-rating input:checked");
            const rating = checkedStar ? parseInt(checkedStar.value) : 0;
            highlightStars(starLabels, rating);
        });
    });
    
    // 表單提交處理
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleReviewSubmission(productId);
    });
}

// 星級高亮效果
function highlightStars(labels, rating) {
    labels.forEach((label, index) => {
        const starIndex = labels.length - index;
        label.classList.toggle("highlighted", starIndex <= rating);
    });
}

// 處理評論提交
async function handleReviewSubmission(productId) {
    if (!checkLogin()) {
        showNotification("請先登入後再發表評論", "warning");
        return;
    }
    
    const form = document.getElementById(`review-form-${productId}`);
    const rating = form.querySelector("input[name=\"rating\"]:checked")?.value;
    const title = form.querySelector(`#review-title-${productId}`).value;
    const content = form.querySelector(`#review-content-${productId}`).value;
    
    if (!rating) {
        showNotification("請選擇評分", "warning");
        return;
    }
    
    if (!title.trim() || !content.trim()) {
        showNotification("請填寫評論標題和內容", "warning");
        return;
    }
    
    try {
        // 模擬提交評論（實際應該呼叫 API）
        const currentUser = getCurrentUser();
        const newReview = {
            id: Date.now().toString(),
            productId: productId,
            userId: currentUser.id,
            userName: currentUser.username,
            rating: parseInt(rating),
            title: title,
            content: content,
            createdAt: new Date().toISOString(),
            helpful: 0
        };
        
        // 儲存到 localStorage（實際應該發送到後端）
        let reviews = JSON.parse(localStorage.getItem("productReviews")) || [];
        reviews.push(newReview);
        localStorage.setItem("productReviews", JSON.stringify(reviews));
        
        // 更新產品評分
        updateProductRating(productId, parseInt(rating));
        
        showNotification("評論提交成功！", "success");
        
        // 清空表單
        form.reset();
        
        // 重新載入評論
        loadProductReviews(productId);
        
    } catch (error) {
        console.error("提交評論失敗:", error);
        showNotification("提交評論失敗，請稍後再試", "error");
    }
}

// 更新產品評分
function updateProductRating(productId, newRating) {
    const reviews = JSON.parse(localStorage.getItem("productReviews")) || [];
    const productReviews = reviews.filter(review => review.productId === productId);
    
    if (productReviews.length === 0) return;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / productReviews.length).toFixed(1);
    
    // 更新產品資料
    const product = products.find(p => p.id === productId);
    if (product) {
        product.rating = parseFloat(averageRating);
        product.reviews = productReviews.length;
    }
}

// 載入商品評論
function loadProductReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem("productReviews")) || [];
    const productReviews = reviews.filter(review => review.productId === productId);
    
    displayProductReviews(productReviews, productId);
}

// 顯示商品評論
function displayProductReviews(reviews, productId) {
    const reviewsContainer = document.getElementById(`reviews-list-${productId}`);
    if (!reviewsContainer) return;
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-comments"></i>
                <p>暫時沒有評論，成為第一個評論者吧！</p>
            </div>
        `;
        return;
    }
    
    // 按時間排序（最新在前）
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <span class="reviewer-name">${review.userName}</span>
                        <span class="review-date">${formatDate(review.createdAt)}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <div class="review-content">
                <h4 class="review-title">${review.title}</h4>
                <p class="review-text">${review.content}</p>
            </div>
            <div class="review-actions">
                <button class="btn-link" onclick="toggleReviewHelpful(\"${review.id}\")">
                    <i class="fas fa-thumbs-up"></i> 有幫助 (${review.helpful || 0})
                </button>
                <button class="btn-link" onclick="reportReview(\"${review.id}\")">
                    <i class="fas fa-flag"></i> 檢舉
                </button>
            </div>
        </div>
    `).join("");
}

// 產生評分分佈
function generateRatingBreakdown(productId) {
    const reviews = JSON.parse(localStorage.getItem("productReviews")) || [];
    const productReviews = reviews.filter(review => review.productId === productId);
    
    if (productReviews.length === 0) {
        return "<p>暫無評分資料</p>";
    }
    
    const ratingCounts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    productReviews.forEach(review => {
        ratingCounts[review.rating]++;
    });
    
    const totalReviews = productReviews.length;
    
    return Object.entries(ratingCounts).reverse().map(([rating, count]) => {
        const percentage = totalReviews > 0 ? (count / totalReviews * 100).toFixed(1) : 0;
        return `
            <div class="rating-bar">
                <span class="rating-label">${rating}星</span>
                <div class="rating-progress">
                    <div class="rating-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="rating-count">${count}</span>
            </div>
        `;
    }).join("");
}

// 評論有幫助功能
function toggleReviewHelpful(reviewId) {
    if (!checkLogin()) {
        showNotification("請先登入", "warning");
        return;
    }
    
    let reviews = JSON.parse(localStorage.getItem("productReviews")) || [];
    const review = reviews.find(r => r.id === reviewId);
    
    if (review) {
        review.helpful = (review.helpful || 0) + 1;
        localStorage.setItem("productReviews", JSON.stringify(reviews));
        
        // 更新顯示
        const helpfulBtn = document.querySelector(`button[onclick="toggleReviewHelpful(\"${reviewId}\")"]`);
        if (helpfulBtn) {
            helpfulBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> 有幫助 (${review.helpful})`;
        }
        
        showNotification("感謝您的回饋！", "success");
    }
}

// 檢舉評論
function reportReview(reviewId) {
    if (!checkLogin()) {
        showNotification("請先登入", "warning");
        return;
    }
    
    if (confirm("確定要檢舉此評論嗎？")) {
        // 實際應該發送檢舉請求到後端
        showNotification("檢舉已提交，我們會盡快處理", "info");
    }
}

// 從商品詳情加入購物車
function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById("product-quantity").value);
    addToCart(productId, quantity);
    // 關閉模態框
    const modal = document.querySelector(".modal:last-child");
    if (modal) modal.remove();
}

// 獲取分類名稱
function getCategoryName(categoryId) {
    const categories = {
        "clothing": "服飾",
        "shoes": "鞋類",
        "accessories": "配件",
        "electronics": "電子產品"
    };
    return categories[categoryId] || categoryId;
}

// 商品收藏功能
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function toggleFavorite(productId) {
    if (!checkLogin()) return;
    
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification("已從收藏中移除", "info");
    } else {
        favorites.push(productId);
        showNotification("已加入收藏", "success");
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll(".favorite-btn");
    favoriteButtons.forEach(button => {
        const productId = button.dataset.productId;
        const isFavorite = favorites.includes(productId);
        button.innerHTML = isFavorite ? "<i class=\"fas fa-heart\"></i>" : "<i class=\"far fa-heart\"></i>";
        button.classList.toggle("active", isFavorite);
    });
}

// 優化星級生成函式
function generateStars(rating) {
    let stars = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += "<i class=\"fas fa-star\"></i>";
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += "<i class=\"fas fa-star-half-alt\"></i>";
        } else {
            stars += "<i class=\"far fa-star\"></i>";
        }
    }
    return stars;
}

// 商品搜尋建議
function setupSearchSuggestions() {
    const searchInput = document.getElementById("search-input");
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.className = "search-suggestions";
    searchInput.parentElement.appendChild(suggestionsContainer);
    
    const debouncedSearch = debounce(async (query) => {
        if (query.length < 2) {
            suggestionsContainer.innerHTML = "";
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/products/search-suggestions?q=${encodeURIComponent(query)}`);        
            if (response.ok) {
                const suggestions = await response.json();
                displaySearchSuggestions(suggestions, suggestionsContainer);
            }
        } catch (error) {
            console.error("載入搜尋建議失敗:", error);
        }
    }, 300);
    
    searchInput.addEventListener("input", (e) => {
        debouncedSearch(e.target.value);
    });
    
    // 點擊外部關閉建議
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.innerHTML = "";
        }
    });
}

function displaySearchSuggestions(suggestions, container) {
    container.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion(\"${suggestion.name}\")">
            <i class="fas fa-search"></i>
            <span>${suggestion.name}</span>
        </div>
    `).join("");
}

function selectSuggestion(productName) {
    document.getElementById("search-input").value = productName;
    searchProducts();
    document.querySelector(".search-suggestions").innerHTML = "";
}

// 商品排序
function sortProducts(sortBy) {
    let sortedProducts = [...products];
    switch (sortBy) {
        case "price-low":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case "name":
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "newest":
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        default:
            // 預設排序
            break;
    }
    displayProducts(sortedProducts, "products-grid");
}

// 防抖函式
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

// 初始化商品相關功能
document.addEventListener("DOMContentLoaded", function() {
    setupSearchSuggestions();
    updateFavoriteButtons();
});
