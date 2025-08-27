User Stories for CounterPulse

This document outlines the primary user stories for the CounterPulse inventory management system. These stories are designed to guide development and ensure the app meets the needs of spaza shop owners and informal traders. The stories are updated to reflect the latest features, including authentication, role-based access, PDF reporting, barcode scanning, modern UI, offline-first experience, and mobile support.

---

## User Roles
- **Shop Owner**: Manages inventory, sales, analytics, and business settings.
- **Shop Assistant**: Assists with sales and stock-taking, can search for products (by name or barcode) and log sales, and receive low-stock alerts, but cannot add, edit, or remove products, nor change business settings or view sensitive analytics.

---

## User Stories

### 1. Authentication & Access Control
- As a shop owner, I want to register and log in securely so that only authorized users can access my business data.
- As a shop assistant, I want to log in with my own credentials so my access is limited to sales and stock-taking tasks.
- As a shop owner, I want to manage user roles so I can control who has access to sensitive features.

### 2. Product Management & Inventory
- As a shop owner, I want to add, edit, and delete products with name, cost price, selling price, barcode, and quantity so I can track my inventory accurately.
- As a shop owner or assistant, I want to search for products by name or scan a barcode so I can quickly find products and tell customers the price.
- As a shop assistant, I want to view the product list and scan barcodes or search by name to help with stock-taking and customer queries, but not add, edit, or delete products.
- As a shop owner or assistant, I want to see clear stock status (in stock, low stock, out of stock) with visual badges and alerts.

### 3. Sales Tracking
- As a shop owner or assistant, I want to log sales by selecting or scanning products so that stock levels are updated automatically.
- As a shop owner, I want to view a summary of daily and weekly sales, income, expense, and profit so I can understand my business performance.
- As a shop assistant, I want to log sales by scanning or selecting products to help with checkout and sales tracking.

### 4. Dashboard & Analytics
- As a shop owner, I want to see my daily/weekly profit, revenue, and expense in a clear, modern dashboard with graphs.
- As a shop owner, I want to see which products are my best sellers so I can make informed purchasing decisions.
- As a shop owner or assistant, I want to receive low-stock alerts so I never run out of popular items.
- As a shop owner, I want to print or download a shop report on sales and inventory as a PDF for my records.

### 5. Barcode Scanning & Modern UI
- As a shop owner or assistant, I want to use a barcode scanner to quickly find or add products to sales or inventory, making the process faster and reducing errors.
- As a user, I want all forms, popups, and tables to be visually appealing, easy to use, and mobile-friendly.

### 6. Feedback, Alerts & Error Handling
- As a user, I want to receive clear success and error messages when I perform actions so I know if my changes were saved or if there was a problem.
- As a user, I want to see validation errors if I enter invalid data in forms so I can correct mistakes before submitting.

### 7. Offline-First Experience & Data Sync
- As a shop owner or assistant, I want the app to work without an internet connection so I can use it anywhere, anytime.
- As a shop owner, I want my data to sync automatically when I am back online so my records are always up to date.

### 8. Security & Data Integrity
- As a shop owner, I want my data to be securely stored and backed up so I don't lose important business information.
- As a shop assistant, I want my access to be limited to sales and stock-taking tasks, so sensitive business data is protected.

---

*These user stories will evolve as we gather feedback from real users and continue to improve CounterPulse.*
