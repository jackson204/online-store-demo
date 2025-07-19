// 認證相關功能

// 處理登入
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // 模擬登入驗證
    const user = MOCK_DATA.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // 模擬 JWT token
        const token = 'mock-jwt-token-' + Date.now();
        
        // 儲存使用者資訊
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email
        }));
        
        currentUser = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        
        updateAuthUI();
        closeModal('login-modal');
        showNotification('登入成功！', 'success');
        
        // 同步購物車
        syncCartToServer();
    } else {
        showNotification('帳號或密碼錯誤', 'error');
    }
    
    // 清空表單
    document.getElementById('login-form').reset();
}

// 處理註冊
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // 基本驗證
    if (password.length < 6) {
        showNotification('密碼長度至少需要 6 個字符', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('註冊成功！請登入', 'success');
            closeModal('register-modal');
            
            // 自動填入登入表單
            document.getElementById('login-email').value = email;
            showLoginModal();
        } else {
            showNotification(data.error || '註冊失敗', 'error');
        }
    } catch (error) {
        console.error('註冊錯誤:', error);
        showNotification('註冊失敗，請稍後再試', 'error');
    }
    
    // 清空表單
    document.getElementById('register-form').reset();
}

// 登出
function logout() {
    // 清除本地儲存
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // 重置使用者狀態
    currentUser = null;
    updateAuthUI();
    
    // 清空購物車
    cart = [];
    updateCartUI();
    
    // 返回首頁
    showSection('home');
    
    showNotification('已登出', 'info');
}

// 獲取認證 header
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// 檢查是否已登入
function checkLogin() {
    if (!currentUser) {
        showNotification('請先登入', 'error');
        showLoginModal();
        return false;
    }
    return true;
}

// 處理 API 錯誤
async function handleApiErrorResponse(response, defaultMessage = '操作失敗') {
    let errorMsg = defaultMessage;
    try {
        const data = await response.json();
        if (data && data.error) {
            errorMsg = data.error + (data.detail ? `：${data.detail}` : '');
        }
    } catch {
        // 無法解析 JSON，維持預設訊息
    }
    showNotification(errorMsg, 'error');
}

function handleApiError(error, defaultMessage = '操作失敗') {
    console.error('API 錯誤:', error);
    
    if (error.status === 401) {
        // Token 過期或無效
        logout();
        showNotification('登入已過期，請重新登入', 'error');
        showLoginModal();
    } else if (error.status === 403) {
        showNotification('沒有權限執行此操作', 'error');
    } else if (error.response) {
        handleApiErrorResponse(error.response, defaultMessage);
    } else {
        showNotification(defaultMessage, 'error');
    }
}

// 驗證電子郵件格式
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 驗證密碼強度
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    const strength = {
        length: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        score: 0
    };
    
    if (strength.length) strength.score += 1;
    if (strength.hasUpperCase) strength.score += 1;
    if (strength.hasLowerCase) strength.score += 1;
    if (strength.hasNumbers) strength.score += 1;
    
    return strength;
}

// 表單驗證
function validateLoginForm() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showNotification('請填寫所有必要欄位', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showNotification('請輸入有效的電子郵件', 'error');
        return false;
    }
    
    return true;
}

function validateRegisterForm() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!username || !email || !password) {
        showNotification('請填寫所有必要欄位', 'error');
        return false;
    }
    
    if (username.length < 3) {
        showNotification('使用者名稱至少需要 3 個字符', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showNotification('請輸入有效的電子郵件', 'error');
        return false;
    }
    
    const passwordStrength = validatePassword(password);
    if (!passwordStrength.length) {
        showNotification('密碼至少需要 6 個字符', 'error');
        return false;
    }
    
    return true;
}

// 載入使用者資訊
async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE}/profile`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
            updateAuthUI();
        } else {
            handleApiError({ status: response.status }, '載入使用者資訊失敗');
        }
    } catch (error) {
        console.error('載入使用者資訊失敗:', error);
    }
}

// 更新使用者資訊
async function updateUserProfile(profileData) {
    if (!checkLogin()) return;
    
    try {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
            updateAuthUI();
            showNotification('資料更新成功', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || '更新失敗', 'error');
        }
    } catch (error) {
        console.error('更新使用者資訊失敗:', error);
        showNotification('更新失敗，請稍後再試', 'error');
    }
}

// 修改密碼
async function changePassword(currentPassword, newPassword) {
    if (!checkLogin()) return;
    
    try {
        const response = await fetch(`${API_BASE}/change-password`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        if (response.ok) {
            showNotification('密碼修改成功', 'success');
            return true;
        } else {
            const error = await response.json();
            showNotification(error.error || '密碼修改失敗', 'error');
            return false;
        }
    } catch (error) {
        console.error('修改密碼失敗:', error);
        showNotification('修改密碼失敗，請稍後再試', 'error');
        return false;
    }
}

// 忘記密碼
async function forgotPassword(email) {
    try {
        const response = await fetch(`${API_BASE}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            showNotification('密碼重置郵件已發送', 'success');
            return true;
        } else {
            const error = await response.json();
            showNotification(error.error || '發送失敗', 'error');
            return false;
        }
    } catch (error) {
        console.error('忘記密碼失敗:', error);
        showNotification('發送失敗，請稍後再試', 'error');
        return false;
    }
}

// 自動登入檢查
function autoLoginCheck() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // 檢查 token 是否有效
        fetch(`${API_BASE}/verify-token`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                // Token 無效，清除本地資料
                logout();
            }
        })
        .catch(() => {
            // 網路錯誤，保持現狀
        });
    }
}

// 頁面載入時檢查自動登入
document.addEventListener('DOMContentLoaded', function() {
    autoLoginCheck();
});
