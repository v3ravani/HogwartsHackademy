// StockMaster - MySQL Sync Helper
// Syncs localStorage data to MySQL database in the background

const API_BASE = 'api/';

// Helper function to call API (non-blocking, errors are silent)
async function syncToMySQL(endpoint, method = 'POST', data = null) {
    try {
        const url = API_BASE + endpoint;
        console.log('🔄 Syncing to MySQL:', url, method);
        if (data) console.log('📦 Data:', data);
        
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            let errorText = 'Unknown error';
            try {
                const error = await response.json();
                errorText = error.error || JSON.stringify(error);
            } catch (e) {
                errorText = await response.text();
            }
            console.error('❌ MySQL sync failed:', endpoint);
            console.error('   Status:', response.status, response.statusText);
            console.error('   Error:', errorText);
            console.error('   URL:', url);
        } else {
            const result = await response.json();
            console.log('✅ MySQL sync success:', endpoint);
            if (result.id) console.log('   ID:', result.id);
        }
    } catch (error) {
        // Show detailed error
        console.error('❌ MySQL sync error:', endpoint);
        console.error('   Error type:', error.name);
        console.error('   Error message:', error.message);
        console.error('   Full error:', error);
        console.error('   API URL:', API_BASE + endpoint);
        console.log('💡 Tip: Make sure PHP server is running: php -S localhost:8000');
        console.log('💡 Tip: Check if API is accessible: http://localhost:8000/api/' + endpoint);
    }
}

// Sync product to MySQL
async function syncProduct(product) {
    // Check if product exists in MySQL
    try {
        const checkResponse = await fetch(`${API_BASE}products.php?id=${product.id}`);
        const exists = checkResponse.ok;
        
        if (exists) {
            // Update existing product
            await syncToMySQL('products.php', 'PUT', {
                id: product.id,
                name: product.name,
                sku: product.sku,
                category: product.category,
                unit: product.unit,
                stock: product.stock,
                location: product.location,
                price: product.price
            });
        } else {
            // Create new product
            await syncToMySQL('products.php', 'POST', {
                name: product.name,
                sku: product.sku,
                category: product.category,
                unit: product.unit,
                location: product.location,
                stock: product.stock,
                price: product.price
            });
        }
    } catch (error) {
        console.warn('Product sync error:', error);
    }
}

// Sync receipt to MySQL
async function syncReceipt(receipt) {
    await syncToMySQL('receipts.php', 'POST', {
        supplier: receipt.supplier,
        warehouse: receipt.warehouse,
        status: receipt.status || 'Done',
        products: receipt.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity
        }))
    });
}

// Sync delivery to MySQL
async function syncDelivery(delivery) {
    await syncToMySQL('deliveries.php', 'POST', {
        customer: delivery.customer,
        warehouse: delivery.warehouse,
        status: delivery.status || 'Done',
        products: delivery.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity
        }))
    });
}

// Sync transfer to MySQL
async function syncTransfer(transfer) {
    await syncToMySQL('transfers.php', 'POST', {
        fromLocation: transfer.fromLocation,
        toLocation: transfer.toLocation,
        status: transfer.status || 'Done',
        products: transfer.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity
        }))
    });
}

// Sync adjustment to MySQL
async function syncAdjustment(adjustment) {
    await syncToMySQL('adjustments.php', 'POST', {
        productId: adjustment.productId,
        location: adjustment.location,
        physicalCount: adjustment.physicalCount,
        reason: adjustment.reason || null
    });
}

// Sync customer to MySQL
async function syncCustomer(customer) {
    try {
        const checkResponse = await fetch(`${API_BASE}customers.php?id=${customer.id}`);
        const exists = checkResponse.ok;
        
        if (exists) {
            await syncToMySQL('customers.php', 'PUT', {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                country: customer.country,
                type: customer.type,
                status: customer.status
            });
        } else {
            await syncToMySQL('customers.php', 'POST', {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                country: customer.country,
                type: customer.type,
                status: customer.status
            });
        }
    } catch (error) {
        console.warn('Customer sync error:', error);
    }
}

// Sync warehouse to MySQL
async function syncWarehouse(warehouseCode) {
    await syncToMySQL('warehouses.php', 'POST', {
        code: warehouseCode,
        name: warehouseCode,
        address: '',
        city: '',
        country: 'USA'
    });
}

// Sync category to MySQL
async function syncCategory(categoryName) {
    await syncToMySQL('categories.php', 'POST', {
        name: categoryName,
        description: ''
    });
}

// Delete warehouse from MySQL
async function deleteWarehouseFromMySQL(warehouseCode) {
    await syncToMySQL(`warehouses.php?code=${warehouseCode}`, 'DELETE');
}

// Delete category from MySQL
async function deleteCategoryFromMySQL(categoryName) {
    await syncToMySQL(`categories.php?name=${categoryName}`, 'DELETE');
}

// Delete customer from MySQL
async function deleteCustomerFromMySQL(customerId) {
    await syncToMySQL(`customers.php?id=${customerId}`, 'DELETE');
}

