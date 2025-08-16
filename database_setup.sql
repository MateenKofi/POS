-- Database Setup Script for POS System
-- Run this after creating the tables to populate with sample data

-- Clear existing data (if any)
DELETE FROM SaleDetails;
DELETE FROM Sale;
DELETE FROM SupplierProduct;
DELETE FROM Supplier;
DELETE FROM Product;
DELETE FROM PaymentMethod;
DELETE FROM SalesPerson;

-- Reset auto-increment counters
ALTER TABLE SaleDetails AUTO_INCREMENT = 1;
ALTER TABLE Sale AUTO_INCREMENT = 1;
ALTER TABLE SupplierProduct AUTO_INCREMENT = 1;
ALTER TABLE Supplier AUTO_INCREMENT = 1;
ALTER TABLE Product AUTO_INCREMENT = 1;
ALTER TABLE PaymentMethod AUTO_INCREMENT = 1;
ALTER TABLE SalesPerson AUTO_INCREMENT = 1;

-- 1. Insert Payment Methods (matching frontend expectations)
INSERT INTO PaymentMethod (method_name) VALUES
('Cash'),      -- ID: 1
('Card'),      -- ID: 2  
('Mobile Money'); -- ID: 3

-- 2. Insert Sample SalesPerson (for testing)
INSERT INTO SalesPerson (first_name, last_name, email, username, password_hash, role, contact_info) VALUES
('John', 'Doe', 'john.doe@example.com', 'johndoe', '$2b$10$example_hash_here', 'manager', 'john.doe@example.com'),
('Jane', 'Smith', 'jane.smith@example.com', 'janesmith', '$2b$10$example_hash_here', 'salesperson', 'jane.smith@example.com');

-- 3. Insert Sample Products
INSERT INTO Product (name, description, price, stock_quantity) VALUES
('Premium Coffee Beans', 'High-quality Arabica coffee beans', 24.99, 100),
('Organic Milk', 'Fresh organic whole milk', 4.99, 50),
('Chocolate Croissant', 'Buttery croissant with chocolate', 3.50, 75),
('Green Tea', 'Premium Japanese green tea', 12.99, 30),
('Whole Wheat Bread', 'Fresh whole wheat bread', 5.99, 40),
('Greek Yogurt', 'Creamy Greek yogurt', 6.99, 60);

-- 4. Insert Sample Suppliers
INSERT INTO Supplier (name, contact_info) VALUES
('Coffee Co.', 'contact@coffee.com'),
('Dairy Farm', 'orders@dairyfarm.com'),
('Bakery Supplies', 'info@bakerysupplies.com'),
('Tea Importers', 'sales@teaimporters.com');

-- 5. Link Products to Suppliers
INSERT INTO SupplierProduct (supplier_id, product_id, supply_price) VALUES
(1, 1, 18.99),  -- Coffee Co. supplies Coffee Beans
(2, 2, 3.49),   -- Dairy Farm supplies Milk
(3, 3, 2.25),   -- Bakery Supplies supplies Croissants
(4, 4, 9.99),   -- Tea Importers supplies Green Tea
(3, 5, 4.25),   -- Bakery Supplies supplies Bread
(2, 6, 4.99);   -- Dairy Farm supplies Yogurt

-- 6. Insert Sample Sales (optional - for testing)
INSERT INTO Sale (sale_date, salesperson_id, payment_method_id, total_amount) VALUES
(NOW() - INTERVAL 1 DAY, 1, 1, 29.98),  -- Cash sale
(NOW() - INTERVAL 2 DAY, 2, 2, 45.97);  -- Card sale

-- 7. Insert Sample Sale Details
INSERT INTO SaleDetails (sale_id, product_id, quantity, price_at_sale) VALUES
(1, 1, 1, 24.99),  -- 1 Coffee Beans
(1, 2, 1, 4.99),   -- 1 Milk
(2, 3, 2, 3.50),   -- 2 Croissants
(2, 4, 1, 12.99),  -- 1 Green Tea
(2, 5, 1, 5.99),   -- 1 Bread
(2, 6, 1, 6.99);   -- 1 Yogurt

-- Verify the data
SELECT 'Payment Methods' as table_name, COUNT(*) as count FROM PaymentMethod
UNION ALL
SELECT 'SalesPerson', COUNT(*) FROM SalesPerson
UNION ALL
SELECT 'Products', COUNT(*) FROM Product
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM Supplier
UNION ALL
SELECT 'Supplier Products', COUNT(*) FROM SupplierProduct
UNION ALL
SELECT 'Sales', COUNT(*) FROM Sale
UNION ALL
SELECT 'Sale Details', COUNT(*) FROM SaleDetails;

-- Show sample products
SELECT product_id, name, price, stock_quantity FROM Product;

-- Show payment methods
SELECT payment_method_id, method_name FROM PaymentMethod;
