// StockMaster - Products Module

let currentView = localStorage.getItem('productsView') || 'list';

function loadProducts() {
    const products = getProducts();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('filterCategory')?.value || '';
    const locationFilter = document.getElementById('filterLocation')?.value || '';
    const stockFilter = document.getElementById('filterStock')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    
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
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            (product.category || '').toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || (product.category === categoryFilter);
        return matchesSearch && matchesCategory;
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

// --- New UI helpers for product management sections ---
function populateUpdateProductForm() {
    const select = document.getElementById('updateProductSelect');
    const locationSelect = document.getElementById('updateProductLocation');
    const products = getProducts();
    const warehouses = getWarehouses();
    if (!select) return;
    select.innerHTML = products.map(p => `<option value="${p.id}">${p.name} (${p.sku})</option>`).join('');
    // populate category select
    const categorySelect = document.getElementById('updateProductCategory');
    if (categorySelect) {
        const categories = getCategories();
        categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    if (locationSelect) {
        locationSelect.innerHTML = warehouses.map(w => `<option value="${w}">${w}</option>`).join('');
    }

    select.addEventListener('change', () => {
        const id = parseInt(select.value);
        const product = products.find(p => p.id === id);
        if (product) {
            if (categorySelect) categorySelect.value = product.category || '';
            document.getElementById('updateProductUnit').value = product.unit || '';
            document.getElementById('updateProductLocation').value = product.location || '';
            document.getElementById('updateProductPrice').value = product.price || '';
            document.getElementById('updateProductStock').value = product.stock || 0;
        }
    });

    // trigger initial populate
    if (select.options.length > 0) select.dispatchEvent(new Event('change'));
}

function handleUpdateProductSave() {
    const form = document.getElementById('updateProductForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('updateProductSelect').value);
        const updates = {
            category: document.getElementById('updateProductCategory').value,
            unit: document.getElementById('updateProductUnit').value,
            location: document.getElementById('updateProductLocation').value,
            price: parseFloat(document.getElementById('updateProductPrice').value) || 0,
            stock: parseInt(document.getElementById('updateProductStock').value) || 0
        };
        const updated = updateProduct(id, updates);
        if (updated) {
            alert('Product updated');
            loadProducts();
            populateUpdateProductForm();
        } else {
            alert('Could not update product');
        }
    });

    const resetBtn = document.getElementById('resetProductBtn');
    resetBtn?.addEventListener('click', () => {
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        populateUpdateProductForm();
    });
}

function loadStockAvailability() {
    const container = document.getElementById('stockAvailabilityContainer');
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    if (!container) return;
    const products = getProducts();
    const warehouses = getWarehouses();

    // Group products by warehouse
    const byWarehouse = {};
    warehouses.forEach(w => byWarehouse[w] = []);
    products.forEach(p => {
        const loc = p.location || (warehouses[0] || 'WH1');
        if (!byWarehouse[loc]) byWarehouse[loc] = [];
        byWarehouse[loc].push(p);
    });

    let html = '';
    Object.keys(byWarehouse).forEach(w => {
        html += `<div style="margin-bottom:16px;"><h3 style="margin:0 0 8px 0;color:#202124">${w}</h3>`;
        if (byWarehouse[w].length === 0) {
            html += '<p style="color:#5F6368">No products in this warehouse</p>';
        } else {
            html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">';
            byWarehouse[w].forEach(p => {
                html += `
                    <div style="background:#F8F9FA;padding:12px;border-radius:8px;">
                        <div style="font-weight:600;color:#202124">${p.name}</div>
                        <div style="color:#5F6368;font-size:13px">SKU: ${p.sku}</div>
                        <div style="margin-top:8px;font-size:16px;font-weight:600;color:${p.stock<10? '#D32F2F':'#1DB954'}">${p.stock}</div>
                        <div style="color:#5F6368;font-size:12px">in stock</div>
                    </div>
                `;
            });
            html += '</div>';
        }
        html += '</div>';
    });

    container.innerHTML = html;
}
            ${product.stock < 10 ? '<div style="padding: 6px 10px; background: rgba(211, 47, 47, 0.1); color: #D32F2F; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center;">Low Stock</div>' : '<div style="padding: 6px 10px; background: rgba(29, 185, 84, 0.1); color: #1DB954; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center;">In Stock</div>'}
            ${(() => {
                // show reorder suggestion if rule exists and stock below rule
                const rules = getReorderRules();
                const rule = rules[product.id];
                if (rule && typeof rule.min === 'number' && product.stock < rule.min) {
                    return `<div style="margin-top:8px;padding:8px;border-radius:6px;background:rgba(249,171,0,0.08);color:#F9AB00;font-size:12px;font-weight:600;text-align:center;">Below Reorder Point • Suggest: ${rule.qty}${rule.preferredVendor ? ' • Vendor: '+rule.preferredVendor : ''}</div>`;
                }
                return '';
            })()}
function loadCategoriesSection() {
    const list = document.getElementById('categoriesList');
    const addBtn = document.getElementById('addCategoryBtn');
    const input = document.getElementById('newCategoryInput');
    if (!list) return;
    const categories = getCategories();
    list.innerHTML = categories.map(c => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04)">
            <div style="font-size:14px;color:#202124">${c}</div>
            <button class="btn-primary" style="background:#F1F3F4;color:#202124;box-shadow:none" data-cat="${c}">Remove</button>
        </div>
    `).join('');

    // remove handlers
    Array.from(list.querySelectorAll('button[data-cat]')).forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-cat');
            if (confirm(`Remove category "${cat}"?`)) {
                removeCategory(cat);
                loadCategoriesSection();
                loadProducts();
            }
        });
    });

    addBtn?.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return alert('Enter a category');
        addCategory(val);
        input.value = '';
        loadCategoriesSection();
        populateUpdateProductForm();
    });
}

function loadReorderRulesSection() {
    const productSelect = document.getElementById('reorderProductSelect');
    const minInput = document.getElementById('reorderMinInput');
    const qtyInput = document.getElementById('reorderQtyInput');
    const saveBtn = document.getElementById('saveReorderRuleBtn');
    const clearBtn = document.getElementById('clearReorderRuleBtn');
    const list = document.getElementById('reorderRulesList');
    if (!productSelect) return;
    const products = getProducts();
    productSelect.innerHTML = products.map(p => `<option value="${p.id}">${p.name} (${p.sku})</option>`).join('');

    function renderRules() {
        const rules = getReorderRules();
        const entries = Object.keys(rules).map(k => ({ productId: k, rule: rules[k] }));
        if (entries.length === 0) {
            list.innerHTML = '<p style="color:#5F6368">No reorder rules set</p>';
            return;
        }
        list.innerHTML = entries.map(e => {
                    ${product.stock < 10 ? '<div style="color: #D32F2F; font-size: 11px; margin-top: 8px; font-weight: 500; padding: 4px 8px; background: rgba(211, 47, 47, 0.1); border-radius: 4px; display: inline-block;">Low Stock</div>' : ''}
                    ${(() => {
                        const rules = getReorderRules();
                        const rule = rules[product.id];
                        if (rule && typeof rule.min === 'number' && product.stock < rule.min) {
                            return `<div style="margin-top:8px;color:#F9AB00;font-size:13px;font-weight:600;">Below Reorder Point — Suggest ${rule.qty}${rule.preferredVendor ? ' (Vendor: '+rule.preferredVendor+')' : ''}</div>`;
                        }
                        return '';
                    })()}
            return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04)">
                <div><strong>${p? p.name : 'Unknown'}</strong><div style="color:#5F6368;font-size:12px">Min: ${e.rule.min} • Qty: ${e.rule.qty}</div></div>
                <div><button data-prod="${e.productId}" style="background:#F1F3F4;border:none;padding:8px;border-radius:6px;">Remove</button></div>
            </div>`;
        }).join('');

        Array.from(list.querySelectorAll('button[data-prod]')).forEach(btn => {
            btn.addEventListener('click', () => {
                const pid = btn.getAttribute('data-prod');
                if (confirm('Remove reorder rule?')) {
                    removeReorderRule(pid);
                    renderRules();
                }
            });
        });
    }

    saveBtn?.addEventListener('click', () => {
        const pid = parseInt(productSelect.value);
        const min = parseInt(minInput.value) || 0;
        const qty = parseInt(qtyInput.value) || 0;
        const vendor = document.getElementById('reorderVendorInput')?.value || '';
        if (!pid) return alert('Select product');
        saveReorderRule(pid, { min, qty, vendor });
        renderRules();
        minInput.value = '';
        qtyInput.value = '';
        document.getElementById('reorderVendorInput') && (document.getElementById('reorderVendorInput').value = '');
    });

    clearBtn?.addEventListener('click', () => {
        const pid = parseInt(productSelect.value);
        if (!pid) return alert('Select product');
        removeReorderRule(pid);
        renderRules();
    });

    renderRules();
}

// Public initializer for the extra sections
function initProductManagementSections() {
    populateUpdateProductForm();
    handleUpdateProductSave();
    loadStockAvailability();
    loadCategoriesSection();
    loadReorderRulesSection();

    // populate category filter in header
    const catFilter = document.getElementById('categoryFilter');
    if (catFilter) {
        const categories = getCategories();
        catFilter.innerHTML = '<option value="">All Categories</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
}

// Dev helper: seed demo data via standard procedures (uses addCategory/addWarehouse/addProduct)
// This avoids direct localStorage writes and exercises the normal code paths.
function seedDemoData(force = false) {
    try {
        const existing = getProducts();
        if (existing.length > 0 && !force) {
            alert('Products already exist. Use force=true to override.');
            return;
        }

        // Categories
        const demoCategories = ['Electronics', 'Accessories', 'Office Supplies', 'Furniture'];
        demoCategories.forEach(cat => {
            const cats = getCategories();
            if (!cats.includes(cat)) addCategory(cat);
        });

        // Warehouses
        const demoWarehouses = ['WH1', 'WH2'];
        demoWarehouses.forEach(w => {
            const whs = getWarehouses();
            if (!whs.includes(w)) addWarehouse(w);
        });

        // Sample products (only add if SKU not present)
        const samples = [
            { name: 'Laptop Dell XPS', sku: 'LAP-DELL-001', category: 'Electronics', unit: 'Unit', stock: 25, location: 'WH1', price: 1299.99 },
            { name: 'Wireless Mouse', sku: 'ACC-MSE-001', category: 'Accessories', unit: 'Unit', stock: 120, location: 'WH1', price: 29.99 },
            { name: 'USB-C Cable', sku: 'ACC-CBL-001', category: 'Accessories', unit: 'Unit', stock: 80, location: 'WH2', price: 19.99 },
            { name: 'Monitor 27"', sku: 'MON-27-001', category: 'Electronics', unit: 'Unit', stock: 32, location: 'WH1', price: 399.99 },
            { name: 'Keyboard Mechanical', sku: 'ACC-KBD-001', category: 'Accessories', unit: 'Unit', stock: 45, location: 'WH2', price: 89.99 }
        ];

        const existingSkus = getProducts().map(p => p.sku);
        samples.forEach(s => {
            if (!existingSkus.includes(s.sku)) {
                addProduct({ name: s.name, sku: s.sku, category: s.category, unit: s.unit, stock: s.stock, location: s.location, price: s.price });
            }
        });

        // Refresh UI sections
        if (typeof loadProductFilters === 'function') loadProductFilters();
        if (typeof loadProducts === 'function') loadProducts();
        if (typeof initProductManagementSections === 'function') initProductManagementSections();

        alert('Demo data seeded (via standard add functions).');
    } catch (err) {
        console.error('Seed demo data error:', err);
        alert('Failed to seed demo data — see console for details.');
    }
}

// Expose globally for pages to call (dev helper)
window.seedDemoData = seedDemoData;

