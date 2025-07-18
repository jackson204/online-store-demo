// 管理端商品管理功能

// 載入所有商品
async function loadProducts() {
    if (!checkAdminPermission()) return;
    
    try {
        showLoading('products-tbody');
        
        // 使用靜態資料
        products = ADMIN_MOCK_DATA.products;
        displayProducts();
        
        // 記錄操作日誌
        logAdminAction('view_products', { count: products.length });
    } catch (error) {
        console.error('載入商品失敗:', error);
        showNotification('載入商品失敗', 'error');
    }
}

// 顯示商品列表
function displayProducts() {
    const tbody = document.getElementById('products-tbody');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <h3>暫無商品</h3>
                        <p>點擊「新增商品」開始建立您的第一個商品</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <strong>${product.name}</strong>
                    <br>
                    <small class="text-muted">${product.description}</small>
                </div>
            </td>
            <td>${getCategoryName(product.category)}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>
                <span class="stock-indicator ${getStockClass(product.stock)}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <span class="status-badge ${product.featured ? 'success' : 'secondary'}">
                    ${product.featured ? '精選' : '一般'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-info btn-sm" onclick="editProduct('${product.id}')" title="編輯">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger btn-sm" onclick="deleteProduct('${product.id}')" title="刪除">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-warning btn-sm" onclick="toggleFeatured('${product.id}')" title="切換精選狀態">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 獲取分類名稱
function getCategoryName(categoryId) {
    const categories = {
        'clothing': '服飾',
        'shoes': '鞋類',
        'accessories': '配件',
        'electronics': '電子產品'
    };
    return categories[categoryId] || categoryId;
}

// 獲取庫存樣式類別
function getStockClass(stock) {
    if (stock <= 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
}

// 顯示新增商品模態框
function showAddProductModal() {
    if (!checkAdminPermission()) return;
    
    // 清空表單
    document.getElementById('add-product-form').reset();
    showModal('add-product-modal');
}

// 處理新增商品
async function handleAddProduct(event) {
    event.preventDefault();
    
    if (!checkAdminPermission()) return;
    
    const formData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        stock: parseInt(document.getElementById('product-stock').value),
        image: document.getElementById('product-image').value,
        featured: document.getElementById('product-featured').checked
    };
    
    // 表單驗證
    if (!validateProductForm(formData)) {
        return;
    }
    
    try {
        // 使用靜態資料模擬新增商品
        const newProduct = {
            id: Date.now().toString(), // 使用時間戳作為簡單的 ID
            ...formData,
            rating: 0,
            reviews: 0,
            createdAt: new Date().toISOString()
        };
        
        // 添加預設圖片如果沒有提供
        if (!newProduct.image) {
            newProduct.image = 'https://via.placeholder.com/300x300/f0f0f0/333?text=新商品';
        }
        
        // 更新產品列表 (只需要更新一次，因為 products 已經指向 ADMIN_MOCK_DATA.products)
        products.push(newProduct);
        
        // 重新顯示商品列表
        displayProducts();
        
        // 更新儀表板統計
        updateStatsUI();
        
        // 關閉模態框
        closeModal('add-product-modal');
        
        // 清空表單
        document.getElementById('add-product-form').reset();
        
        showNotification('商品新增成功', 'success');
        
        console.log('商品新增成功:', newProduct);
        
    } catch (error) {
        console.error('新增商品失敗:', error);
        showNotification('新增商品失敗', 'error');
    }
}

// 編輯商品
function editProduct(productId) {
    if (!checkAdminPermission()) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('商品不存在', 'error');
        return;
    }
    
    // 填充編輯表單
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-description').value = product.description;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-stock').value = product.stock;
    document.getElementById('edit-product-image').value = product.image || '';
    document.getElementById('edit-product-featured').checked = product.featured;
    
    showModal('edit-product-modal');
}

// 處理編輯商品
async function handleEditProduct(event) {
    event.preventDefault();
    
    if (!checkAdminPermission()) return;
    
    const productId = document.getElementById('edit-product-id').value;
    const formData = {
        name: document.getElementById('edit-product-name').value,
        description: document.getElementById('edit-product-description').value,
        price: parseFloat(document.getElementById('edit-product-price').value),
        category: document.getElementById('edit-product-category').value,
        stock: parseInt(document.getElementById('edit-product-stock').value),
        image: document.getElementById('edit-product-image').value,
        featured: document.getElementById('edit-product-featured').checked
    };
    
    // 表單驗證
    if (!validateProductForm(formData)) {
        return;
    }
    
    try {
        // 使用靜態資料模擬編輯商品
        const index = products.findIndex(p => p.id === productId);
        if (index === -1) {
            showNotification('商品不存在', 'error');
            return;
        }
        
        // 保留原有的 ID 和其他資訊
        const updatedProduct = {
            ...products[index],
            ...formData,
            updatedAt: new Date().toISOString()
        };
        
        // 添加預設圖片如果沒有提供
        if (!updatedProduct.image) {
            updatedProduct.image = 'https://via.placeholder.com/300x300/f0f0f0/333?text=商品';
        }
        
        // 更新產品列表 (只需要更新一次，因為 products 已經指向 ADMIN_MOCK_DATA.products)
        products[index] = updatedProduct;
        
        // 重新顯示商品列表
        displayProducts();
        
        // 更新儀表板統計
        updateStatsUI();
        
        // 關閉模態框
        closeModal('edit-product-modal');
        
        showNotification('商品更新成功', 'success');
        
        console.log('商品更新成功:', updatedProduct);
        
    } catch (error) {
        console.error('更新商品失敗:', error);
        showNotification('更新商品失敗', 'error');
    }
}

// 刪除商品
async function deleteProduct(productId) {
    if (!checkAdminPermission()) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('商品不存在', 'error');
        return;
    }
    
    if (!confirm(`確定要刪除商品「${product.name}」嗎？此操作無法復原。`)) {
        return;
    }
    
    try {
        // 從產品列表中移除 (只需要操作一次，因為 products 已經指向 ADMIN_MOCK_DATA.products)
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
        }
        
        // 重新顯示商品列表
        displayProducts();
        
        // 更新儀表板統計
        updateStatsUI();
        
        showNotification('商品刪除成功', 'success');
        
        console.log('商品刪除成功:', product.name);
        
    } catch (error) {
        console.error('刪除商品失敗:', error);
        showNotification('刪除商品失敗', 'error');
    }
}

// 切換精選狀態
async function toggleFeatured(productId) {
    if (!checkAdminPermission()) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('商品不存在', 'error');
        return;
    }
    
    const newFeaturedStatus = !product.featured;
    
    try {
        // 更新精選狀態 (只需要更新一次，因為 products 已經指向 ADMIN_MOCK_DATA.products)
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index].featured = newFeaturedStatus;
        }
        
        // 重新顯示商品列表
        displayProducts();
        
        showNotification(
            `商品已${newFeaturedStatus ? '設為' : '取消'}精選`, 
            'success'
        );
        
        console.log(`商品 ${product.name} 精選狀態已更新為: ${newFeaturedStatus}`);
        
    } catch (error) {
        console.error('切換精選狀態失敗:', error);
        showNotification('更新失敗', 'error');
    }
}// 驗證商品表單
function validateProductForm(formData) {
    if (!formData.name || formData.name.trim() === '') {
        showNotification('請輸入商品名稱', 'error');
        return false;
    }
    
    if (!formData.description || formData.description.trim() === '') {
        showNotification('請輸入商品描述', 'error');
        return false;
    }
    
    if (!formData.price || formData.price <= 0) {
        showNotification('請輸入有效的商品價格', 'error');
        return false;
    }
    
    if (!formData.category) {
        showNotification('請選擇商品分類', 'error');
        return false;
    }
    
    if (!formData.stock || formData.stock < 0) {
        showNotification('請輸入有效的庫存數量', 'error');
        return false;
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
        showNotification('請輸入有效的圖片 URL', 'error');
        return false;
    }
    
    return true;
}

// 驗證 URL 格式
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// 批量操作功能
function setupBatchOperations() {
    // 全選/取消全選
    const selectAllCheckbox = document.getElementById('select-all-products');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.product-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// 獲取選中的商品
function getSelectedProducts() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 批量刪除商品
async function batchDeleteProducts() {
    if (!checkAdminPermission()) return;
    
    const selectedIds = getSelectedProducts();
    
    if (selectedIds.length === 0) {
        showNotification('請選擇要刪除的商品', 'warning');
        return;
    }
    
    if (!confirm(`確定要刪除選中的 ${selectedIds.length} 個商品嗎？此操作無法復原。`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/products/batch-delete`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ productIds: selectedIds })
        });
        
        if (response.ok) {
            // 從本地列表中移除
            products = products.filter(p => !selectedIds.includes(p.id));
            displayProducts();
            
            showNotification(`成功刪除 ${selectedIds.length} 個商品`, 'success');
            
            // 記錄操作日誌
            logAdminAction('batch_delete_products', { 
                productIds: selectedIds,
                count: selectedIds.length
            });
        } else {
            const error = await response.json();
            showNotification(error.error || '批量刪除失敗', 'error');
        }
    } catch (error) {
        console.error('批量刪除失敗:', error);
        showNotification('批量刪除失敗', 'error');
    }
}

// 批量更新商品狀態
async function batchUpdateProductStatus(featured) {
    if (!checkAdminPermission()) return;
    
    const selectedIds = getSelectedProducts();
    
    if (selectedIds.length === 0) {
        showNotification('請選擇要更新的商品', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/products/batch-update`, {
            method: 'POST',
            headers: getAdminAuthHeaders(),
            body: JSON.stringify({ 
                productIds: selectedIds,
                updates: { featured }
            })
        });
        
        if (response.ok) {
            // 更新本地列表
            products = products.map(p => 
                selectedIds.includes(p.id) ? { ...p, featured } : p
            );
            displayProducts();
            
            showNotification(
                `成功更新 ${selectedIds.length} 個商品`, 
                'success'
            );
            
            // 記錄操作日誌
            logAdminAction('batch_update_products', { 
                productIds: selectedIds,
                count: selectedIds.length,
                featured
            });
        } else {
            const error = await response.json();
            showNotification(error.error || '批量更新失敗', 'error');
        }
    } catch (error) {
        console.error('批量更新失敗:', error);
        showNotification('批量更新失敗', 'error');
    }
}

// 匯出商品資料
function exportProducts() {
    if (products.length === 0) {
        showNotification('沒有商品資料可匯出', 'warning');
        return;
    }
    
    const exportData = products.map(product => ({
        商品名稱: product.name,
        描述: product.description,
        價格: product.price,
        分類: getCategoryName(product.category),
        庫存: product.stock,
        狀態: product.featured ? '精選' : '一般',
        建立日期: formatDate(product.createdAt || new Date())
    }));
    
    exportToCSV(exportData, 'products.csv');
    showNotification('商品資料已匯出', 'success');
    
    // 記錄操作日誌
    logAdminAction('export_products', { count: products.length });
}

// 匯入商品資料
function importProducts() {
    if (!checkAdminPermission()) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    
    input.onchange = async function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch(`${API_BASE}/admin/products/import`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                showNotification(`成功匯入 ${result.count} 個商品`, 'success');
                
                // 重新載入商品列表
                loadProducts();
                
                // 記錄操作日誌
                logAdminAction('import_products', { 
                    count: result.count,
                    filename: file.name
                });
            } else {
                const error = await response.json();
                showNotification(error.error || '匯入失敗', 'error');
            }
        } catch (error) {
            console.error('匯入商品失敗:', error);
            showNotification('匯入失敗', 'error');
        }
    };
    
    input.click();
}

// 搜尋商品
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    
    if (searchTerm === '') {
        displayProducts();
        return;
    }
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        getCategoryName(product.category).toLowerCase().includes(searchTerm)
    );
    
    // 臨時更新顯示
    const originalProducts = [...products];
    products = filteredProducts;
    displayProducts();
    products = originalProducts;
}

// 按分類篩選商品
function filterProductsByCategory(category) {
    if (category === '') {
        displayProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => product.category === category);
    
    // 臨時更新顯示
    const originalProducts = [...products];
    products = filteredProducts;
    displayProducts();
    products = originalProducts;
}

// 按庫存狀態篩選商品
function filterProductsByStock(stockStatus) {
    let filteredProducts = [];
    
    switch (stockStatus) {
        case 'in-stock':
            filteredProducts = products.filter(product => product.stock > 0);
            break;
        case 'low-stock':
            filteredProducts = products.filter(product => product.stock > 0 && product.stock <= 10);
            break;
        case 'out-of-stock':
            filteredProducts = products.filter(product => product.stock === 0);
            break;
        default:
            filteredProducts = products;
    }
    
    // 臨時更新顯示
    const originalProducts = [...products];
    products = filteredProducts;
    displayProducts();
    products = originalProducts;
}

// 初始化商品管理功能
document.addEventListener('DOMContentLoaded', function() {
    setupBatchOperations();
});
