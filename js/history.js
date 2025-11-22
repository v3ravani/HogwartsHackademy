// StockMaster - Move History Module

function loadHistory() {
    const history = getHistory();
    const products = getProducts();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const filteredHistory = history.filter(entry => {
        const productNames = Array.isArray(entry.productId) 
            ? entry.productId.map(id => {
                const product = products.find(p => p.id === id);
                return product ? product.name.toLowerCase() : '';
            }).join(' ')
            : (() => {
                const product = products.find(p => p.id === entry.productId);
                return product ? product.name.toLowerCase() : '';
            })();
        
        return (
            entry.type.toLowerCase().includes(searchTerm) ||
            entry.location.toLowerCase().includes(searchTerm) ||
            productNames.includes(searchTerm) ||
            entry.quantity.toString().includes(searchTerm)
        );
    });
    
    displayHistory(filteredHistory, products);
}

function displayHistory(history, products) {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    if (history.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);"><p style="font-size: 14px;">No history records found</p></div>';
        return;
    }
    
    const typeColors = {
        'Receipt': { bg: 'rgba(29, 185, 84, 0.1)', color: '#1DB954', border: '#1DB954' },
        'Delivery': { bg: 'rgba(211, 47, 47, 0.1)', color: '#D32F2F', border: '#D32F2F' },
        'Transfer': { bg: 'rgba(26, 115, 232, 0.1)', color: '#1A73E8', border: '#1A73E8' },
        'Adjustment': { bg: 'rgba(249, 171, 0, 0.1)', color: '#F9AB00', border: '#F9AB00' }
    };
    
    container.innerHTML = history.map(entry => {
        const productNames = Array.isArray(entry.productId) 
            ? entry.productId.map(id => {
                const product = products.find(p => p.id === id);
                return product ? product.name : 'Unknown';
            }).join(', ')
            : (() => {
                const product = products.find(p => p.id === entry.productId);
                return product ? product.name : 'Unknown';
            })();
        
        const typeStyle = typeColors[entry.type] || { bg: 'rgba(95, 99, 104, 0.1)', color: '#5F6368', border: '#5F6368' };
        
        return `
            <div class="history-card" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                border-left: 4px solid ${typeStyle.border};
                border: 1px solid rgba(0, 0, 0, 0.04);
                border-left: 4px solid ${typeStyle.border};
                transition: all 0.2s ease;
            ">
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <span style="
                            padding: 6px 12px;
                            border-radius: 6px;
                            background: ${typeStyle.bg};
                            color: ${typeStyle.color};
                            font-size: 12px;
                            font-weight: 500;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        ">${entry.type}</span>
                        <span style="color: #5F6368; font-size: 13px; font-weight: 400;">${new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 12px;">
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Product</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${productNames}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Quantity</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${entry.quantity}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                            <p style="margin: 0; color: #202124; font-size: 14px;">${entry.location}</p>
                        </div>
                    </div>
                    ${entry.details ? `<p style="margin: 12px 0 0 0; color: #5F6368; font-size: 13px; padding-top: 12px; border-top: 1px solid rgba(0, 0, 0, 0.06);">${entry.details}</p>` : ''}
                </div>
            </div>
            <style>
                .history-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
                    transform: translateY(-2px);
                }
            </style>
        `;
    }).join('');
}

