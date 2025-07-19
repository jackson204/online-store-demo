const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// 中介軟體
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 提供靜態檔案
app.use('/client', express.static(path.join(__dirname, 'client')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// 內存資料庫 (實際專案中應使用真實資料庫)
let users = [];
let admins = [
    {
        id: 'admin1',
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        email: 'admin@store.com',
        role: 'admin'
    }
];
let products = [
    {
        id: uuidv4(),
        name: '經典白色T恤',
        description: '100%純棉材質，舒適透氣',
        price: 590,
        image: '/images/tshirt1.jpg',
        category: 'clothing',
        stock: 50,
        featured: true
    },
    {
        id: uuidv4(),
        name: '牛仔褲',
        description: '修身版型，高品質牛仔布',
        price: 1290,
        image: '/images/jeans1.jpg',
        category: 'clothing',
        stock: 30,
        featured: false
    },
    {
        id: uuidv4(),
        name: '運動鞋',
        description: '輕量化設計，適合日常穿著',
        price: 2490,
        image: '/images/shoes1.jpg',
        category: 'shoes',
        stock: 25,
        featured: true
    }
];
let orders = [];
let categories = [
    { id: 'clothing', name: '服飾' },
    { id: 'shoes', name: '鞋類' },
    { id: 'accessories', name: '配件' }
];

// 認證中介軟體
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '需要認證' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: '無效的token' });
        }
        req.user = user;
        next();
    });
};

// 管理員認證中介軟體
const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: '需要管理員權限' });
        }
        next();
    });
};

// 路由

// 首頁重新導向
app.get('/', (req, res) => {
    res.redirect('/client/index.html');
});

// 使用者註冊
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // 檢查使用者是否已存在
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({ error: '使用者已存在' });
        }

        // 建立新使用者
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date()
        };

        users.push(newUser);
        res.status(201).json({ message: '註冊成功', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ error: '註冊失敗' });
    }
});

// 使用者登入
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 查找使用者
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: '使用者不存在' });
        }

        // 驗證密碼
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: '密碼錯誤' });
        }

        // 生成JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: '登入失敗' });
    }
});

// 管理員登入
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 查找管理員
        const admin = admins.find(a => a.username === username);
        if (!admin) {
            return res.status(400).json({ error: '管理員不存在' });
        }

        // 驗證密碼
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: '密碼錯誤' });
        }

        // 生成JWT token
        const token = jwt.sign(
            { userId: admin.id, role: admin.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: '登入失敗' });
    }
});

// 商品相關API
app.get('/api/products', (req, res) => {
    const { category, search, featured } = req.query;
    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (featured === 'true') {
        filteredProducts = filteredProducts.filter(p => p.featured);
    }

    res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: '商品未找到' });
    }
    res.json(product);
});

// 管理員商品管理
app.post('/api/admin/products', authenticateAdmin, (req, res) => {
    const { name, description, price, image, category, stock, featured } = req.body;
    
    const newProduct = {
        id: uuidv4(),
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock),
        featured: featured || false,
        createdAt: new Date()
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', authenticateAdmin, (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
        return res.status(404).json({ error: '商品未找到' });
    }

    const { name, description, price, image, category, stock, featured } = req.body;
    
    products[productIndex] = {
        ...products[productIndex],
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock),
        featured: featured || false,
        updatedAt: new Date()
    };

    res.json(products[productIndex]);
});

app.delete('/api/admin/products/:id', authenticateAdmin, (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
        return res.status(404).json({ error: '商品未找到' });
    }

    products.splice(productIndex, 1);
    res.json({ message: '商品已刪除' });
});

// 訂單相關API
app.post('/api/orders', authenticateToken, (req, res) => {
    const { items, totalAmount, shippingAddress } = req.body;
    
    const newOrder = {
        id: uuidv4(),
        userId: req.user.userId,
        items,
        totalAmount,
        shippingAddress,
        status: 'pending',
        createdAt: new Date()
    };

    orders.push(newOrder);
    
    // 更新庫存
    items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    res.status(201).json(newOrder);
});

app.get('/api/orders', authenticateToken, (req, res) => {
    const userOrders = orders.filter(o => o.userId === req.user.userId);
    res.json(userOrders);
});

// 管理員訂單管理
app.get('/api/admin/orders', authenticateAdmin, (req, res) => {
    res.json(orders);
});

app.put('/api/admin/orders/:id', authenticateAdmin, (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
        return res.status(404).json({ error: '訂單未找到' });
    }

    const { status } = req.body;
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();

    res.json(orders[orderIndex]);
});

// 分類API
app.get('/api/categories', (req, res) => {
    res.json(categories);
});

// 統計資料 (管理員)
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
    const stats = {
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
    res.json(stats);
});

// 統一錯誤處理中介軟體
app.use((err, req, res, next) => {
    console.error('API 例外:', err);
    res.status(500).json({ error: '伺服器內部錯誤', detail: err.message });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器執行在 http://localhost:${PORT}`);
    console.log(`客戶端: http://localhost:${PORT}/client/index.html`);
    console.log(`管理端: http://localhost:${PORT}/admin/index.html`);
});
