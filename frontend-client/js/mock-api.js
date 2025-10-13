/**
 * Mock API 實作
 * 模擬後端 API 回應，讓前端可以獨立開發測試
 */

class MockAPI {
    constructor() {
        // 初始化 Mock 資料
        this.initMockData();
    }

    initMockData() {
        // 商品資料
        this.products = [
            {
                id: 1,
                name: "無線藍牙耳機",
                description: "高音質降噪藍牙耳機，續航力長達 30 小時，支援快速充電功能",
                price: 2990,
                stock: 50,
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                category: "電子產品",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "智慧手環",
                description: "追蹤運動數據、心率監測、睡眠分析，防水設計適合運動使用",
                price: 1490,
                stock: 30,
                imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400",
                category: "電子產品",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "機械鍵盤",
                description: "RGB 背光機械式鍵盤，青軸手感極佳，適合遊戲與打字",
                price: 3490,
                stock: 20,
                imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
                category: "電腦週邊",
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: "滑鼠墊",
                description: "超大尺寸防滑鼠標墊，適合遊戲與辦公使用，舒適材質",
                price: 390,
                stock: 100,
                imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
                category: "電腦週邊",
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                name: "USB-C 充電線",
                description: "高速充電傳輸線，支援 PD 快充，耐用編織設計",
                price: 590,
                stock: 80,
                imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
                category: "配件",
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                name: "行動電源",
                description: "20000mAh 大容量行動電源，支援雙向快充，輕薄便攜",
                price: 1290,
                stock: 40,
                imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
                category: "配件",
                createdAt: new Date().toISOString()
            }
        ];

        // 使用者資料
        this.users = [
            {
                id: 1,
                email: "user@example.com",
                name: "測試使用者",
                passwordHash: "hashed_password",
                isAdmin: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                email: "admin@example.com",
                name: "管理員",
                passwordHash: "hashed_password",
                isAdmin: true,
                createdAt: new Date().toISOString()
            }
        ];

        // 購物車資料 (以 userId 為 key)
        this.carts = {};

        // 訂單資料
        this.orders = [];
    }

    // 模擬網路延遲
    async delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 🛍️ 商品相關 API
    async getProducts() {
        await this.delay();
        return {
            success: true,
            data: this.products
        };
    }

    async getProductById(id) {
        await this.delay();
        const product = this.products.find(p => p.id === parseInt(id));
        
        if (!product) {
            return {
                success: false,
                message: "商品不存在"
            };
        }

        return {
            success: true,
            data: product
        };
    }

    // 🔐 認證相關 API
    async register(data) {
        await this.delay();

        // 檢查 Email 是否已存在
        const existingUser = this.users.find(u => u.email === data.email);
        if (existingUser) {
            return {
                success: false,
                message: "此 Email 已被註冊"
            };
        }

        // 建立新使用者
        const newUser = {
            id: this.users.length + 1,
            email: data.email,
            name: data.name,
            passwordHash: "hashed_" + data.password,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);

        return {
            success: true,
            message: "註冊成功",
            data: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        };
    }

    async login(data) {
        await this.delay();

        // 尋找使用者
        const user = this.users.find(u => u.email === data.email);

        if (!user) {
            return {
                success: false,
                message: "帳號或密碼錯誤"
            };
        }

        // 產生假的 JWT Token
        const token = `mock_token_${user.id}_${Date.now()}`;

        return {
            success: true,
            data: {
                token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin
                }
            }
        };
    }

    // 🛒 購物車相關 API
    async addToCart(userId, productId, quantity) {
        await this.delay();

        // 檢查商品是否存在
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            return {
                success: false,
                message: "商品不存在"
            };
        }

        // 初始化使用者購物車
        if (!this.carts[userId]) {
            this.carts[userId] = [];
        }

        // 檢查商品是否已在購物車
        const existingItem = this.carts[userId].find(item => item.productId === productId);

        if (existingItem) {
            // 累加數量
            existingItem.quantity += quantity;
        } else {
            // 新增項目
            this.carts[userId].push({
                id: Date.now(),
                userId: userId,
                productId: productId,
                quantity: quantity,
                createdAt: new Date().toISOString()
            });
        }

        return {
            success: true,
            message: "已加入購物車"
        };
    }

    async getCart(userId) {
        await this.delay();

        const userCart = this.carts[userId] || [];

        // 附加商品資訊
        const cartWithProducts = userCart.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            return {
                ...item,
                product: product
            };
        });

        return {
            success: true,
            data: cartWithProducts
        };
    }

    async updateCartQuantity(userId, cartId, quantity) {
        await this.delay();

        const userCart = this.carts[userId] || [];
        const item = userCart.find(i => i.id === cartId);

        if (!item) {
            return {
                success: false,
                message: "購物車項目不存在"
            };
        }

        item.quantity = quantity;

        return {
            success: true,
            message: "已更新數量"
        };
    }

    async removeCartItem(userId, cartId) {
        await this.delay();

        if (!this.carts[userId]) {
            return {
                success: false,
                message: "購物車是空的"
            };
        }

        this.carts[userId] = this.carts[userId].filter(item => item.id !== cartId);

        return {
            success: true,
            message: "已移除商品"
        };
    }

    // 📦 訂單相關 API
    async createOrder(userId, orderData) {
        await this.delay();

        const userCart = this.carts[userId] || [];

        if (userCart.length === 0) {
            return {
                success: false,
                message: "購物車是空的"
            };
        }

        // 建立訂單
        const order = {
            id: this.orders.length + 1,
            userId: userId,
            recipientName: orderData.recipientName,
            recipientPhone: orderData.recipientPhone,
            shippingAddress: orderData.shippingAddress,
            status: "Pending",
            totalAmount: 0,
            items: [],
            createdAt: new Date().toISOString()
        };

        // 建立訂單明細
        userCart.forEach(cartItem => {
            const product = this.products.find(p => p.id === cartItem.productId);
            
            order.items.push({
                productId: product.id,
                productName: product.name,
                quantity: cartItem.quantity,
                unitPrice: product.price
            });

            order.totalAmount += product.price * cartItem.quantity;

            // 扣減庫存
            product.stock -= cartItem.quantity;
        });

        this.orders.push(order);

        // 清空購物車
        this.carts[userId] = [];

        return {
            success: true,
            message: "訂單建立成功",
            data: order
        };
    }

    async getUserOrders(userId) {
        await this.delay();

        const userOrders = this.orders.filter(o => o.userId === userId);

        return {
            success: true,
            data: userOrders
        };
    }

    async getOrderById(orderId) {
        await this.delay();

        const order = this.orders.find(o => o.id === parseInt(orderId));

        if (!order) {
            return {
                success: false,
                message: "訂單不存在"
            };
        }

        return {
            success: true,
            data: order
        };
    }
}

// 建立全域 Mock API 實例
window.mockAPI = new MockAPI();
