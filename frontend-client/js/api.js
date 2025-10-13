/**
 * API 呼叫封裝
 * 根據 CONFIG.USE_MOCK_API 自動切換 Mock/真實 API
 */

class API {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.useMock = CONFIG.USE_MOCK_API;
    }

    // 取得認證 Token
    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    }

    // 取得當前使用者
    getCurrentUser() {
        const userJson = localStorage.getItem(CONFIG.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    // HTTP 請求封裝
    async request(endpoint, options = {}) {
        // 如果使用 Mock API
        if (this.useMock) {
            return this.mockRequest(endpoint, options);
        }

        // 真實 API 請求
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '請求失敗');
            }

            return data;
        } catch (error) {
            console.error('API 請求錯誤:', error);
            throw error;
        }
    }

    // Mock API 路由分發
    async mockRequest(endpoint, options = {}) {
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;
        const user = this.getCurrentUser();

        console.log(`[Mock API] ${method} ${endpoint}`, body);

        // 🛍️ 商品 API
        if (endpoint === '/products' && method === 'GET') {
            return await mockAPI.getProducts();
        }

        if (endpoint.startsWith('/products/') && method === 'GET') {
            const id = endpoint.split('/')[2];
            return await mockAPI.getProductById(id);
        }

        // 🔐 認證 API
        if (endpoint === '/auth/register' && method === 'POST') {
            return await mockAPI.register(body);
        }

        if (endpoint === '/auth/login' && method === 'POST') {
            return await mockAPI.login(body);
        }

        // 🛒 購物車 API
        if (endpoint === '/cart/add' && method === 'POST') {
            return await mockAPI.addToCart(user.id, body.productId, body.quantity);
        }

        if (endpoint === '/cart' && method === 'GET') {
            return await mockAPI.getCart(user.id);
        }

        if (endpoint.startsWith('/cart/') && method === 'PUT') {
            const cartId = parseInt(endpoint.split('/')[2]);
            return await mockAPI.updateCartQuantity(user.id, cartId, body.quantity);
        }

        if (endpoint.startsWith('/cart/') && method === 'DELETE') {
            const cartId = parseInt(endpoint.split('/')[2]);
            return await mockAPI.removeCartItem(user.id, cartId);
        }

        // 📦 訂單 API
        if (endpoint === '/orders' && method === 'POST') {
            return await mockAPI.createOrder(user.id, body);
        }

        if (endpoint === '/orders' && method === 'GET') {
            return await mockAPI.getUserOrders(user.id);
        }

        if (endpoint.startsWith('/orders/') && method === 'GET') {
            const orderId = endpoint.split('/')[2];
            return await mockAPI.getOrderById(orderId);
        }

        throw new Error(`Mock API 路由未定義: ${method} ${endpoint}`);
    }

    // === 商品 API ===
    async getProducts() {
        return this.request('/products');
    }

    async getProductById(id) {
        return this.request(`/products/${id}`);
    }

    // === 認證 API ===
    async register(data) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async login(data) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // === 購物車 API ===
    async addToCart(productId, quantity) {
        return this.request('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }

    async getCart() {
        return this.request('/cart');
    }

    async updateCartQuantity(cartId, quantity) {
        return this.request(`/cart/${cartId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    }

    async removeCartItem(cartId) {
        return this.request(`/cart/${cartId}`, {
            method: 'DELETE'
        });
    }

    // === 訂單 API ===
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getUserOrders() {
        return this.request('/orders');
    }

    async getOrderById(orderId) {
        return this.request(`/orders/${orderId}`);
    }
}

// 建立全域 API 實例
window.api = new API();
