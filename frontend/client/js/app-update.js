// 更新後的 displayProducts 函式，包含查看詳情功能

// 顯示商品
function displayProducts(productList, containerId) {
    console.log(`正在顯示商品到容器 ${containerId}，商品數量: ${productList.length}`);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`容器 ${containerId} 不存在`);
        return;
    }
    console.log(`找到容器: ${containerId}`);
    if (productList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>沒有找到商品</h3>
                <p>請嘗試調整搜尋條件</p>
            </div>
        `;
        return;
    }
    const productsHTML = productList.map(product => {
        console.log(`處理商品: ${product.name}`);
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy"
                         onerror="this.style.display=\"none\"; this.nextElementSibling.style.display=\"flex\";">
                    <div class="image-placeholder" style="display:none;">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">NT$ ${product.price.toLocaleString()}</div>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                        <span class="rating-text">(${product.reviews} 評價)</span>
                    </div>
                    <div class="product-stock ${product.stock <= 5 ? \"low-stock\" : \"\"}">
                        庫存: ${product.stock}
                    </div>
                    <div class="product-actions">
                        <button class="btn-secondary" onclick="showProductDetail(\"${product.id}\")" title="查看詳情">
                            <i class="fas fa-info-circle"></i> 查看詳情
                        </button>
                        <button class="btn-primary" onclick="addToCartSimple(\"${product.id}\")" ${product.stock === 0 ? \"disabled\" : \"\"}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.stock === 0 ? \"缺貨\" : \"加入購物車\"}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join(\"\");
    container.innerHTML = productsHTML;
    console.log(`商品已顯示到容器 ${containerId}`);
}
