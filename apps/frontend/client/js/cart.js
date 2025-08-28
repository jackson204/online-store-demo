// 購物車相關功能

// 加入商品到購物車
function addToCart(productId, quantity = 1) {
    // 從 MOCK_DATA 中尋找商品
    const product = MOCK_DATA.products.find(p => p.id === productId);
    if (!product) {
        showNotification('商品不存在', 'error');
        return;
    }
    
    if (product.stock < quantity) {
        showNotification('庫存不足', 'error');
        return;
    }
    
    // 檢查購物車中是否已有此商品
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        // 更新數量
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            showNotification('數量超過庫存限制', 'error');
            return;
        }
        existingItem.quantity = newQuantity;
    } else {
        // 新增商品到購物車
        cart.push({
            productId: productId,
            productName: product.name,
            productPrice: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('商品已加入購物車', 'success');
}

// 從購物車移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartUI();
    showNotification('商品已從購物車移除', 'info');
}

// 更新購物車商品數量
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
        showNotification('數量超過庫存限制', 'error');
        return;
    }
    
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = quantity;
    saveCart();
    updateCartUI();
}

// 清空購物車
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showNotification('購物車已清空', 'info');
}

// 更新購物車 UI
function updateCartUI() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

// 更新購物車圖示數量
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// 更新購物車商品列表
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>購物車是空的</h3>
                <p>快去挑選您喜歡的商品吧！</p>
                <button class="btn-primary" onclick="showSection('products')">開始購物</button>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas fa-image"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.productName}</div>
                <div class="cart-item-price">NT$ ${item.productPrice}</div>
            </div>
            <div class="cart-item-controls">
                <button class="btn-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       min="1" onchange="updateCartQuantity('${item.productId}', parseInt(this.value))">
                <button class="btn-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                <button class="btn-danger" onclick="removeFromCart('${item.productId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 更新購物車總計
function updateCartTotal() {
    const totalAmountElement = document.getElementById('total-amount');
    const total = cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    totalAmountElement.textContent = total.toLocaleString();
}

// 結帳
function checkout() {
    if (!checkLogin()) return;
    
    if (cart.length === 0) {
        showNotification('購物車是空的', 'error');
        return;
    }
    
    // 檢查庫存
    const stockErrors = [];
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
            stockErrors.push(item.productName);
        }
    });
    
    if (stockErrors.length > 0) {
        showNotification(`以下商品庫存不足: ${stockErrors.join(', ')}`, 'error');
        return;
    }
    
    // 準備結帳資料
    prepareCheckoutModal();
    showModal('checkout-modal');
}

// 準備結帳模態框
function prepareCheckoutModal() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // 顯示訂單商品
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.productName} x ${item.quantity}</span>
            <span>NT$ ${(item.productPrice * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    // 顯示總金額
    const total = cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    checkoutTotal.textContent = total.toLocaleString();
}

// 處理結帳
async function handleCheckout(event) {
    event.preventDefault();
    
    if (!checkLogin()) return;
    
    const shippingName = document.getElementById('shipping-name').value;
    const shippingAddress = document.getElementById('shipping-address').value;
    const shippingPhone = document.getElementById('shipping-phone').value;
    
    if (!shippingName || !shippingAddress || !shippingPhone) {
        showNotification('請填寫所有配送資訊', 'error');
        return;
    }
    
    const orderData = {
        items: cart.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0),
        shippingAddress: {
            name: shippingName,
            address: shippingAddress,
            phone: shippingPhone
        }
    };
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const order = await response.json();
            
            // 清空購物車
            clearCart();
            
            // 關閉結帳模態框
            closeModal('checkout-modal');
            
            // 顯示成功訊息
            showNotification('訂單建立成功！', 'success');
            
            // 切換到訂單頁面
            showSection('orders');
            loadOrders();
            
            // 重新載入商品資料（更新庫存）
            loadProducts();
        } else {
            const error = await response.json();
            showNotification(error.error || '訂單建立失敗', 'error');
        }
    } catch (error) {
        console.error('結帳失敗:', error);
        showNotification('結帳失敗，請稍後再試', 'error');
    }
    
    // 清空表單
    document.getElementById('checkout-form').reset();
}

// 計算購物車總重量（用於運費計算）
function calculateCartWeight() {
    // 假設每個商品重量為 0.5 公斤
    return cart.reduce((sum, item) => sum + (item.quantity * 0.5), 0);
}

// 計算運費
function calculateShippingFee(weight = null) {
    if (weight === null) {
        weight = calculateCartWeight();
    }
    
    // 基本運費規則
    if (weight <= 1) return 60;
    if (weight <= 3) return 80;
    if (weight <= 5) return 100;
    return 120;
}

// 套用優惠券
async function applyCoupon(couponCode) {
    if (!checkLogin()) return;
    
    try {
        const response = await fetch(`${API_BASE}/coupons/verify`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ code: couponCode })
        });
        
        if (response.ok) {
            const coupon = await response.json();
            
            // 計算折扣
            const subtotal = cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
            let discount = 0;
            
            if (coupon.type === 'percentage') {
                discount = subtotal * (coupon.value / 100);
            } else if (coupon.type === 'fixed') {
                discount = coupon.value;
            }
            
            // 更新購物車顯示
            updateCartWithDiscount(discount, coupon);
            
            showNotification(`優惠券已套用！折扣 NT$ ${discount}`, 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || '優惠券無效', 'error');
        }
    } catch (error) {
        console.error('套用優惠券失敗:', error);
        showNotification('套用優惠券失敗', 'error');
    }
}

// 更新購物車顯示（包含折扣）
function updateCartWithDiscount(discount, coupon) {
    const cartSummary = document.querySelector('.cart-summary');
    const subtotal = cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    const total = subtotal - discount;
    
    cartSummary.innerHTML = `
        <div class="cart-breakdown">
            <div class="subtotal">
                <span>小計:</span>
                <span>NT$ ${subtotal.toLocaleString()}</span>
            </div>
            <div class="discount">
                <span>優惠券折扣 (${coupon.code}):</span>
                <span>-NT$ ${discount.toLocaleString()}</span>
            </div>
            <div class="total-amount">
                <h3>總計: NT$ <span id="total-amount">${total.toLocaleString()}</span></h3>
            </div>
        </div>
        <button class="btn-primary" onclick="checkout()">結帳</button>
    `;
}

// 儲存購物車到伺服器（如果使用者已登入）
async function syncCartToServer() {
    if (!currentUser) return;
    
    try {
        await fetch(`${API_BASE}/cart/sync`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ cart })
        });
    } catch (error) {
        console.error('同步購物車失敗:', error);
    }
}

// 從伺服器載入購物車
async function loadCartFromServer() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/cart`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const serverCart = await response.json();
            
            // 合併本地和伺服器購物車
            mergeCart(serverCart);
        }
    } catch (error) {
        console.error('載入購物車失敗:', error);
    }
}

// 合併購物車
function mergeCart(serverCart) {
    const mergedCart = [...cart];
    
    serverCart.forEach(serverItem => {
        const existingItem = mergedCart.find(item => item.productId === serverItem.productId);
        
        if (existingItem) {
            // 選擇較大的數量
            existingItem.quantity = Math.max(existingItem.quantity, serverItem.quantity);
        } else {
            mergedCart.push(serverItem);
        }
    });
    
    cart = mergedCart;
    saveCart();
    updateCartUI();
}

// 購物車持久化
function setupCartPersistence() {
    // 當使用者登入時同步購物車
    if (currentUser) {
        syncCartToServer();
    }
    
    // 定期同步購物車
    setInterval(() => {
        if (currentUser) {
            syncCartToServer();
        }
    }, 60000); // 每分鐘同步一次
}

// 初始化購物車
document.addEventListener('DOMContentLoaded', function() {
    setupCartPersistence();
});
