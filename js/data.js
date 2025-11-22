// StockMaster - Data Storage (Simulation)
// All data stored in localStorage for persistence

// Initialize data structures if they don't exist
function initializeData() {
    if (!localStorage.getItem('stockmaster_products')) {
        localStorage.setItem('stockmaster_products', JSON.stringify([
            { id: 1, name: 'Laptop Dell XPS', sku: 'LAP-DELL-001', category: 'Electronics', unit: 'Unit', stock: 45, location: 'WH1', price: 1299.99 },
            { id: 2, name: 'Wireless Mouse', sku: 'ACC-MSE-001', category: 'Accessories', unit: 'Unit', stock: 120, location: 'WH1', price: 29.99 },
            { id: 3, name: 'USB-C Cable', sku: 'ACC-CBL-001', category: 'Accessories', unit: 'Unit', stock: 8, location: 'WH2', price: 19.99 },
            { id: 4, name: 'Monitor 27"', sku: 'MON-27-001', category: 'Electronics', unit: 'Unit', stock: 25, location: 'WH1', price: 399.99 },
            { id: 5, name: 'Keyboard Mechanical', sku: 'ACC-KBD-001', category: 'Accessories', unit: 'Unit', stock: 5, location: 'WH2', price: 89.99 }
        ]));
    }
    
    if (!localStorage.getItem('stockmaster_receipts')) {
        localStorage.setItem('stockmaster_receipts', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('stockmaster_deliveries')) {
        localStorage.setItem('stockmaster_deliveries', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('stockmaster_transfers')) {
        localStorage.setItem('stockmaster_transfers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('stockmaster_adjustments')) {
        localStorage.setItem('stockmaster_adjustments', JSON.stringify([]));
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
        localStorage.setItem('stockmaster_customers', JSON.stringify([
            { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '+1-555-0101', address: '123 Business St', city: 'New York', country: 'USA', type: 'Corporate', status: 'Active', createdAt: new Date().toISOString() },
            { id: 2, name: 'Tech Solutions Inc', email: 'info@techsol.com', phone: '+1-555-0102', address: '456 Tech Ave', city: 'San Francisco', country: 'USA', type: 'Corporate', status: 'Active', createdAt: new Date().toISOString() },
            { id: 3, name: 'John Smith', email: 'john@email.com', phone: '+1-555-0103', address: '789 Main St', city: 'Chicago', country: 'USA', type: 'Individual', status: 'Active', createdAt: new Date().toISOString() }
        ]));
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
        
        // Add to history
        addToHistory({
            type: 'Adjustment',
            productId: adjustment.productId,
            quantity: difference,
            location: adjustment.location,
            details: `Adjustment #${adjustment.id}: System ${systemStock} → Physical ${adjustment.physicalCount} (${difference > 0 ? '+' : ''}${difference})`
        });
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
    }
}

function removeWarehouse(warehouse) {
    const warehouses = getWarehouses();
    const filtered = warehouses.filter(w => w !== warehouse);
    localStorage.setItem('stockmaster_warehouses', JSON.stringify(filtered));
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
    }
}

function removeCategory(category) {
    const categories = getCategories();
    const filtered = categories.filter(c => c !== category);
    localStorage.setItem('stockmaster_categories', JSON.stringify(filtered));
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
    return customer;
}

function updateCustomer(customerId, updates) {
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === customerId);
    if (index !== -1) {
        customers[index] = { ...customers[index], ...updates };
        saveCustomers(customers);
        return customers[index];
    }
    return null;
}

function deleteCustomer(customerId) {
    const customers = getCustomers();
    const filtered = customers.filter(c => c.id !== customerId);
    saveCustomers(filtered);
}

// Initialize on load
if (typeof window !== 'undefined') {
    initializeData();
}

