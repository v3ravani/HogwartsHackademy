// StockMaster - Transfers Module

let currentView = localStorage.getItem('transfersView') || 'list';

function loadTransfers() {
    const transfers = getTransfers();
    const products = getProducts();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const filteredTransfers = transfers.filter(transfer => 
        transfer.fromLocation.toLowerCase().includes(searchTerm) ||
        transfer.toLocation.toLowerCase().includes(searchTerm) ||
        transfer.id.toString().includes(searchTerm) ||
        transfer.status.toLowerCase().includes(searchTerm)
    );
    
    if (currentView === 'list') {
        displayTransfers(filteredTransfers, products);
    } else {
        displayTransfersKanban(filteredTransfers, products);
    }
}

function switchView(view) {
    currentView = view;
    localStorage.setItem('transfersView', view);
    
    const listBtn = document.getElementById('listViewBtn');
    const kanbanBtn = document.getElementById('kanbanViewBtn');
    const listContainer = document.getElementById('transfersList');
    const kanbanContainer = document.getElementById('transfersKanban');
    
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
    
    loadTransfers();
}

function displayTransfersKanban(transfers, products) {
    const container = document.getElementById('transfersKanban');
    if (!container) return;
    
    if (transfers.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); grid-column: 1/-1;"><p style="font-size: 14px;">No transfers found</p></div>';
        return;
    }
    
    container.innerHTML = transfers.map(transfer => {
        const productList = transfer.products.slice(0, 2).map(item => {
            const product = products.find(p => p.id === item.productId);
            return `${product ? product.name : 'Unknown'} (${item.quantity})`;
        }).join(', ');
        const moreProducts = transfer.products.length > 2 ? ` +${transfer.products.length - 2} more` : '';
        
        const statusColors = {
            'Draft': { bg: 'rgba(95, 99, 104, 0.1)', color: '#5F6368' },
            'Waiting': { bg: 'rgba(249, 171, 0, 0.1)', color: '#F9AB00' },
            'Ready': { bg: 'rgba(26, 115, 232, 0.1)', color: '#1A73E8' },
            'Done': { bg: 'rgba(29, 185, 84, 0.1)', color: '#1DB954' },
            'Canceled': { bg: 'rgba(211, 47, 47, 0.1)', color: '#D32F2F' }
        };
        const statusStyle = statusColors[transfer.status] || statusColors['Draft'];
        
        return `<div class="kanban-card">
            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px 0; color: #202124; font-size: 16px; font-weight: 500;">Transfer #${transfer.id}</h3>
                <p style="margin: 0; color: #5F6368; font-size: 12px;">${transfer.fromLocation} → ${transfer.toLocation}</p>
            </div>
            <div style="padding: 12px; background: #F8F9FA; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Date</span>
                    <span style="font-size: 12px; color: #202124;">${new Date(transfer.date).toLocaleDateString()}</span>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0, 0, 0, 0.06);">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Products</span>
                    <p style="margin: 4px 0 0 0; color: #202124; font-size: 12px;">${productList}${moreProducts}</p>
                </div>
            </div>
            <div style="padding: 6px 10px; background: ${statusStyle.bg}; color: ${statusStyle.color}; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center; text-transform: uppercase;">${transfer.status}</div>
        </div>`;
    }).join('');
}

function displayTransfers(transfers, products) {
    const container = document.getElementById('transfersList');
    if (!container) return;
    
    if (transfers.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);"><p style="font-size: 14px;">No transfers found</p></div>';
        return;
    }
    
    container.innerHTML = transfers.map(transfer => {
        const productList = transfer.products.map(item => {
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
        const statusStyle = statusColors[transfer.status] || statusColors['Draft'];
        
        return `
            <div class="transfer-card" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.2s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 12px 0; color: #202124; font-size: 18px; font-weight: 500; letter-spacing: -0.2px;">Transfer #${transfer.id}</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${transfer.fromLocation}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">To</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${transfer.toLocation}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${new Date(transfer.date).toLocaleDateString()}</p>
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
                    ">${transfer.status}</span>
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.06);">
                    <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Products</p>
                    <p style="margin: 0; color: #202124; font-size: 14px;">${productList}</p>
                </div>
            </div>
            <style>
                .transfer-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
                    transform: translateY(-2px);
                }
            </style>
        `;
    }).join('');
}

function addProductToTransfer() {
    const productId = parseInt(document.getElementById('transferProduct').value);
    const quantity = parseInt(document.getElementById('transferQuantity').value);
    const fromLocation = document.getElementById('transferFrom').value;
    
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
    
    if (product.location !== fromLocation) {
        alert(`Product is not available at ${fromLocation}. Current location: ${product.location}`);
        return;
    }
    
    if (product.stock < quantity) {
        alert(`Insufficient stock! Available: ${product.stock}`);
        return;
    }
    
    const transferProducts = window.transferProducts || [];
    transferProducts.push({ productId, quantity, productName: product.name });
    window.transferProducts = transferProducts;
    
    updateTransferProductList();
    
    // Clear inputs
    document.getElementById('transferProduct').value = '';
    document.getElementById('transferQuantity').value = '';
}

function updateTransferProductList() {
    const container = document.getElementById('transferProductsList');
    if (!container) return;
    
    const transferProducts = window.transferProducts || [];
    
    if (transferProducts.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No products added yet</p>';
        return;
    }
    
    container.innerHTML = transferProducts.map((item, index) => `
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
            <button onclick="removeTransferProduct(${index})" style="
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

function removeTransferProduct(index) {
    const transferProducts = window.transferProducts || [];
    transferProducts.splice(index, 1);
    window.transferProducts = transferProducts;
    updateTransferProductList();
}

function createTransfer(event) {
    event.preventDefault();
    
    const fromLocation = document.getElementById('transferFrom').value;
    const toLocation = document.getElementById('transferTo').value;
    const transferProducts = window.transferProducts || [];
    
    if (!fromLocation || !toLocation) {
        alert('Please select both source and destination locations');
        return;
    }
    
    if (fromLocation === toLocation) {
        alert('Source and destination must be different');
        return;
    }
    
    if (transferProducts.length === 0) {
        alert('Please add at least one product');
        return;
    }
    
    // Validate stock availability
    const products = getProducts();
    for (const item of transferProducts) {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.location !== fromLocation || product.stock < item.quantity) {
            alert(`Product ${item.productName} is not available at ${fromLocation} or insufficient stock`);
            return;
        }
    }
    
    const transfer = {
        fromLocation,
        toLocation,
        products: transferProducts.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        })),
        status: 'Done'
    };
    
    addTransfer(transfer);
    window.transferProducts = [];
    alert('Transfer created successfully! Stock locations updated.');
    window.location.href = 'transfers.html';
}

