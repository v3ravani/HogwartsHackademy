-- StockMaster Inventory Management System - MySQL Database Schema
-- Created for migration from localStorage to MySQL

-- Drop existing tables if they exist (for clean setup)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS move_history;
DROP TABLE IF EXISTS adjustment_products;
DROP TABLE IF EXISTS transfer_products;
DROP TABLE IF EXISTS delivery_products;
DROP TABLE IF EXISTS receipt_products;
DROP TABLE IF EXISTS adjustments;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS receipts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table (for authentication)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Warehouses table
CREATE TABLE warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id INT NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'Unit',
    stock INT NOT NULL DEFAULT 0,
    location_id INT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (location_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    INDEX idx_sku (sku),
    INDEX idx_category (category_id),
    INDEX idx_location (location_id),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    type ENUM('Individual', 'Corporate') DEFAULT 'Individual',
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Receipts table
CREATE TABLE receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier VARCHAR(200) NOT NULL,
    warehouse_id INT NOT NULL,
    status ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Canceled') DEFAULT 'Draft',
    date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    INDEX idx_supplier (supplier),
    INDEX idx_warehouse (warehouse_id),
    INDEX idx_status (status),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Receipt Products (junction table for many-to-many relationship)
CREATE TABLE receipt_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_receipt (receipt_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Deliveries table
CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    status ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Canceled') DEFAULT 'Draft',
    date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    INDEX idx_customer (customer_id),
    INDEX idx_warehouse (warehouse_id),
    INDEX idx_status (status),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery Products (junction table)
CREATE TABLE delivery_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_delivery (delivery_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transfers table
CREATE TABLE transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_location_id INT NOT NULL,
    to_location_id INT NOT NULL,
    status ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Canceled') DEFAULT 'Draft',
    date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_location_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    FOREIGN KEY (to_location_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    INDEX idx_from_location (from_location_id),
    INDEX idx_to_location (to_location_id),
    INDEX idx_status (status),
    INDEX idx_date (date),
    CHECK (from_location_id != to_location_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transfer Products (junction table)
CREATE TABLE transfer_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transfer_id) REFERENCES transfers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_transfer (transfer_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adjustments table
CREATE TABLE adjustments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    location_id INT NOT NULL,
    system_stock INT NOT NULL,
    physical_count INT NOT NULL,
    difference INT NOT NULL,
    reason TEXT,
    date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (location_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    INDEX idx_product (product_id),
    INDEX idx_location (location_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Move History table (audit log for all inventory movements)
CREATE TABLE move_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Receipt', 'Delivery', 'Transfer', 'Adjustment') NOT NULL,
    product_id INT,
    quantity INT NOT NULL,
    location VARCHAR(200),
    details TEXT,
    reference_id INT, -- ID of the related receipt/delivery/transfer/adjustment
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_type (type),
    INDEX idx_product (product_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_reference (reference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data
INSERT INTO users (user_id, password, name, email) VALUES
('team123', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Team User', 'team@stockmaster.com');

INSERT INTO warehouses (code, name, city, country) VALUES
('WH1', 'Main Warehouse', 'New York', 'USA'),
('WH2', 'Secondary Warehouse', 'Los Angeles', 'USA');

INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Accessories', 'Product accessories and peripherals'),
('Office Supplies', 'Office and stationery items'),
('Furniture', 'Office and warehouse furniture');

-- Sample products (optional - can be removed if you want to start fresh)
INSERT INTO products (name, sku, category_id, unit, stock, location_id, price) VALUES
('Laptop Dell XPS', 'LAP-DELL-001', 1, 'Unit', 77, 1, 1299.99),
('Wireless Mouse', 'ACC-MSE-001', 2, 'Unit', 120, 1, 29.99),
('USB-C Cable', 'ACC-CBL-001', 2, 'Unit', 8, 2, 19.99),
('Monitor 27"', 'MON-27-001', 1, 'Unit', 32, 1, 399.99),
('Keyboard Mechanical', 'ACC-KBD-001', 2, 'Unit', 5, 2, 89.99);

-- Sample customers (optional)
INSERT INTO customers (name, email, phone, address, city, country, type, status) VALUES
('Acme Corporation', 'contact@acme.com', '+1-555-0101', '123 Business St', 'New York', 'USA', 'Corporate', 'Active'),
('Tech Solutions Inc', 'info@techsol.com', '+1-555-0102', '456 Tech Ave', 'San Francisco', 'USA', 'Corporate', 'Active'),
('John Smith', 'john@email.com', '+1-555-0103', '789 Main St', 'Chicago', 'USA', 'Individual', 'Active');

-- Views for easier querying
CREATE VIEW v_product_stock AS
SELECT 
    p.id,
    p.name,
    p.sku,
    c.name AS category,
    p.unit,
    p.stock,
    w.code AS location_code,
    w.name AS location_name,
    p.price,
    (p.stock * p.price) AS total_value,
    CASE 
        WHEN p.stock < 10 THEN 'Low Stock'
        WHEN p.stock < 30 THEN 'Medium Stock'
        ELSE 'In Stock'
    END AS stock_status
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN warehouses w ON p.location_id = w.id;

CREATE VIEW v_receipt_summary AS
SELECT 
    r.id,
    r.supplier,
    w.code AS warehouse,
    r.status,
    r.date,
    COUNT(rp.id) AS product_count,
    SUM(rp.quantity) AS total_quantity,
    SUM(rp.quantity * COALESCE(rp.unit_price, p.price, 0)) AS total_amount
FROM receipts r
JOIN warehouses w ON r.warehouse_id = w.id
LEFT JOIN receipt_products rp ON r.id = rp.receipt_id
LEFT JOIN products p ON rp.product_id = p.id
GROUP BY r.id, r.supplier, w.code, r.status, r.date;

CREATE VIEW v_delivery_summary AS
SELECT 
    d.id,
    c.name AS customer,
    w.code AS warehouse,
    d.status,
    d.date,
    COUNT(dp.id) AS product_count,
    SUM(dp.quantity) AS total_quantity,
    SUM(dp.quantity * COALESCE(dp.unit_price, p.price, 0)) AS total_amount
FROM deliveries d
JOIN customers c ON d.customer_id = c.id
JOIN warehouses w ON d.warehouse_id = w.id
LEFT JOIN delivery_products dp ON d.id = dp.delivery_id
LEFT JOIN products p ON dp.product_id = p.id
GROUP BY d.id, c.name, w.code, d.status, d.date;

-- Stored Procedures for common operations

DELIMITER //

-- Procedure to update product stock after receipt
CREATE PROCEDURE sp_process_receipt(IN receipt_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_warehouse_id INT;
    
    DECLARE cur CURSOR FOR 
        SELECT rp.product_id, rp.quantity, r.warehouse_id
        FROM receipt_products rp
        JOIN receipts r ON rp.receipt_id = r.id
        WHERE rp.receipt_id = receipt_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Get warehouse from receipt
    SELECT warehouse_id INTO v_warehouse_id FROM receipts WHERE id = receipt_id;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_product_id, v_quantity, v_warehouse_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Update product stock and location
        UPDATE products 
        SET stock = stock + v_quantity,
            location_id = v_warehouse_id,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_product_id;
        
        -- Add to history
        INSERT INTO move_history (type, product_id, quantity, location, details, reference_id, timestamp)
        VALUES ('Receipt', v_product_id, v_quantity, 
                (SELECT code FROM warehouses WHERE id = v_warehouse_id),
                CONCAT('Receipt #', receipt_id),
                receipt_id, NOW());
    END LOOP;
    
    CLOSE cur;
    
    -- Update receipt status
    UPDATE receipts SET status = 'Done', updated_at = CURRENT_TIMESTAMP WHERE id = receipt_id;
END //

-- Procedure to update product stock after delivery
CREATE PROCEDURE sp_process_delivery(IN delivery_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_warehouse_id INT;
    
    DECLARE cur CURSOR FOR 
        SELECT dp.product_id, dp.quantity, d.warehouse_id
        FROM delivery_products dp
        JOIN deliveries d ON dp.delivery_id = d.id
        WHERE dp.delivery_id = delivery_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SELECT warehouse_id INTO v_warehouse_id FROM deliveries WHERE id = delivery_id;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_product_id, v_quantity, v_warehouse_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Update product stock (decrease)
        UPDATE products 
        SET stock = GREATEST(0, stock - v_quantity),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_product_id AND location_id = v_warehouse_id;
        
        -- Add to history
        INSERT INTO move_history (type, product_id, quantity, location, details, reference_id, timestamp)
        VALUES ('Delivery', v_product_id, -v_quantity,
                (SELECT code FROM warehouses WHERE id = v_warehouse_id),
                CONCAT('Delivery #', delivery_id),
                delivery_id, NOW());
    END LOOP;
    
    CLOSE cur;
    
    UPDATE deliveries SET status = 'Done', updated_at = CURRENT_TIMESTAMP WHERE id = delivery_id;
END //

-- Procedure to process transfer
CREATE PROCEDURE sp_process_transfer(IN transfer_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_from_location INT;
    DECLARE v_to_location INT;
    
    DECLARE cur CURSOR FOR 
        SELECT tp.product_id, tp.quantity, t.from_location_id, t.to_location_id
        FROM transfer_products tp
        JOIN transfers t ON tp.transfer_id = t.id
        WHERE tp.transfer_id = transfer_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_product_id, v_quantity, v_from_location, v_to_location;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Decrease stock from source location
        UPDATE products 
        SET stock = GREATEST(0, stock - v_quantity),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_product_id AND location_id = v_from_location;
        
        -- Increase stock at destination location (or create new record if tracking multiple locations)
        -- For simplicity, we'll update the location
        UPDATE products 
        SET location_id = v_to_location,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_product_id;
        
        -- Add to history
        INSERT INTO move_history (type, product_id, quantity, location, details, reference_id, timestamp)
        VALUES ('Transfer', v_product_id, v_quantity,
                CONCAT((SELECT code FROM warehouses WHERE id = v_from_location), ' → ', 
                       (SELECT code FROM warehouses WHERE id = v_to_location)),
                CONCAT('Transfer #', transfer_id),
                transfer_id, NOW());
    END LOOP;
    
    CLOSE cur;
    
    UPDATE transfers SET status = 'Done', updated_at = CURRENT_TIMESTAMP WHERE id = transfer_id;
END //

-- Procedure to process adjustment
CREATE PROCEDURE sp_process_adjustment(IN adjustment_id INT)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_location_id INT;
    DECLARE v_system_stock INT;
    DECLARE v_physical_count INT;
    DECLARE v_difference INT;
    
    SELECT product_id, location_id, system_stock, physical_count, difference
    INTO v_product_id, v_location_id, v_system_stock, v_physical_count, v_difference
    FROM adjustments
    WHERE id = adjustment_id;
    
    -- Update product stock
    UPDATE products 
    SET stock = v_physical_count,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_product_id AND location_id = v_location_id;
    
    -- Add to history
    INSERT INTO move_history (type, product_id, quantity, location, details, reference_id, timestamp)
    VALUES ('Adjustment', v_product_id, v_difference,
            (SELECT code FROM warehouses WHERE id = v_location_id),
            CONCAT('Adjustment #', adjustment_id, ': System ', v_system_stock, ' → Physical ', v_physical_count),
            adjustment_id, NOW());
END //

DELIMITER ;

-- Indexes for performance optimization
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_receipts_date_status ON receipts(date, status);
CREATE INDEX idx_deliveries_date_status ON deliveries(date, status);
CREATE INDEX idx_transfers_date_status ON transfers(date, status);
CREATE INDEX idx_adjustments_date ON adjustments(date);
CREATE INDEX idx_move_history_type_timestamp ON move_history(type, timestamp);

