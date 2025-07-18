// 管理端訂單管理功能

// 載入所有訂單
async function loadOrders() {
    if (!checkAdminPermission()) return;
    
    try {
        showLoading('orders-tbody');
        
        // 使用靜態資料
        orders = ADMIN_MOCK_DATA.orders;
        displayOrders();
        
        // 記錄操作日誌
        logAdminAction('view_orders', { count: orders.length });
    } catch (error) {
        console.error('載入訂單失敗:', error);
        showNotification('載入訂單失敗', 'error');
    }
}

// 載入使用者資料
async function loadUsers() {
    if (!checkAdminPermission()) return;
    
    try {
        showLoading('users-tbody');
        
        // 使用靜態資料
        users = ADMIN_MOCK_DATA.users;
        displayUsers(users);
        
        // 記錄操作日誌
        logAdminAction('view_users', { count: users.length });
    } catch (error) {
        console.error('載入使用者失敗:', error);
        showNotification('載入使用者失敗', 'error');
    }
}
}

// 顯示訂單列表
function displayOrders() {
    const tbody = document.getElementById('orders-tbody');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>暫無訂單</h3>
                        <p>還沒有客戶下訂單</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>
                <div class="order-id-container">
                    <strong>#${order.id.substring(0, 8)}</strong>
                    <br>
                    <small class="text-muted">${formatDate(order.createdAt)}</small>
                </div>
            </td>
            <td>
                <div class="customer-info">
                    <span>${order.shippingAddress?.name || '未知客戶'}</span>
                    <br>
                    <small class="text-muted">${order.shippingAddress?.phone || ''}</small>
                </div>
            </td>
            <td>
                <strong>${formatCurrency(order.totalAmount)}</strong>
                <br>
                <small class="text-muted">${order.items?.length || 0} 項商品</small>
            </td>
            <td>
                <span class="status-badge ${order.status}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>
                <small class="text-muted">${formatDate(order.createdAt)}</small>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-info btn-sm" onclick="viewOrderDetails('${order.id}')" title="查看詳情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'processing')" title="處理中">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="btn-warning btn-sm" onclick="updateOrderStatus('${order.id}', 'shipped')" title="已出貨">
                        <i class="fas fa-truck"></i>
                    </button>
                    <button class="btn-danger btn-sm" onclick="updateOrderStatus('${order.id}', 'cancelled')" title="取消">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 顯示使用者列表
function displayUsers(userList) {
    const tbody = document.getElementById('users-tbody');
    
    if (userList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>暫無使用者</h3>
                        <p>還沒有使用者註冊</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = userList.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <strong>${user.username}</strong>
                    <br>
                    <small class="text-muted">ID: ${user.id.substring(0, 8)}</small>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <small class="text-muted">${formatDate(user.createdAt)}</small>
            </td>
            <td>
                <span class="status-badge ${user.status || 'active'}">
                    ${user.status === 'inactive' ? '停用' : '啟用'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-info btn-sm" onclick="viewUserDetails('${user.id}')" title="查看詳情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-warning btn-sm" onclick="toggleUserStatus('${user.id}')" title="切換狀態">
                        <i class="fas fa-toggle-on"></i>
                    </button>
                    <button class="btn-secondary btn-sm" onclick="sendUserEmail('${user.id}')" title="發送郵件">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 查看訂單詳情
function viewOrderDetails(orderId) {
    if (!checkAdminPermission()) return;
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('訂單不存在', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>訂單詳情 #${order.id.substring(0, 8)}</h2>
            
            <div class="order-details">
                <div class="order-section">
                    <h3>基本資訊</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>訂單編號:</label>
                            <span>${order.id}</span>
                        </div>
                        <div class="info-item">
                            <label>訂單狀態:</label>
                            <span class="status-badge ${order.status}">${getStatusText(order.status)}</span>
                        </div>
                        <div class="info-item">
                            <label>訂單日期:</label>
                            <span>${formatDate(order.createdAt)}</span>
                        </div>
                        <div class="info-item">
                            <label>總金額:</label>
                            <span>${formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="order-section">
                    <h3>配送資訊</h3>
                    <div class="shipping-info">
                        <p><strong>收件人:</strong> ${order.shippingAddress?.name || '未提供'}</p>
                        <p><strong>配送地址:</strong> ${order.shippingAddress?.address || '未提供'}</p>
                        <p><strong>聯絡電話:</strong> ${order.shippingAddress?.phone || '未提供'}</p>
                    </div>
                </div>
                
                <div class="order-section">
                    <h3>訂單商品</h3>
                    <div class="order-items">
                        ${order.items?.map(item => `
                            <div class="order-item">
                                <span class="item-name">${item.productName}</span>
                                <span class="item-quantity">x ${item.quantity}</span>
                                <span class="item-price">${formatCurrency(item.productPrice * item.quantity)}</span>
                            </div>
                        `).join('') || '<p>無商品資訊</p>'}
                    </div>
                </div>
                
                <div class="order-section">
                    <h3>狀態更新</h3>
                    <div class="status-actions">
                        <button class="btn-success" onclick="updateOrderStatus('${order.id}', 'processing')">
                            標記為處理中
                        </button>
                        <button class="btn-warning" onclick="updateOrderStatus('${order.id}', 'shipped')">
                            標記為已出貨
                        </button>
                        <button class="btn-info" onclick="updateOrderStatus('${order.id}', 'delivered')">
                            標記為已送達
                        </button>
                        <button class="btn-primary" onclick="updateOrderStatus('${order.id}', 'completed')">
                            標記為已完成
                        </button>
                        <button class="btn-danger" onclick="updateOrderStatus('${order.id}', 'cancelled')">
                            取消訂單
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // 記錄操作日誌
    logAdminAction('view_order_details', { orderId: order.id });
}

// 更新訂單狀態
async function updateOrderStatus(orderId, newStatus) {
    if (!checkAdminPermission()) return;
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('訂單不存在', 'error');
        return;
    }
    
    // 確認操作
    if (!confirm(`確定要將訂單狀態更新為「${getStatusText(newStatus)}」嗎？`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            const updatedOrder = await response.json();
            
            // 更新本地訂單列表
            const index = orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                orders[index] = updatedOrder;
                displayOrders();
            }
            
            showNotification('訂單狀態更新成功', 'success');
            
            // 記錄操作日誌
            logAdminAction('update_order_status', { 
                orderId: orderId,
                oldStatus: order.status,
                newStatus: newStatus
            });
            
            // 關閉詳情模態框（如果有開啟）
            const modal = document.querySelector('.modal');
            if (modal) {
                modal.remove();
            }
        } else {
            const error = await response.json();
            showNotification(error.error || '更新訂單狀態失敗', 'error');
        }
    } catch (error) {
        console.error('更新訂單狀態失敗:', error);
        showNotification('更新訂單狀態失敗', 'error');
    }
}

// 篩選訂單
function filterOrders() {
    const statusFilter = document.getElementById('order-status-filter').value;
    
    let filteredOrders = orders;
    
    if (statusFilter) {
        filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    
    // 臨時更新顯示
    const originalOrders = [...orders];
    orders = filteredOrders;
    displayOrders();
    orders = originalOrders;
}

// 查看使用者詳情
function viewUserDetails(userId) {
    if (!checkAdminPermission()) return;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showNotification('使用者不存在', 'error');
        return;
    }
    
    // 查找用戶的訂單
    const userOrders = orders.filter(order => order.userId === userId);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>使用者詳情</h2>
            
            <div class="user-details">
                <div class="user-section">
                    <h3>基本資訊</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>使用者 ID:</label>
                            <span>${user.id}</span>
                        </div>
                        <div class="info-item">
                            <label>使用者名稱:</label>
                            <span>${user.username}</span>
                        </div>
                        <div class="info-item">
                            <label>電子郵件:</label>
                            <span>${user.email}</span>
                        </div>
                        <div class="info-item">
                            <label>註冊日期:</label>
                            <span>${formatDate(user.createdAt)}</span>
                        </div>
                        <div class="info-item">
                            <label>狀態:</label>
                            <span class="status-badge ${user.status || 'active'}">
                                ${user.status === 'inactive' ? '停用' : '啟用'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="user-section">
                    <h3>訂單歷史 (${userOrders.length} 筆)</h3>
                    <div class="user-orders">
                        ${userOrders.length > 0 ? userOrders.map(order => `
                            <div class="user-order-item">
                                <span class="order-id">#${order.id.substring(0, 8)}</span>
                                <span class="order-date">${formatDate(order.createdAt)}</span>
                                <span class="order-amount">${formatCurrency(order.totalAmount)}</span>
                                <span class="status-badge ${order.status}">${getStatusText(order.status)}</span>
                            </div>
                        `).join('') : '<p>無訂單記錄</p>'}
                    </div>
                </div>
                
                <div class="user-section">
                    <h3>操作</h3>
                    <div class="user-actions">
                        <button class="btn-warning" onclick="toggleUserStatus('${user.id}')">
                            ${user.status === 'inactive' ? '啟用' : '停用'}使用者
                        </button>
                        <button class="btn-info" onclick="sendUserEmail('${user.id}')">
                            發送郵件
                        </button>
                        <button class="btn-secondary" onclick="resetUserPassword('${user.id}')">
                            重設密碼
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // 記錄操作日誌
    logAdminAction('view_user_details', { userId: user.id });
}

// 切換使用者狀態
async function toggleUserStatus(userId) {
    if (!checkAdminPermission()) return;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showNotification('使用者不存在', 'error');
        return;
    }
    
    const newStatus = user.status === 'inactive' ? 'active' : 'inactive';
    const action = newStatus === 'active' ? '啟用' : '停用';
    
    if (!confirm(`確定要${action}使用者「${user.username}」嗎？`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            // 更新本地使用者列表
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index].status = newStatus;
                displayUsers(users);
            }
            
            showNotification(`使用者已${action}`, 'success');
            
            // 記錄操作日誌
            logAdminAction('toggle_user_status', { 
                userId: userId,
                username: user.username,
                newStatus: newStatus
            });
            
            // 關閉詳情模態框（如果有開啟）
            const modal = document.querySelector('.modal');
            if (modal) {
                modal.remove();
            }
        } else {
            const error = await response.json();
            showNotification(error.error || `${action}使用者失敗`, 'error');
        }
    } catch (error) {
        console.error(`${action}使用者失敗:`, error);
        showNotification(`${action}使用者失敗`, 'error');
    }
}

// 發送郵件給使用者
async function sendUserEmail(userId) {
    if (!checkAdminPermission()) return;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showNotification('使用者不存在', 'error');
        return;
    }
    
    const subject = prompt('請輸入郵件主旨:');
    if (!subject) return;
    
    const message = prompt('請輸入郵件內容:');
    if (!message) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}/send-email`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ subject, message })
        });
        
        if (response.ok) {
            showNotification('郵件發送成功', 'success');
            
            // 記錄操作日誌
            logAdminAction('send_user_email', { 
                userId: userId,
                username: user.username,
                subject: subject
            });
        } else {
            const error = await response.json();
            showNotification(error.error || '郵件發送失敗', 'error');
        }
    } catch (error) {
        console.error('郵件發送失敗:', error);
        showNotification('郵件發送失敗', 'error');
    }
}

// 重設使用者密碼
async function resetUserPassword(userId) {
    if (!checkAdminPermission()) return;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showNotification('使用者不存在', 'error');
        return;
    }
    
    if (!confirm(`確定要重設使用者「${user.username}」的密碼嗎？`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}/reset-password`, {
            method: 'POST',
            headers: getAdminAuthHeaders()
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // 顯示新密碼
            alert(`密碼重設成功！\n新密碼: ${result.newPassword}\n請告知使用者並要求其盡快修改密碼。`);
            
            // 記錄操作日誌
            logAdminAction('reset_user_password', { 
                userId: userId,
                username: user.username
            });
        } else {
            const error = await response.json();
            showNotification(error.error || '密碼重設失敗', 'error');
        }
    } catch (error) {
        console.error('密碼重設失敗:', error);
        showNotification('密碼重設失敗', 'error');
    }
}

// 匯出使用者資料
function exportUsers() {
    if (users.length === 0) {
        showNotification('沒有使用者資料可匯出', 'warning');
        return;
    }
    
    const exportData = users.map(user => ({
        使用者ID: user.id,
        使用者名稱: user.username,
        電子郵件: user.email,
        註冊日期: formatDate(user.createdAt),
        狀態: user.status === 'inactive' ? '停用' : '啟用'
    }));
    
    exportToCSV(exportData, 'users.csv');
    showNotification('使用者資料已匯出', 'success');
    
    // 記錄操作日誌
    logAdminAction('export_users', { count: users.length });
}

// 搜尋訂單
function searchOrders() {
    const searchTerm = document.getElementById('order-search').value.toLowerCase();
    
    if (searchTerm === '') {
        displayOrders();
        return;
    }
    
    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.shippingAddress?.name.toLowerCase().includes(searchTerm) ||
        order.shippingAddress?.phone.includes(searchTerm)
    );
    
    // 臨時更新顯示
    const originalOrders = [...orders];
    orders = filteredOrders;
    displayOrders();
    orders = originalOrders;
}

// 按日期範圍篩選訂單
function filterOrdersByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
    });
    
    // 臨時更新顯示
    const originalOrders = [...orders];
    orders = filteredOrders;
    displayOrders();
    orders = originalOrders;
}

// 計算訂單統計
function calculateOrderStats() {
    const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        shippedOrders: orders.filter(o => o.status === 'shipped').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0
    };
    
    return stats;
}

// 顯示訂單統計
function displayOrderStats() {
    const stats = calculateOrderStats();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>訂單統計</h2>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>${stats.totalOrders}</h3>
                    <p>總訂單數</p>
                </div>
                <div class="stat-item">
                    <h3>${stats.pendingOrders}</h3>
                    <p>待處理</p>
                </div>
                <div class="stat-item">
                    <h3>${stats.processingOrders}</h3>
                    <p>處理中</p>
                </div>
                <div class="stat-item">
                    <h3>${stats.shippedOrders}</h3>
                    <p>已出貨</p>
                </div>
                <div class="stat-item">
                    <h3>${stats.completedOrders}</h3>
                    <p>已完成</p>
                </div>
                <div class="stat-item">
                    <h3>${stats.cancelledOrders}</h3>
                    <p>已取消</p>
                </div>
                <div class="stat-item">
                    <h3>${formatCurrency(stats.totalRevenue)}</h3>
                    <p>總營收</p>
                </div>
                <div class="stat-item">
                    <h3>${formatCurrency(stats.averageOrderValue)}</h3>
                    <p>平均訂單金額</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}
