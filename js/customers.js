// StockMaster - Customers Module

let currentView = localStorage.getItem('customersView') || 'list';

function loadCustomers() {
    const customers = getCustomers();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('filterType')?.value || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const cityFilter = document.getElementById('filterCity')?.value || '';
    
    let filteredCustomers = customers.filter(customer => {
        const matchesSearch = !searchTerm || 
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.phone.toLowerCase().includes(searchTerm) ||
            customer.city.toLowerCase().includes(searchTerm);
        
        const matchesType = !typeFilter || customer.type === typeFilter;
        const matchesStatus = !statusFilter || customer.status === statusFilter;
        const matchesCity = !cityFilter || customer.city === cityFilter;
        
        return matchesSearch && matchesType && matchesStatus && matchesCity;
    });
    
    if (currentView === 'list') {
        displayCustomers(filteredCustomers);
    } else {
        displayCustomersKanban(filteredCustomers);
    }
}

function loadCustomerFilters() {
    const customers = getCustomers();
    const cities = [...new Set(customers.map(c => c.city))].filter(c => c).sort();
    
    const citySelect = document.getElementById('filterCity');
    if (citySelect) {
        cities.forEach(city => {
            if (!Array.from(citySelect.options).some(opt => opt.value === city)) {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            }
        });
    }
}

function resetCustomerFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterCity').value = '';
    loadCustomers();
}

function switchView(view) {
    currentView = view;
    localStorage.setItem('customersView', view);
    
    const listBtn = document.getElementById('listViewBtn');
    const kanbanBtn = document.getElementById('kanbanViewBtn');
    const listContainer = document.getElementById('customersList');
    const kanbanContainer = document.getElementById('customersKanban');
    
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
    
    loadCustomers();
}

function displayCustomersKanban(customers) {
    const container = document.getElementById('customersKanban');
    if (!container) return;
    
    if (customers.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); grid-column: 1/-1;"><p style="font-size: 14px;">No customers found</p></div>';
        return;
    }
    
    container.innerHTML = customers.map(customer => {
        const statusColors = {
            'Active': { bg: 'rgba(29, 185, 84, 0.1)', color: '#1DB954' },
            'Inactive': { bg: 'rgba(95, 99, 104, 0.1)', color: '#5F6368' },
            'Suspended': { bg: 'rgba(211, 47, 47, 0.1)', color: '#D32F2F' }
        };
        const statusStyle = statusColors[customer.status] || statusColors['Active'];
        
        return `<div class="kanban-card">
            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px 0; color: #202124; font-size: 16px; font-weight: 500;">${customer.name}</h3>
                <p style="margin: 0; color: #5F6368; font-size: 12px;">${customer.email}</p>
            </div>
            <div style="padding: 12px; background: #F8F9FA; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Phone</span>
                    <span style="font-size: 12px; color: #202124;">${customer.phone}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Location</span>
                    <span style="font-size: 12px; color: #202124;">${customer.city}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #5F6368; font-size: 11px; text-transform: uppercase; font-weight: 500;">Type</span>
                    <span style="font-size: 12px; color: #202124;">${customer.type}</span>
                </div>
            </div>
            <div style="padding: 6px 10px; background: ${statusStyle.bg}; color: ${statusStyle.color}; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center; text-transform: uppercase;">${customer.status}</div>
        </div>`;
    }).join('');
}

function displayCustomers(customers) {
    const container = document.getElementById('customersList');
    if (!container) return;
    
    if (customers.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #5F6368; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);"><p style="font-size: 14px;">No customers found</p></div>';
        return;
    }
    
    container.innerHTML = customers.map(customer => {
        const statusColors = {
            'Active': { bg: 'rgba(29, 185, 84, 0.1)', color: '#1DB954' },
            'Inactive': { bg: 'rgba(95, 99, 104, 0.1)', color: '#5F6368' },
            'Suspended': { bg: 'rgba(211, 47, 47, 0.1)', color: '#D32F2F' }
        };
        const statusStyle = statusColors[customer.status] || statusColors['Active'];
        
        return `
            <div class="customer-card" style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.2s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 12px 0; color: #202124; font-size: 18px; font-weight: 500; letter-spacing: -0.2px;">${customer.name}</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${customer.email}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${customer.phone}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${customer.city}, ${customer.country}</p>
                            </div>
                            <div>
                                <p style="margin: 0 0 4px 0; color: #5F6368; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Type</p>
                                <p style="margin: 0; color: #202124; font-size: 14px;">${customer.type}</p>
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
                    ">${customer.status}</span>
                </div>
            </div>
            <style>
                .customer-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
                    transform: translateY(-2px);
                }
            </style>
        `;
    }).join('');
}

function createCustomer(event) {
    event.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const city = document.getElementById('customerCity').value;
    const country = document.getElementById('customerCountry').value;
    const type = document.getElementById('customerType').value;
    const status = document.getElementById('customerStatus').value;
    
    if (!name || !email || !phone) {
        alert('Please fill in all required fields (Name, Email, Phone)');
        return;
    }
    
    const customer = {
        name,
        email,
        phone,
        address,
        city,
        country,
        type,
        status
    };
    
    addCustomer(customer);
    alert('Customer created successfully!');
    window.location.href = 'customers.html';
}

