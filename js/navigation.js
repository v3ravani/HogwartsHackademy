// StockMaster - Navigation Sidebar

function createSidebar(activePage) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    const menuItems = [
        { icon: 'dashboard', text: 'Dashboard', page: 'dashboard.html' },
        { icon: 'inventory', text: 'Products', page: 'products.html' },
        { icon: 'customers', text: 'Customers', page: 'customers.html' },
        { icon: 'receipt', text: 'Receipts', page: 'receipts.html' },
        { icon: 'delivery', text: 'Delivery Orders', page: 'delivery.html' },
        { icon: 'transfer', text: 'Internal Transfers', page: 'transfers.html' },
        { icon: 'adjustment', text: 'Adjustments', page: 'adjustments.html' },
        { icon: 'history', text: 'Move History', page: 'move_history.html' },
        { icon: 'reports', text: 'Reports & Analytics', page: 'reports.html' },
        { icon: 'settings', text: 'Settings', page: 'settings.html' },
        { icon: 'profile', text: 'Profile', page: 'profile.html' },
        { icon: 'logout', text: 'Logout', action: 'logout' }
    ];
    
    const getIcon = (iconName) => {
        const icons = {
            dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
            inventory: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
            customers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
            receipt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
            delivery: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 3h15v13H1z"></path><path d="M16 8h4l3 3v5h-7V8z"></path></svg>',
            transfer: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>',
            adjustment: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
            history: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
            reports: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
            settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path></svg>',
            profile: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
            logout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>'
        };
        return icons[iconName] || '';
    };
    
    sidebar.innerHTML = `
        <div style="padding: 24px 20px; border-bottom: 1px solid rgba(0,0,0,0.06);">
            <h2 style="margin: 0; color: #1A73E8; font-size: 22px; font-weight: 600; letter-spacing: -0.3px;">StockMaster</h2>
            <p style="margin: 4px 0 0 0; color: #5F6368; font-size: 12px; font-weight: 400;">Inventory Management</p>
        </div>
        <nav style="padding: 12px 0;">
            ${menuItems.map(item => {
                const isActive = item.page === activePage;
                if (item.action === 'logout') {
                    return `
                        <div onclick="logout()" class="nav-item-logout" style="
                            padding: 10px 20px;
                            cursor: pointer;
                            color: #D32F2F;
                            transition: all 0.2s ease;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            font-size: 14px;
                            font-weight: 500;
                            margin-top: 8px;
                            border-top: 1px solid rgba(0,0,0,0.06);
                            padding-top: 16px;
                        ">
                            <span style="display: flex; align-items: center; opacity: 0.8;">${getIcon(item.icon)}</span>
                            <span>${item.text}</span>
                        </div>
                    `;
                }
                return `
                    <a href="${item.page}" class="nav-item" style="
                        text-decoration: none;
                        color: ${isActive ? '#1A73E8' : '#3C4043'};
                        padding: 10px 20px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        transition: all 0.2s ease;
                        background-color: ${isActive ? 'rgba(26, 115, 232, 0.08)' : 'transparent'};
                        border-left: 3px solid ${isActive ? '#1A73E8' : 'transparent'};
                        font-size: 14px;
                        font-weight: ${isActive ? '500' : '400'};
                        margin: 2px 0;
                    ">
                        <span style="display: flex; align-items: center; opacity: ${isActive ? '1' : '0.7'};">${getIcon(item.icon)}</span>
                        <span>${item.text}</span>
                    </a>
                `;
            }).join('')}
        </nav>
        <style>
            .nav-item:hover {
                background-color: rgba(26, 115, 232, 0.04) !important;
                color: #1A73E8 !important;
            }
            .nav-item-logout:hover {
                background-color: rgba(211, 47, 47, 0.08) !important;
            }
        </style>
    `;
}

// Make logout function globally available
window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('stockmaster_authenticated');
        localStorage.removeItem('stockmaster_user');
        window.location.href = 'login.html';
    }
};

