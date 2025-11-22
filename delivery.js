// StockMaster - Delivery Module

function loadDeliveries() {
    const deliveries = getDeliveries();
    const products = getProducts();
    
    displayDeliveries(deliveries, products);
}

function displayDeliveries(deliveries, products) {
    const container = document.getElementById('deliveriesList');
    if (!container) return;
    
    if (deliveries.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);"><p style="font-size: 14px;">No deliveries found</p></div>';
        return;
    }
    
    container.innerHTML = deliveries.map(delivery => {
        const productList = delivery.products.map(item => {
            const product = products.find(p => p.id === item.productId);
            return `${product ? product.name : 'Unknown'} (${item.quantity})`;
        }).join(', ');
        
        const statusColors = {
            'Draft': { bg: 'rgba(95, 99, 104, 0.1)', color: '#5F6368' },
            'Waiting': { bg: 'rgba(249, 171, 0, 0.1)', color: '#F9AB00' },
            'Ready': { bg: 'rgba(26, 115, 232, 0.1)', color: '#1A73E8' },
            'Done': { bg: 'rgba(29, 185, 84, 0.1)', color: '#1DB954' },
            'Canceled': { bg: 'rgba(211, 47, 47, 0.1)', color: '#D32F2F' }
        };
        const statusStyle = statusColors[delivery.status] || statusColors['Draft'];
        
        return `
            <div class="delivery-card" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.2s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 12px 0; color: #202124; font-size: 18px; font-weight: 500; letter-spacing: -0.2px;">Delivery #${delivery.id}</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Customer</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${delivery.customer}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${new Date(delivery.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Warehouse</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${delivery.warehouse || 'WH1'}</p>
                            </div>
                        </div>
                    </div>
                    <span style="
                        padding: 6px 12px;
                        border-radius: 6px;
                        background: ${statusStyle.bg};
                        color: ${statusStyle.color};
                        font-size: 12px;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-left: 16px;
                    ">${delivery.status}</span>
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.06);">
                    <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Products</p>
                    <p style="margin: 0; color: #202124; font-size: 14px;">${productList}</p>
                </div>
            </div>
            <style>
                .delivery-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
                    transform: translateY(-2px);
                }
            </style>
        `;
    }).join('');
}

function addProductToDelivery() {
    const productId = parseInt(document.getElementById('deliveryProduct').value);
    const quantity = parseInt(document.getElementById('deliveryQuantity').value);
    
    if (!productId || !quantity || quantity <= 0) {
        alert('Please select a product and enter a valid quantity');
        return;
    }
    
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found');
        return;
    }
    
    if (product.stock < quantity) {
        alert(`Insufficient stock! Available: ${product.stock}`);
        return;
    }
    
    const deliveryProducts = window.deliveryProducts || [];
    deliveryProducts.push({ productId, quantity, productName: product.name });
    window.deliveryProducts = deliveryProducts;
    
    updateDeliveryProductList();
    
    // Clear inputs
    document.getElementById('deliveryProduct').value = '';
    document.getElementById('deliveryQuantity').value = '';
}

function updateDeliveryProductList() {
    const container = document.getElementById('deliveryProductsList');
    if (!container) return;
    
    const deliveryProducts = window.deliveryProducts || [];
    
    if (deliveryProducts.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No products added yet</p>';
        return;
    }
    
    container.innerHTML = deliveryProducts.map((item, index) => `
        <div style="
            background: #F4F6F9;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <span>${item.productName} - Qty: ${item.quantity}</span>
            <button onclick="removeDeliveryProduct(${index})" style="
                background: #D32F2F;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
            ">Remove</button>
        </div>
    `).join('');
}

function removeDeliveryProduct(index) {
    const deliveryProducts = window.deliveryProducts || [];
    deliveryProducts.splice(index, 1);
    window.deliveryProducts = deliveryProducts;
    updateDeliveryProductList();
}

function createDelivery(event) {
    event.preventDefault();
    
    const customer = document.getElementById('deliveryCustomer').value;
    const warehouse = document.getElementById('deliveryWarehouse').value;
    const deliveryProducts = window.deliveryProducts || [];
    
    if (!customer) {
        alert('Please enter customer name');
        return;
    }
    
    if (deliveryProducts.length === 0) {
        alert('Please add at least one product');
        return;
    }
    
    // Validate stock availability
    const products = getProducts();
    for (const item of deliveryProducts) {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
            alert(`Insufficient stock for ${item.productName}. Available: ${product ? product.stock : 0}`);
            return;
        }
    }
    
    const delivery = {
        customer,
        warehouse,
        products: deliveryProducts.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        })),
        status: 'Done'
    };
    
    addDelivery(delivery);
    window.deliveryProducts = [];
    alert('Delivery order created successfully! Stock updated.');
    window.location.href = 'delivery.html';
}

