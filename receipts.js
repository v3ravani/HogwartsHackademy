// StockMaster - Receipts Module

let currentView = localStorage.getItem('receiptsView') || 'list';

function loadReceipts() {
    const receipts = getReceipts();
    const products = getProducts();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const filteredReceipts = receipts.filter(receipt => 
        receipt.supplier.toLowerCase().includes(searchTerm) ||
        receipt.id.toString().includes(searchTerm) ||
        receipt.status.toLowerCase().includes(searchTerm) ||
        (receipt.warehouse && receipt.warehouse.toLowerCase().includes(searchTerm))
    );
    
    if (currentView === 'list') {
        displayReceipts(filteredReceipts, products);
    } else {
        displayReceiptsKanban(filteredReceipts, products);
    }
}

function switchView(view) {
    currentView = view;
    localStorage.setItem('receiptsView', view);
    
    const listBtn = document.getElementById('listViewBtn');
    const kanbanBtn = document.getElementById('kanbanViewBtn');
    const listContainer = document.getElementById('receiptsList');
    const kanbanContainer = document.getElementById('receiptsKanban');
    
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
    
    loadReceipts();
}

function displayReceiptsKanban(receipts, products) {
    const container = document.getElementById('receiptsKanban');
    if (!container) return;
    
    if (receipts.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); grid-column: 1/-1;"><p style="font-size: 14px;">No receipts found</p></div>';
        return;
    }
    
    container.innerHTML = receipts.map(receipt => {
        const productList = receipt.products.slice(0, 2).map(item => {
            const product = products.find(p => p.id === item.productId);
            return `${product ? product.name : 'Unknown'} (${item.quantity})`;
        }).join(', ');
        const moreProducts = receipt.products.length > 2 ? ` +${receipt.products.length - 2} more` : '';
        
        const statusColors = {
            'Draft': { bg: 'rgba(95, 99, 104, 0.1)', color: '#5F6368' },
            'Waiting': { bg: 'rgba(249, 171, 0, 0.1)', color: '#F9AB00' },
            'Ready': { bg: 'rgba(26, 115, 232, 0.1)', color: '#1A73E8' },
            'Done': { bg: 'rgba(29, 185, 84, 0.1)', color: '#1DB954' },
            'Canceled': { bg: 'rgba(211, 47, 47, 0.1)', color: '#D32F2F' }
        };
        const statusStyle = statusColors[receipt.status] || statusColors['Draft'];
        
        return `<div class="kanban-card">
            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px 0; color: #202124; font-size: 16px; font-weight: 500;">Receipt #${receipt.id}</h3>
                <p style="margin: 0; color: #5F6368; font-size: 12px;">${receipt.supplier}</p>
            </div>
            <div style="padding: 12px; background: #F8F9FA; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Date</span>
                    <span style="font-size: 12px; color: #202124;">${new Date(receipt.date).toLocaleDateString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Warehouse</span>
                    <span style="font-size: 12px; color: #202124;">${receipt.warehouse || 'WH1'}</span>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0, 0, 0, 0.06);">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Products</span>
                    <p style="margin: 4px 0 0 0; color: #202124; font-size: 12px;">${productList}${moreProducts}</p>
                </div>
            </div>
            <div style="padding: 6px 10px; background: ${statusStyle.bg}; color: ${statusStyle.color}; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center; text-transform: uppercase;">${receipt.status}</div>
        </div>`;
    }).join('');
}

function displayReceipts(receipts, products) {
    const container = document.getElementById('receiptsList');
    if (!container) return;
    
    if (receipts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No receipts found</p>';
        return;
    }
    
    container.innerHTML = receipts.map(receipt => {
        const productList = receipt.products.map(item => {
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
        const statusStyle = statusColors[receipt.status] || statusColors['Draft'];
        
        return `
            <div class="receipt-card" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.2s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 12px 0; color: #202124; font-size: 18px; font-weight: 500; letter-spacing: -0.2px;">Receipt #${receipt.id}</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Supplier</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${receipt.supplier}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${new Date(receipt.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Warehouse</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${receipt.warehouse || 'WH1'}</p>
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
                    ">${receipt.status}</span>
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.06);">
                    <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Products</p>
                    <p style="margin: 0; color: #202124; font-size: 14px;">${productList}</p>
                </div>
            </div>
            <style>
                .receipt-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
                    transform: translateY(-2px);
                }
            </style>
        `;
    }).join('');
}

function addProductToReceipt() {
    const productId = parseInt(document.getElementById('receiptProduct').value);
    const quantity = parseInt(document.getElementById('receiptQuantity').value);
    
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
    
    const receiptProducts = window.receiptProducts || [];
    receiptProducts.push({ productId, quantity, productName: product.name });
    window.receiptProducts = receiptProducts;
    
    updateReceiptProductList();
    
    // Clear inputs
    document.getElementById('receiptProduct').value = '';
    document.getElementById('receiptQuantity').value = '';
}

function updateReceiptProductList() {
    const container = document.getElementById('receiptProductsList');
    if (!container) return;
    
    const receiptProducts = window.receiptProducts || [];
    
    if (receiptProducts.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No products added yet</p>';
        return;
    }
    
    container.innerHTML = receiptProducts.map((item, index) => `
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
            <button onclick="removeReceiptProduct(${index})" style="
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

function removeReceiptProduct(index) {
    const receiptProducts = window.receiptProducts || [];
    receiptProducts.splice(index, 1);
    window.receiptProducts = receiptProducts;
    updateReceiptProductList();
}

function createReceipt(event) {
    event.preventDefault();
    
    const supplier = document.getElementById('receiptSupplier').value;
    const warehouse = document.getElementById('receiptWarehouse').value;
    const receiptProducts = window.receiptProducts || [];
    
    if (!supplier) {
        alert('Please enter supplier name');
        return;
    }
    
    if (receiptProducts.length === 0) {
        alert('Please add at least one product');
        return;
    }
    
    const receipt = {
        supplier,
        warehouse,
        products: receiptProducts.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        })),
        status: 'Done'
    };
    
    addReceipt(receipt);
    window.receiptProducts = [];
    alert('Receipt created successfully! Stock updated.');
    window.location.href = 'receipts.html';
}

