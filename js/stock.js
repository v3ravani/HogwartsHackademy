// StockMaster - Stock Overview Module

function loadStock() {
    const products = getProducts();
    const warehouses = getWarehouses();
    const categories = getCategories();
    
    // Update filters
    updateFilters(warehouses, categories);
    
    // Get filter values
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const stockFilter = document.getElementById('stockFilter')?.value || '';
    
    // Filter products
    let filteredProducts = products.filter(product => {
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.location.toLowerCase().includes(searchTerm);
        
        const matchesLocation = !locationFilter || product.location === locationFilter;
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        let matchesStock = true;
        if (stockFilter === 'low') {
            matchesStock = product.stock < 10;
        } else if (stockFilter === 'ok') {
            matchesStock = product.stock >= 10;
        }
        
        return matchesSearch && matchesLocation && matchesCategory && matchesStock;
    });
    
    // Update stats
    updateStats(products);
    
    // Display stock table
    displayStockTable(filteredProducts);
}

function updateFilters(warehouses, categories) {
    const locationSelect = document.getElementById('locationFilter');
    const categorySelect = document.getElementById('categoryFilter');
    
    if (locationSelect) {
        const currentValue = locationSelect.value;
        locationSelect.innerHTML = '<option value="">All Locations</option>' + 
            warehouses.map(wh => `<option value="${wh}" ${wh === currentValue ? 'selected' : ''}>${wh}</option>`).join('');
    }
    
    if (categorySelect) {
        const currentValue = categorySelect.value;
        categorySelect.innerHTML = '<option value="">All Categories</option>' + 
            categories.map(cat => `<option value="${cat}" ${cat === currentValue ? 'selected' : ''}>${cat}</option>`).join('');
    }
}

function updateStats(products) {
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * (p.price || 0)), 0);
    const warehouses = getWarehouses();
    const totalWarehouses = warehouses.length;
    
    const totalProductsEl = document.getElementById('totalProducts');
    const totalValueEl = document.getElementById('totalValue');
    const lowStockEl = document.getElementById('lowStock');
    const totalWarehousesEl = document.getElementById('totalWarehouses');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (totalValueEl) totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
    if (lowStockEl) lowStockEl.textContent = lowStockItems;
    if (totalWarehousesEl) totalWarehousesEl.textContent = totalWarehouses;
}

function displayStockTable(products) {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #5F6368;">No products found</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => {
        const totalValue = product.stock * (product.price || 0);
        let stockStatus = 'stock-ok';
        let statusText = 'In Stock';
        
        if (product.stock < 10) {
            stockStatus = 'stock-low';
            statusText = 'Low Stock';
        } else if (product.stock < 30) {
            stockStatus = 'stock-medium';
            statusText = 'Medium Stock';
        }
        
        return `
            <tr>
                <td><strong>${product.name}</strong></td>
                <td>${product.sku}</td>
                <td>${product.category}</td>
                <td>${product.location}</td>
                <td><strong>${product.stock}</strong> ${product.unit || 'Unit'}</td>
                <td>$${(product.price || 0).toFixed(2)}</td>
                <td><strong>$${totalValue.toFixed(2)}</strong></td>
                <td><span class="stock-badge ${stockStatus}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

