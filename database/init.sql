-- PostgreSQL database initialization for counterpulse

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table (now represents a transaction, not a single product)
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    total NUMERIC(10,2) NOT NULL,
    sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SaleItems table (each row is a product in a sale)
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    total NUMERIC(10,2) NOT NULL
);

-- INSERT INTO users (username, password, role) VALUES ('admin', 'adminpassword', 'admin');
