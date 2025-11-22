// StockMaster - Products Module

function loadProducts() {
    const products = getProducts();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const container = document.getElementById('productsList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);"><p style="font-size: 14px;">No products found</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card" style="
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(0, 0, 0, 0.04);
            transition: all 0.2s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 12px 0; color: #202124; font-size: 18px; font-weight: 500; letter-spacing: -0.2px;">${product.name}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px;">
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">SKU</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${product.sku}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Category</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${product.category}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Unit</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${product.unit}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${product.location}</p>
                        </div>
                    </div>
                </div>
                <div style="text-align: right; margin-left: 24px; padding-left: 24px; border-left: 1px solid rgba(0, 0, 0, 0.06);">
                    <div style="
                        font-size: 36px;
                        font-weight: 400;
                        color: ${product.stock < 10 ? '#D32F2F' : '#1DB954'};
                        margin-bottom: 4px;
                        line-height: 1.2;
                    ">${product.stock}</div>
                    <div style="color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">in stock</div>
                    ${product.stock < 10 ? '<div style="color: #D32F2F; font-size: 11px; margin-top: 8px; font-weight: 500; padding: 4px 8px; background: rgba(211, 47, 47, 0.1); border-radius: 4px; display: inline-block;">Low Stock</div>' : ''}
                </div>
            </div>
        </div>
        <style>
            .product-card:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
                transform: translateY(-2px);
            }
        </style>
    `).join('');
}

function createProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value;
    const sku = document.getElementById('productSKU').value;
    const category = document.getElementById('productCategory').value;
    const unit = document.getElementById('productUnit').value;
    const stock = parseInt(document.getElementById('productStock').value) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    
    if (!name || !sku || !category || !unit) {
        alert('Please fill in all required fields');
        return;
    }
    
    const product = {
        name,
        sku,
        category,
        unit,
        stock,
        price,
        location: 'WH1'
    };
    
    addProduct(product);
    alert('Product created successfully!');
    window.location.href = 'products.html';
}

