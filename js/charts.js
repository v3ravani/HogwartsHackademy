// StockMaster - Chart Utilities
// SVG-based chart rendering for data visualization

function createBarChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const { width = 300, height = 200, colors = ['#1A73E8'], showLabels = true } = options;
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barWidth = width / data.length * 0.8;
    const spacing = width / data.length * 0.2;
    
    let svg = `<svg width="${width}" height="${height}" style="overflow: visible;">`;
    
    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
        const y = height - (height * 0.8) * (i / 5) - height * 0.1;
        svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#E8EAED" stroke-width="1" opacity="0.5"/>`;
    }
    
    // Draw bars
    data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * (height * 0.8);
        const x = index * (barWidth + spacing) + spacing / 2;
        const y = height - barHeight - height * 0.1;
        const color = colors[index % colors.length];
        
        svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                fill="${color}" rx="4" style="transition: all 0.3s ease;">
                <title>${item.label}: ${item.value}</title>
            </rect>`;
        
        if (showLabels) {
            svg += `<text x="${x + barWidth / 2}" y="${y - 5}" 
                    text-anchor="middle" font-size="11" fill="#5F6368" font-weight="500">${item.value}</text>`;
            svg += `<text x="${x + barWidth / 2}" y="${height - 2}" 
                    text-anchor="middle" font-size="10" fill="#5F6368" transform="rotate(-45 ${x + barWidth / 2} ${height - 2})">${item.label}</text>`;
        }
    });
    
    svg += '</svg>';
    container.innerHTML = svg;
}

function createLineChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const { width = 300, height = 200, color = '#1A73E8', showArea = true } = options;
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const minValue = Math.min(...data.map(d => d.value), 0);
    const range = maxValue - minValue || 1;
    const stepX = width / (data.length - 1 || 1);
    const chartHeight = height * 0.8;
    const padding = height * 0.1;
    
    let svg = `<svg width="${width}" height="${height}" style="overflow: visible;">`;
    
    // Draw grid
    for (let i = 0; i <= 5; i++) {
        const y = height - (chartHeight * (i / 5)) - padding;
        svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#E8EAED" stroke-width="1" opacity="0.5"/>`;
    }
    
    // Calculate points
    const points = data.map((item, index) => {
        const x = index * stepX;
        const y = height - ((item.value - minValue) / range) * chartHeight - padding;
        return `${x},${y}`;
    }).join(' ');
    
    // Draw area under line
    if (showArea) {
        const areaPoints = `0,${height - padding} ${points} ${(data.length - 1) * stepX},${height - padding}`;
        svg += `<polygon points="${areaPoints}" fill="${color}" opacity="0.1"/>`;
    }
    
    // Draw line
    svg += `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    
    // Draw points
    data.forEach((item, index) => {
        const x = index * stepX;
        const y = height - ((item.value - minValue) / range) * chartHeight - padding;
        svg += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="white" stroke-width="2">
                <title>${item.label}: ${item.value}</title>
            </circle>`;
    });
    
    svg += '</svg>';
    container.innerHTML = svg;
}

function createPieChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const { width = 200, height = 200, colors = ['#1A73E8', '#1DB954', '#F9AB00', '#D32F2F', '#9C27B0'] } = options;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
        container.innerHTML = '<p style="text-align: center; color: #5F6368; padding: 40px;">No data</p>';
        return;
    }
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    let currentAngle = -Math.PI / 2;
    
    let svg = `<svg width="${width}" height="${height}">`;
    
    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArc = sliceAngle > Math.PI ? 1 : 0;
        
        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const color = colors[index % colors.length];
        
        svg += `<path d="${pathData}" fill="${color}" stroke="white" stroke-width="2">
                <title>${item.label}: ${item.value} (${Math.round(item.value / total * 100)}%)</title>
            </path>`;
        
        // Label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);
        
        if (item.value / total > 0.05) {
            svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" 
                    font-size="11" fill="white" font-weight="500" dominant-baseline="middle">${Math.round(item.value / total * 100)}%</text>`;
        }
        
        currentAngle = endAngle;
    });
    
    svg += '</svg>';
    container.innerHTML = svg;
    
    // Add legend
    const legend = data.map((item, index) => {
        const color = colors[index % colors.length];
        return `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: ${color};"></div>
                <span style="font-size: 12px; color: #202124;">${item.label}</span>
                <span style="font-size: 12px; color: #5F6368; margin-left: auto;">${item.value}</span>
            </div>
        `;
    }).join('');
    
    container.innerHTML += `<div style="margin-top: 16px;">${legend}</div>`;
}

function createTrendChart(containerId, labels, datasets, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const { width = 400, height = 200 } = options;
    const allValues = datasets.flatMap(d => d.data);
    const maxValue = Math.max(...allValues, 1);
    const minValue = Math.min(...allValues, 0);
    const range = maxValue - minValue || 1;
    const stepX = labels.length > 1 ? width / (labels.length - 1) : width;
    const chartHeight = height * 0.8;
    const padding = height * 0.1;
    
    let svg = `<svg width="${width}" height="${height}" style="overflow: visible;">`;
    
    // Draw grid
    for (let i = 0; i <= 5; i++) {
        const y = height - (chartHeight * (i / 5)) - padding;
        svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#E8EAED" stroke-width="1" opacity="0.5"/>`;
    }
    
    // Draw each dataset
    datasets.forEach(dataset => {
        const points = dataset.data.map((value, index) => {
            const x = index * stepX;
            const y = height - ((value - minValue) / range) * chartHeight - padding;
            return `${x},${y}`;
        }).join(' ');
        
        svg += `<polyline points="${points}" fill="none" stroke="${dataset.color || '#1A73E8'}" 
                stroke-width="2" stroke-dasharray="${dataset.dashed ? '5,5' : '0'}" opacity="0.8"/>`;
        
        // Draw points
        dataset.data.forEach((value, index) => {
            const x = index * stepX;
            const y = height - ((value - minValue) / range) * chartHeight - padding;
            svg += `<circle cx="${x}" cy="${y}" r="3" fill="${dataset.color || '#1A73E8'}">
                <title>${labels[index]}: ${value}</title>
            </circle>`;
        });
    });
    
    // Draw labels
    labels.forEach((label, index) => {
        const x = index * stepX;
        svg += `<text x="${x}" y="${height - 5}" text-anchor="middle" font-size="9" fill="#5F6368">${label}</text>`;
    });
    
    svg += '</svg>';
    container.innerHTML = svg;
}

