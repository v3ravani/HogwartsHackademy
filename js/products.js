// StockMaster - Products Module

let currentView = localStorage.getItem('productsView') || 'list';

function loadProducts() {
    const products = getProducts();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('filterCategory')?.value || '';
    const locationFilter = document.getElementById('filterLocation')?.value || '';
    const stockFilter = document.getElementById('filterStock')?.value || '';
    
    let filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        // Location filter
        const matchesLocation = !locationFilter || product.location === locationFilter;
        
        // Stock filter
        let matchesStock = true;
        if (stockFilter === 'low') {
            matchesStock = product.stock < 10;
        } else if (stockFilter === 'medium') {
            matchesStock = product.stock >= 10 && product.stock <= 50;
        } else if (stockFilter === 'high') {
            matchesStock = product.stock > 50;
        } else if (stockFilter === 'out') {
            matchesStock = product.stock === 0;
        }
        
        return matchesSearch && matchesCategory && matchesLocation && matchesStock;
    });
    
    if (currentView === 'list') {
        displayProducts(filteredProducts);
    } else {
        displayProductsKanban(filteredProducts);
    }
}

function loadProductFilters() {
    const products = getProducts();
    const categories = [...new Set(products.map(p => p.category))].sort();
    const locations = [...new Set(products.map(p => p.location))].sort();
    
    const categorySelect = document.getElementById('filterCategory');
    const locationSelect = document.getElementById('filterLocation');
    
    if (categorySelect) {
        categories.forEach(cat => {
            if (!Array.from(categorySelect.options).some(opt => opt.value === cat)) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            }
        });
    }
    
    if (locationSelect) {
        locations.forEach(loc => {
            if (!Array.from(locationSelect.options).some(opt => opt.value === loc)) {
                const option = document.createElement('option');
                option.value = loc;
                option.textContent = loc;
                locationSelect.appendChild(option);
            }
        });
    }
}

function resetProductFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('filterStock').value = '';
    loadProducts();
}

function switchView(view) {
    currentView = view;
    localStorage.setItem('productsView', view);
    
    const listBtn = document.getElementById('listViewBtn');
    const kanbanBtn = document.getElementById('kanbanViewBtn');
    const listContainer = document.getElementById('productsList');
    const kanbanContainer = document.getElementById('productsKanban');
    
    if (view === 'list') {
        listBtn?.classList.add('active');
        kanbanBtn?.classList.remove('active');
        if (listContainer) listContainer.style.display = 'flex';
        if (kanbanContainer) kanbanContainer.style.display = 'none';
    } else {
        listBtn?.classList.remove('active');
        kanbanBtn?.classList.add('active');
        if (listContainer) listContainer.style.display = 'none';
        if (kanbanContainer) kanbanContainer.style.display = 'grid';
    }
    
    loadProducts();
}

function displayProductsKanban(products) {
    const container = document.getElementById('productsKanban');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); grid-column: 1/-1;"><p style="font-size: 14px;">No products found</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="kanban-card">
            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px 0; color: #202124; font-size: 16px; font-weight: 500;">${product.name}</h3>
                <p style="margin: 0; color: #5F6368; font-size: 12px;">${product.sku}</p>
            </div>
            <div style="padding: 12px; background: #F8F9FA; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Stock</span>
                    <span style="font-size: 20px; font-weight: 500; color: ${product.stock < 10 ? '#D32F2F' : '#1DB954'};">${product.stock}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Category</span>
                    <span style="font-size: 12px; color: #202124;">${product.category}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Location</span>
                    <span style="font-size: 12px; color: #202124;">${product.location}</span>
                </div>
            </div>
            ${product.stock < 10 ? '<div style="padding: 6px 10px; background: rgba(211, 47, 47, 0.1); color: #D32F2F; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center;">Low Stock</div>' : '<div style="padding: 6px 10px; background: rgba(29, 185, 84, 0.1); color: #1DB954; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center;">In Stock</div>'}
        </div>
    `).join('');
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

