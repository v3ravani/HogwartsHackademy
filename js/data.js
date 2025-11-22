// StockMaster - Data Storage (Simulation)
// All data stored in localStorage for persistence

// Initialize data structures if they don't exist
function initializeData() {
    if (!localStorage.getItem('stockmaster_products')) {
        localStorage.setItem('stockmaster_products', JSON.stringify([
            { id: 1, name: 'Laptop Dell XPS', sku: 'LAP-DELL-001', category: 'Electronics', unit: 'Unit', stock: 77, location: 'WH1', price: 1299.99 },
            { id: 2, name: 'Wireless Mouse', sku: 'ACC-MSE-001', category: 'Accessories', unit: 'Unit', stock: 120, location: 'WH1', price: 29.99 },
            { id: 3, name: 'USB-C Cable', sku: 'ACC-CBL-001', category: 'Accessories', unit: 'Unit', stock: 8, location: 'WH2', price: 19.99 },
            { id: 4, name: 'Monitor 27"', sku: 'MON-27-001', category: 'Electronics', unit: 'Unit', stock: 32, location: 'WH1', price: 399.99 },
            { id: 5, name: 'Keyboard Mechanical', sku: 'ACC-KBD-001', category: 'Accessories', unit: 'Unit', stock: 5, location: 'WH2', price: 89.99 },
            { id: 6, name: 'Gaming Mouse', sku: 'ACC-GMS-001', category: 'Accessories', unit: 'Unit', stock: 45, location: 'WH1', price: 79.99 },
            { id: 7, name: 'HDMI Cable', sku: 'ACC-HDM-001', category: 'Accessories', unit: 'Unit', stock: 150, location: 'WH1', price: 12.99 },
            { id: 8, name: 'Webcam HD', sku: 'ACC-WBC-001', category: 'Electronics', unit: 'Unit', stock: 30, location: 'WH1', price: 59.99 },
            { id: 9, name: 'Laptop Stand', sku: 'ACC-LST-001', category: 'Accessories', unit: 'Unit', stock: 3, location: 'WH2', price: 45.99 },
            { id: 10, name: 'USB Hub', sku: 'ACC-USB-001', category: 'Accessories', unit: 'Unit', stock: 60, location: 'WH1', price: 34.99 },
            { id: 11, name: 'Monitor 24"', sku: 'MON-24-001', category: 'Electronics', unit: 'Unit', stock: 18, location: 'WH2', price: 249.99 },
            { id: 12, name: 'Laptop Bag', sku: 'ACC-LBG-001', category: 'Accessories', unit: 'Unit', stock: 25, location: 'WH1', price: 39.99 }
        ]));
    }
    
    if (!localStorage.getItem('stockmaster_receipts')) {
        const now = new Date();
        localStorage.setItem('stockmaster_receipts', JSON.stringify([
            {
                id: 1,
                supplier: 'Tech Suppliers Inc',
                warehouse: 'WH1',
                date: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 1, quantity: 10 },
                    { productId: 2, quantity: 50 },
                    { productId: 4, quantity: 5 }
                ]
            },
            {
                id: 2,
                supplier: 'Global Electronics',
                warehouse: 'WH1',
                date: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 1, quantity: 15 },
                    { productId: 3, quantity: 30 }
                ]
            },
            {
                id: 3,
                supplier: 'Accessories Plus',
                warehouse: 'WH2',
                date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 2, quantity: 70 },
                    { productId: 5, quantity: 20 }
                ]
            },
            {
                id: 4,
                supplier: 'Office Supply Co',
                warehouse: 'WH1',
                date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 4, quantity: 10 },
                    { productId: 5, quantity: 15 }
                ]
            },
            {
                id: 5,
                supplier: 'Tech Distributors',
                warehouse: 'WH2',
                date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 1, quantity: 20 },
                    { productId: 3, quantity: 25 }
                ]
            }
        ]));
    }
    
    if (!localStorage.getItem('stockmaster_deliveries')) {
        const now = new Date();
        localStorage.setItem('stockmaster_deliveries', JSON.stringify([
            {
                id: 1,
                customer: 'Acme Corporation',
                warehouse: 'WH1',
                date: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 1, quantity: 5 },
                    { productId: 2, quantity: 20 }
                ]
            },
            {
                id: 2,
                customer: 'Tech Solutions Inc',
                warehouse: 'WH1',
                date: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 4, quantity: 3 },
                    { productId: 5, quantity: 8 }
                ]
            },
            {
                id: 3,
                customer: 'John Smith',
                warehouse: 'WH2',
                date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 2, quantity: 5 },
                    { productId: 3, quantity: 10 }
                ]
            },
            {
                id: 4,
                customer: 'Acme Corporation',
                warehouse: 'WH1',
                date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 1, quantity: 8 }
                ]
            }
        ]));
    }
    
    if (!localStorage.getItem('stockmaster_transfers')) {
        const now = new Date();
        localStorage.setItem('stockmaster_transfers', JSON.stringify([
            {
                id: 1,
                fromLocation: 'WH1',
                toLocation: 'WH2',
                date: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 2, quantity: 25 },
                    { productId: 4, quantity: 3 }
                ]
            },
            {
                id: 2,
                fromLocation: 'WH2',
                toLocation: 'WH1',
                date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 3, quantity: 15 }
                ]
            },
            {
                id: 3,
                fromLocation: 'WH1',
                toLocation: 'WH2',
                date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Done',
                products: [
                    { productId: 1, quantity: 5 },
                    { productId: 5, quantity: 10 }
                ]
            }
        ]));
    }
    
    if (!localStorage.getItem('stockmaster_adjustments')) {
        const now = new Date();
        localStorage.setItem('stockmaster_adjustments', JSON.stringify([
            {
                id: 1,
                productId: 3,
                location: 'WH2',
                physicalCount: 8,
                systemStock: 10,
                date: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                productId: 5,
                location: 'WH2',
                physicalCount: 5,
                systemStock: 3,
                date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                productId: 2,
                location: 'WH1',
                physicalCount: 120,
                systemStock: 125,
                date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]));
    }
    
    if (!localStorage.getItem('stockmaster_history')) {
        localStorage.setItem('stockmaster_history', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('stockmaster_warehouses')) {
        localStorage.setItem('stockmaster_warehouses', JSON.stringify(['WH1', 'WH2']));
    }
    
    if (!localStorage.getItem('stockmaster_categories')) {
        localStorage.setItem('stockmaster_categories', JSON.stringify(['Electronics', 'Accessories', 'Office Supplies', 'Furniture']));
    }
    
    if (!localStorage.getItem('stockmaster_customers')) {
        const now = new Date();
        localStorage.setItem('stockmaster_customers', JSON.stringify([
            { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '+1-555-0101', address: '123 Business St', city: 'New York', country: 'USA', type: 'Corporate', status: 'Active', createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 2, name: 'Tech Solutions Inc', email: 'info@techsol.com', phone: '+1-555-0102', address: '456 Tech Ave', city: 'San Francisco', country: 'USA', type: 'Corporate', status: 'Active', createdAt: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 3, name: 'John Smith', email: 'john@email.com', phone: '+1-555-0103', address: '789 Main St', city: 'Chicago', country: 'USA', type: 'Individual', status: 'Active', createdAt: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 4, name: 'Global Systems Ltd', email: 'sales@globalsys.com', phone: '+1-555-0201', address: '321 Corporate Blvd', city: 'Los Angeles', country: 'USA', type: 'Corporate', status: 'Active', createdAt: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 5, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1-555-0202', address: '555 Oak Street', city: 'Boston', country: 'USA', type: 'Individual', status: 'Active', createdAt: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 6, name: 'Innovation Labs', email: 'info@inno-labs.com', phone: '+1-555-0203', address: '789 Innovation Drive', city: 'Seattle', country: 'USA', type: 'Corporate', status: 'Active', createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 7, name: 'Mike Williams', email: 'mike.w@email.com', phone: '+1-555-0204', address: '222 Elm Avenue', city: 'Austin', country: 'USA', type: 'Individual', status: 'Active', createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() }
        ]));
    }
    
    // Initialize history with mock data if empty
    if (!localStorage.getItem('stockmaster_history') || JSON.parse(localStorage.getItem('stockmaster_history') || '[]').length === 0) {
        const now = new Date();
        const history = [
            {
                id: 1,
                type: 'Receipt',
                productId: [1, 2, 4],
                quantity: 65,
                location: 'WH1',
                timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Receipt #1 from Tech Suppliers Inc'
            },
            {
                id: 2,
                type: 'Delivery',
                productId: [1, 2],
                quantity: 25,
                location: 'WH1',
                timestamp: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Delivery #1 to Acme Corporation'
            },
            {
                id: 3,
                type: 'Receipt',
                productId: [1, 3],
                quantity: 45,
                location: 'WH1',
                timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Receipt #2 from Global Electronics'
            },
            {
                id: 4,
                type: 'Transfer',
                productId: [2, 4],
                quantity: 28,
                location: 'WH1 → WH2',
                timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Transfer #1'
            },
            {
                id: 5,
                type: 'Delivery',
                productId: [4, 5],
                quantity: 11,
                location: 'WH1',
                timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Delivery #2 to Tech Solutions Inc'
            },
            {
                id: 6,
                type: 'Adjustment',
                productId: 3,
                quantity: -2,
                location: 'WH2',
                timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Adjustment #1: System 10 → Physical 8 (-2)'
            },
            {
                id: 7,
                type: 'Receipt',
                productId: [2, 5],
                quantity: 90,
                location: 'WH2',
                timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Receipt #3 from Accessories Plus'
            },
            {
                id: 8,
                type: 'Transfer',
                productId: [3],
                quantity: 15,
                location: 'WH2 → WH1',
                timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Transfer #2'
            },
            {
                id: 9,
                type: 'Delivery',
                productId: [2, 3],
                quantity: 15,
                location: 'WH2',
                timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Delivery #3 to John Smith'
            },
            {
                id: 10,
                type: 'Receipt',
                productId: [4, 5],
                quantity: 25,
                location: 'WH1',
                timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Receipt #4 from Office Supply Co'
            },
            {
                id: 11,
                type: 'Adjustment',
                productId: 5,
                quantity: 2,
                location: 'WH2',
                timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Adjustment #2: System 3 → Physical 5 (+2)'
            },
            {
                id: 12,
                type: 'Receipt',
                productId: [1, 3],
                quantity: 45,
                location: 'WH2',
                timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Receipt #5 from Tech Distributors'
            },
            {
                id: 13,
                type: 'Transfer',
                productId: [1, 5],
                quantity: 15,
                location: 'WH1 → WH2',
                timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Transfer #3'
            },
            {
                id: 14,
                type: 'Delivery',
                productId: [1],
                quantity: 8,
                location: 'WH1',
                timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Delivery #4 to Acme Corporation'
            },
            {
                id: 15,
                type: 'Adjustment',
                productId: 2,
                quantity: -5,
                location: 'WH1',
                timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Adjustment #3: System 125 → Physical 120 (-5)'
            }
        ];
        localStorage.setItem('stockmaster_history', JSON.stringify(history));
    }
}

// Product functions
function getProducts() {
    return JSON.parse(localStorage.getItem('stockmaster_products') || '[]');
}

function saveProducts(products) {
    localStorage.setItem('stockmaster_products', JSON.stringify(products));
}

function addProduct(product) {
    const products = getProducts();
    product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    if (!product.stock) product.stock = 0;
    if (!product.location) product.location = 'WH1';
    products.push(product);
    saveProducts(products);
    
    // Sync to MySQL (non-blocking)
    if (typeof syncProduct === 'function') {
        syncProduct(product).catch(() => {}); // Silent fail
    }
    
    return product;
}

function updateProductStock(productId, quantity, operation = 'add') {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        if (operation === 'add') {
            product.stock += quantity;
        } else if (operation === 'subtract') {
            product.stock = Math.max(0, product.stock - quantity);
        }
        saveProducts(products);
        
        // Sync to MySQL (non-blocking)
        if (typeof syncProduct === 'function') {
            syncProduct(product).catch(() => {}); // Silent fail
        }
    }
}

// Receipt functions
function getReceipts() {
    return JSON.parse(localStorage.getItem('stockmaster_receipts') || '[]');
}

function addReceipt(receipt) {
    const receipts = getReceipts();
    receipt.id = receipts.length > 0 ? Math.max(...receipts.map(r => r.id)) + 1 : 1;
    receipt.date = new Date().toISOString();
    receipt.status = receipt.status || 'Draft';
    receipts.push(receipt);
    localStorage.setItem('stockmaster_receipts', JSON.stringify(receipts));
    
    // Update stock
    receipt.products.forEach(item => {
        updateProductStock(item.productId, item.quantity, 'add');
    });
    
    // Add to history
    addToHistory({
        type: 'Receipt',
        productId: receipt.products.map(p => p.productId),
        quantity: receipt.products.reduce((sum, p) => sum + p.quantity, 0),
        location: receipt.warehouse || 'WH1',
        details: `Receipt #${receipt.id} from ${receipt.supplier}`
    });
    
    // Sync to MySQL (non-blocking)
    if (typeof syncReceipt === 'function') {
        syncReceipt(receipt).catch(() => {}); // Silent fail
    }
    
    return receipt;
}

// Delivery functions
function getDeliveries() {
    return JSON.parse(localStorage.getItem('stockmaster_deliveries') || '[]');
}

function addDelivery(delivery) {
    const deliveries = getDeliveries();
    delivery.id = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
    delivery.date = new Date().toISOString();
    delivery.status = delivery.status || 'Draft';
    deliveries.push(delivery);
    localStorage.setItem('stockmaster_deliveries', JSON.stringify(deliveries));
    
    // Update stock
    delivery.products.forEach(item => {
        updateProductStock(item.productId, item.quantity, 'subtract');
    });
    
    // Add to history
    addToHistory({
        type: 'Delivery',
        productId: delivery.products.map(p => p.productId),
        quantity: delivery.products.reduce((sum, p) => sum + p.quantity, 0),
        location: delivery.warehouse || 'WH1',
        details: `Delivery #${delivery.id} to ${delivery.customer}`
    });
    
    // Sync to MySQL (non-blocking)
    if (typeof syncDelivery === 'function') {
        syncDelivery(delivery).catch(() => {}); // Silent fail
    }
    
    return delivery;
}

// Transfer functions
function getTransfers() {
    return JSON.parse(localStorage.getItem('stockmaster_transfers') || '[]');
}

function addTransfer(transfer) {
    const transfers = getTransfers();
    transfer.id = transfers.length > 0 ? Math.max(...transfers.map(t => t.id)) + 1 : 1;
    transfer.date = new Date().toISOString();
    transfer.status = transfer.status || 'Draft';
    transfers.push(transfer);
    localStorage.setItem('stockmaster_transfers', JSON.stringify(transfers));
    
    // Update stock locations (subtract from source, add to destination)
    transfer.products.forEach(item => {
        const products = getProducts();
        const product = products.find(p => p.id === item.productId);
        if (product && product.location === transfer.fromLocation) {
            product.stock = Math.max(0, product.stock - item.quantity);
            // In a real system, we'd track multiple locations per product
            // For simplicity, we'll just update the location
            product.location = transfer.toLocation;
            saveProducts(products);
            
            // Sync product to MySQL (non-blocking)
            if (typeof syncProduct === 'function') {
                syncProduct(product).catch(() => {}); // Silent fail
            }
        }
    });
    
    // Add to history
    addToHistory({
        type: 'Transfer',
        productId: transfer.products.map(p => p.productId),
        quantity: transfer.products.reduce((sum, p) => sum + p.quantity, 0),
        location: `${transfer.fromLocation} → ${transfer.toLocation}`,
        details: `Transfer #${transfer.id}`
    });
    
    // Sync to MySQL (non-blocking)
    if (typeof syncTransfer === 'function') {
        syncTransfer(transfer).catch(() => {}); // Silent fail
    }
    
    return transfer;
}

// Adjustment functions
function getAdjustments() {
    return JSON.parse(localStorage.getItem('stockmaster_adjustments') || '[]');
}

function addAdjustment(adjustment) {
    const adjustments = getAdjustments();
    adjustment.id = adjustments.length > 0 ? Math.max(...adjustments.map(a => a.id)) + 1 : 1;
    adjustment.date = new Date().toISOString();
    adjustments.push(adjustment);
    localStorage.setItem('stockmaster_adjustments', JSON.stringify(adjustments));
    
    const products = getProducts();
    const product = products.find(p => p.id === adjustment.productId);
    if (product) {
        const systemStock = product.stock;
        adjustment.systemStock = systemStock; // Store for display
        const difference = adjustment.physicalCount - systemStock;
        product.stock = adjustment.physicalCount;
        saveProducts(products);
        
        // Sync product to MySQL (non-blocking)
        if (typeof syncProduct === 'function') {
            syncProduct(product).catch(() => {}); // Silent fail
        }
        
        // Add to history
        addToHistory({
            type: 'Adjustment',
            productId: adjustment.productId,
            quantity: difference,
            location: adjustment.location,
            details: `Adjustment #${adjustment.id}: System ${systemStock} → Physical ${adjustment.physicalCount} (${difference > 0 ? '+' : ''}${difference})`
        });
    }
    
    // Sync to MySQL (non-blocking)
    if (typeof syncAdjustment === 'function') {
        syncAdjustment(adjustment).catch(() => {}); // Silent fail
    }
    
    return adjustment;
}

// History functions
function getHistory() {
    return JSON.parse(localStorage.getItem('stockmaster_history') || '[]');
}

function addToHistory(entry) {
    const history = getHistory();
    entry.id = history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1;
    entry.timestamp = new Date().toISOString();
    history.unshift(entry); // Add to beginning
    localStorage.setItem('stockmaster_history', JSON.stringify(history));
}

// Warehouse functions
function getWarehouses() {
    return JSON.parse(localStorage.getItem('stockmaster_warehouses') || '[]');
}

function addWarehouse(warehouse) {
    const warehouses = getWarehouses();
    if (!warehouses.includes(warehouse)) {
        warehouses.push(warehouse);
        localStorage.setItem('stockmaster_warehouses', JSON.stringify(warehouses));
        
        // Sync to MySQL (non-blocking)
        if (typeof syncWarehouse === 'function') {
            syncWarehouse(warehouse).catch(() => {}); // Silent fail
        }
    }
}

function removeWarehouse(warehouse) {
    const warehouses = getWarehouses();
    const filtered = warehouses.filter(w => w !== warehouse);
    localStorage.setItem('stockmaster_warehouses', JSON.stringify(filtered));
    
    // Sync to MySQL (non-blocking)
    if (typeof deleteWarehouseFromMySQL === 'function') {
        deleteWarehouseFromMySQL(warehouse).catch(() => {}); // Silent fail
    }
}

// Category functions
function getCategories() {
    return JSON.parse(localStorage.getItem('stockmaster_categories') || '[]');
}

function addCategory(category) {
    const categories = getCategories();
    if (!categories.includes(category)) {
        categories.push(category);
        localStorage.setItem('stockmaster_categories', JSON.stringify(categories));
        
        // Sync to MySQL (non-blocking)
        if (typeof syncCategory === 'function') {
            syncCategory(category).catch(() => {}); // Silent fail
        }
    }
}

function removeCategory(category) {
    const categories = getCategories();
    const filtered = categories.filter(c => c !== category);
    localStorage.setItem('stockmaster_categories', JSON.stringify(filtered));
    
    // Sync to MySQL (non-blocking)
    if (typeof deleteCategoryFromMySQL === 'function') {
        deleteCategoryFromMySQL(category).catch(() => {}); // Silent fail
    }
}

// Customer functions
function getCustomers() {
    return JSON.parse(localStorage.getItem('stockmaster_customers') || '[]');
}

function saveCustomers(customers) {
    localStorage.setItem('stockmaster_customers', JSON.stringify(customers));
}

function addCustomer(customer) {
    const customers = getCustomers();
    customer.id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    customer.createdAt = new Date().toISOString();
    customer.status = customer.status || 'Active';
    customers.push(customer);
    saveCustomers(customers);
    
    // Sync to MySQL (non-blocking)
    if (typeof syncCustomer === 'function') {
        syncCustomer(customer).catch(() => {}); // Silent fail
    }
    
    return customer;
}

function updateCustomer(customerId, updates) {
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
        customers[index] = { ...customers[index], ...updates };
        saveCustomers(customers);
        
        // Sync to MySQL (non-blocking)
        if (typeof syncCustomer === 'function') {
            syncCustomer(customers[index]).catch(() => {}); // Silent fail
        }
        
        return customers[index];
    }
    return null;
}

function deleteCustomer(customerId) {
    const customers = getCustomers();
    const filtered = customers.filter(c => c.id !== customerId);
    saveCustomers(filtered);
    
    // Sync to MySQL (non-blocking)
    if (typeof deleteCustomerFromMySQL === 'function') {
        deleteCustomerFromMySQL(customerId).catch(() => {}); // Silent fail
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    initializeData();
}
