// StockMaster - CSV Export Utilities
(function(){
  function toCSV(rows){
    if (!rows || !rows.length) return '';
    const headers = Object.keys(rows[0]);
    const escape = v => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const lines = [headers.map(escape).join(',')];
    for (const r of rows){
      lines.push(headers.map(h => escape(r[h])).join(','));
    }
    return lines.join('\n');
  }
  function downloadCSV(filename, rows){
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  // Products export (respects current filters if present)
  window.exportProductsCSV = function(){
    let products = (typeof getProducts === 'function') ? getProducts() : [];
    const q = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const cat = document.getElementById('filterCategory')?.value || '';
    const loc = document.getElementById('filterLocation')?.value || '';
    const stock = document.getElementById('filterStock')?.value || '';
    if (q) products = products.filter(p => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(q));
    if (cat) products = products.filter(p => p.category === cat);
    if (loc) products = products.filter(p => p.location === loc);
    if (stock === 'low') products = products.filter(p => p.stock < 10);
    if (stock === 'medium') products = products.filter(p => p.stock >= 10 && p.stock <= 50);
    if (stock === 'high') products = products.filter(p => p.stock > 50);
    if (stock === 'out') products = products.filter(p => p.stock === 0);

    const rows = products.map(p => ({
      name: p.name,
      sku: p.sku,
      category: p.category,
      unit: p.unit,
      stock: p.stock,
      location: p.location,
      price: p.price
    }));
    downloadCSV('products.csv', rows);
  };

  // Customers export
  window.exportCustomersCSV = function(){
    let customers = (typeof getCustomers === 'function') ? getCustomers() : [];
    const q = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const type = document.getElementById('filterType')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';
    const city = document.getElementById('filterCity')?.value || '';
    if (q) customers = customers.filter(c => `${c.name} ${c.email} ${c.phone} ${c.city}`.toLowerCase().includes(q));
    if (type) customers = customers.filter(c => c.type === type);
    if (status) customers = customers.filter(c => c.status === status);
    if (city) customers = customers.filter(c => c.city === city);

    const rows = customers.map(c => ({
      name: c.name,
      email: c.email,
      phone: c.phone,
      city: c.city,
      country: c.country,
      type: c.type,
      status: c.status
    }));
    downloadCSV('customers.csv', rows);
  };

  // Stock export (derived from products)
  window.exportStockCSV = function(){
    let products = (typeof getProducts === 'function') ? getProducts() : [];
    const q = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const loc = document.getElementById('locationFilter')?.value || '';
    const cat = document.getElementById('categoryFilter')?.value || '';
    const s = document.getElementById('stockFilter')?.value || '';
    if (q) products = products.filter(p => `${p.name} ${p.sku} ${p.category} ${p.location}`.toLowerCase().includes(q));
    if (loc) products = products.filter(p => p.location === loc);
    if (cat) products = products.filter(p => p.category === cat);
    if (s === 'low') products = products.filter(p => p.stock < 10);
    if (s === 'ok') products = products.filter(p => p.stock > 0);

    const rows = products.map(p => ({
      name: p.name,
      sku: p.sku,
      category: p.category,
      location: p.location,
      stock: p.stock,
      unit_price: p.price,
      total_value: (p.stock * (p.price || 0)).toFixed(2)
    }));
    downloadCSV('stock.csv', rows);
  };
})();
