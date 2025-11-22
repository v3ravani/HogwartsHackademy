// StockMaster - Adjustments Module

function loadAdjustments() {
    const adjustments = getAdjustments();
    const products = getProducts();
    
    displayAdjustments(adjustments, products);
}

function displayAdjustments(adjustments, products) {
    const container = document.getElementById('adjustmentsList');
    if (!container) return;
    
    if (adjustments.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);"><p style="font-size: 14px;">No adjustments found</p></div>';
        return;
    }
    
    container.innerHTML = adjustments.map(adjustment => {
        const product = products.find(p => p.id === adjustment.productId);
        const systemStock = adjustment.systemStock || 0;
        const difference = adjustment.physicalCount - systemStock;
        
        return `
            <div class="adjustment-card" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.2s ease;
            ">
                <div style="margin-bottom: 16px;">
                    <h3 style="margin: 0 0 12px 0; color: #202124; font-size: 18px; font-weight: 500; letter-spacing: -0.2px;">Adjustment #${adjustment.id}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Product</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${product ? product.name : 'Unknown'}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${adjustment.location}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${new Date(adjustment.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.06);">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div>
                            <p style="margin: 0 0 8px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">System Stock</p>
                            <p style="margin: 0; font-size: 24px; font-weight: 400; color: #202124;">${systemStock}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 8px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Physical Count</p>
                            <p style="margin: 0; font-size: 24px; font-weight: 400; color: #202124;">${adjustment.physicalCount}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 8px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Difference</p>
                            <p style="margin: 0; font-size: 24px; font-weight: 400; color: ${difference >= 0 ? '#1DB954' : '#D32F2F'};">
                                ${difference >= 0 ? '+' : ''}${difference}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .adjustment-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
                    transform: translateY(-2px);
                }
            </style>
        `;
    }).join('');
}

function createAdjustment(event) {
    event.preventDefault();
    
    const productId = parseInt(document.getElementById('adjustmentProduct').value);
    const location = document.getElementById('adjustmentLocation').value;
    const physicalCount = parseInt(document.getElementById('adjustmentCount').value);
    
    if (!productId || !location || physicalCount === undefined || physicalCount < 0) {
        alert('Please fill in all fields with valid values');
        return;
    }
    
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found');
        return;
    }
    
    const adjustment = {
        productId,
        location,
        physicalCount,
        systemStock: product.stock
    };
    
    addAdjustment(adjustment);
    alert('Adjustment created successfully! Stock updated.');
    window.location.href = 'adjustments.html';
}

