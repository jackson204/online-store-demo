// 管理端認證功能

// 處理管理員登入
async function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (!username || !password) {
        showNotification('請輸入使用者名稱和密碼', 'error');
        return;
    }
    
    // 模擬登入驗證
    if (username === ADMIN_MOCK_DATA.admin.username && password === ADMIN_MOCK_DATA.admin.password) {
        // 模擬 JWT token
        const token = 'admin-mock-jwt-token-' + Date.now();
        
        // 儲存管理員資訊和 token
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify({
            username: ADMIN_MOCK_DATA.admin.username,
            email: ADMIN_MOCK_DATA.admin.email,
            role: ADMIN_MOCK_DATA.admin.role
        }));
        
        currentAdmin = {
            username: ADMIN_MOCK_DATA.admin.username,
            email: ADMIN_MOCK_DATA.admin.email,
            role: ADMIN_MOCK_DATA.admin.role
        };
        
        showAdminInterface();
        updateAdminUI();
        loadDashboard();
        
        showNotification('登入成功！', 'success');
    } else {
        showNotification('帳號或密碼錯誤', 'error');
    }
    
    // 清空表單
    document.getElementById('admin-login-form').reset();
}

// 管理員登出
function adminLogout() {
    // 清除本地儲存
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    // 重置管理員狀態
    currentAdmin = null;
    
    // 清空資料
    products = [];
    orders = [];
    users = [];
    stats = {};
    
    // 顯示登入頁面
    showLoginPage();
    
    showNotification('已登出', 'info');
}

// 檢查管理員權限
function checkAdminPermission() {
    if (!currentAdmin) {
        showNotification('請先登入', 'error');
        adminLogout();
        return false;
    }
    
    if (currentAdmin.role !== 'admin') {
        showNotification('沒有管理員權限', 'error');
        return false;
    }
    
    return true;
}

// 驗證管理員 Token
async function validateAdminToken() {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/verify-token`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('驗證 Token 失敗:', error);
        return false;
    }
}

// 自動登入檢查
async function autoAdminLoginCheck() {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
        const isValid = await validateAdminToken();
        if (!isValid) {
            // Token 無效，清除本地資料
            adminLogout();
        }
    }
}

// 更新管理員密碼
async function updateAdminPassword(currentPassword, newPassword) {
    if (!checkAdminPermission()) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/change-password`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        if (response.ok) {
            showNotification('密碼更新成功', 'success');
            return true;
        } else {
            const error = await response.json();
            showNotification(error.error || '密碼更新失敗', 'error');
            return false;
        }
    } catch (error) {
        console.error('更新密碼失敗:', error);
        showNotification('更新密碼失敗', 'error');
        return false;
    }
}

// 獲取管理員資訊
async function getAdminProfile() {
    if (!checkAdminPermission()) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/profile`, {
            headers: getAdminAuthHeaders()
        });
        
        if (response.ok) {
            const adminData = await response.json();
            currentAdmin = adminData;
            localStorage.setItem('adminData', JSON.stringify(adminData));
            updateAdminUI();
            return adminData;
        } else {
            handleApiError(response);
            return null;
        }
    } catch (error) {
        console.error('獲取管理員資訊失敗:', error);
        return null;
    }
}

// 更新管理員資訊
async function updateAdminProfile(profileData) {
    if (!checkAdminPermission()) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/profile`, {
            method: 'PUT',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            const adminData = await response.json();
            currentAdmin = adminData;
            localStorage.setItem('adminData', JSON.stringify(adminData));
            updateAdminUI();
            showNotification('資料更新成功', 'success');
            return true;
        } else {
            const error = await response.json();
            showNotification(error.error || '更新失敗', 'error');
            return false;
        }
    } catch (error) {
        console.error('更新管理員資訊失敗:', error);
        showNotification('更新失敗', 'error');
        return false;
    }
}

// 建立新管理員（僅超級管理員）
async function createAdmin(adminData) {
    if (!checkAdminPermission()) return;
    
    if (currentAdmin.role !== 'superadmin') {
        showNotification('只有超級管理員可以建立新管理員', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/create`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify(adminData)
        });
        
        if (response.ok) {
            const newAdmin = await response.json();
            showNotification('管理員建立成功', 'success');
            return newAdmin;
        } else {
            const error = await response.json();
            showNotification(error.error || '建立失敗', 'error');
            return null;
        }
    } catch (error) {
        console.error('建立管理員失敗:', error);
        showNotification('建立失敗', 'error');
        return null;
    }
}

// 停用管理員（僅超級管理員）
async function deactivateAdmin(adminId) {
    if (!checkAdminPermission()) return;
    
    if (currentAdmin.role !== 'superadmin') {
        showNotification('只有超級管理員可以停用管理員', 'error');
        return;
    }
    
    if (adminId === currentAdmin.id) {
        showNotification('不能停用自己的帳號', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/${adminId}/deactivate`, {
            method: 'POST',
            headers: getAdminAuthHeaders()
        });
        
        if (response.ok) {
            showNotification('管理員已停用', 'success');
            return true;
        } else {
            const error = await response.json();
            showNotification(error.error || '停用失敗', 'error');
            return false;
        }
    } catch (error) {
        console.error('停用管理員失敗:', error);
        showNotification('停用失敗', 'error');
        return false;
    }
}

// 獲取管理員列表（僅超級管理員）
async function getAdminList() {
    if (!checkAdminPermission()) return;
    
    if (currentAdmin.role !== 'superadmin') {
        return [];
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/list`, {
            headers: getAdminAuthHeaders()
        });
        
        if (response.ok) {
            const adminList = await response.json();
            return adminList;
        } else {
            handleApiError(response);
            return [];
        }
    } catch (error) {
        console.error('獲取管理員列表失敗:', error);
        return [];
    }
}

// 記錄管理員操作日誌
async function logAdminAction(action, details = {}) {
    if (!currentAdmin) return;
    
    try {
        await fetch(`${API_BASE}/admin/log`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({
                action,
                details,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('記錄操作日誌失敗:', error);
    }
}

// 獲取管理員操作日誌
async function getAdminLogs(page = 1, limit = 50) {
    if (!checkAdminPermission()) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/logs?page=${page}&limit=${limit}`, {
            headers: getAdminAuthHeaders()
        });
        
        if (response.ok) {
            const logs = await response.json();
            return logs;
        } else {
            handleApiError(response);
            return [];
        }
    } catch (error) {
        console.error('獲取操作日誌失敗:', error);
        return [];
    }
}

// 清理過期的管理員 Token
function cleanupExpiredTokens() {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            
            if (payload.exp < now) {
                // Token 已過期
                adminLogout();
            }
        } catch (error) {
            // Token 格式錯誤
            adminLogout();
        }
    }
}

// 設定 Token 過期檢查
function setupTokenExpirationCheck() {
    // 每 5 分鐘檢查一次 Token 是否過期
    setInterval(cleanupExpiredTokens, 5 * 60 * 1000);
}

// 安全登出（清理所有相關資料）
function secureLogout() {
    // 清除所有本地儲存
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    sessionStorage.clear();
    
    // 重置所有全域變數
    currentAdmin = null;
    products = [];
    orders = [];
    users = [];
    stats = {};
    
    // 清除所有計時器
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
    
    // 回到登入頁面
    showLoginPage();
    
    showNotification('安全登出完成', 'info');
}

// 頁面載入時初始化認證相關功能
document.addEventListener('DOMContentLoaded', function() {
    autoAdminLoginCheck();
    setupTokenExpirationCheck();
    
    // 頁面隱藏時清理敏感資料
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 頁面隱藏時的處理
        } else {
            // 頁面顯示時檢查 Token 是否仍然有效
            if (currentAdmin) {
                validateAdminToken().then(isValid => {
                    if (!isValid) {
                        adminLogout();
                    }
                });
            }
        }
    });
    
    // 監聽 beforeunload 事件
    window.addEventListener('beforeunload', function() {
        // 頁面關閉前的清理工作
        if (currentAdmin) {
            logAdminAction('logout', { reason: 'page_unload' });
        }
    });
});

// 雙因素認證（2FA）相關功能
async function enableTwoFactorAuth() {
    if (!checkAdminPermission()) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/2fa/enable`, {
            method: 'POST',
            headers: getAdminAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification('雙因素認證已啟用', 'success');
            return data;
        } else {
            const error = await response.json();
            showNotification(error.error || '啟用失敗', 'error');
            return null;
        }
    } catch (error) {
        console.error('啟用雙因素認證失敗:', error);
        showNotification('啟用失敗', 'error');
        return null;
    }
}

async function disableTwoFactorAuth(code) {
    if (!checkAdminPermission()) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/2fa/disable`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ code })
        });
        
        if (response.ok) {
            showNotification('雙因素認證已停用', 'success');
            return true;
        } else {
            const error = await response.json();
            showNotification(error.error || '停用失敗', 'error');
            return false;
        }
    } catch (error) {
        console.error('停用雙因素認證失敗:', error);
        showNotification('停用失敗', 'error');
        return false;
    }
}

// 驗證雙因素認證碼
async function verifyTwoFactorCode(code) {
    try {
        const response = await fetch(`${API_BASE}/admin/2fa/verify`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ code })
        });
        
        if (response.ok) {
            return true;
        } else {
            const error = await response.json();
            showNotification(error.error || '驗證失敗', 'error');
            return false;
        }
    } catch (error) {
        console.error('驗證雙因素認證失敗:', error);
        showNotification('驗證失敗', 'error');
        return false;
    }
}
