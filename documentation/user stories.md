User Stories for CounterPulse

This document outlines the primary user stories for the CounterPulse inventory management system. These stories are designed to guide development and ensure the app meets the needs of spaza shop owners and informal traders. The stories are updated to reflect the latest features, including authentication, role-based access, PDF reporting, offline-first experience, and mobile support.

---

## User Roles
- **Shop Owner**: The main user who manages inventory, sales, and business settings.
- **Shop Assistant**: Assists with sales and stock-taking, can help update inventory, log sales, and receive low-stock alerts. Shop Assistants have limited access and cannot change business settings or view sensitive analytics.

---

## User Stories

### 1. Authentication & Access Control
- As a shop owner, I want to register and log in securely so that only authorized users can access my business data.
- As a shop assistant, I want to log in with my own credentials so my access is limited to sales and stock-taking tasks.
- As a shop owner, I want to manage user roles so I can control who has access to sensitive features.

### 2. Product Management
- As a shop owner, I want to add new products with a name, cost price, selling price, and quantity so that I can track my inventory accurately.
- As a shop owner, I want to edit products in the inventory so that I can keep my inventory up to date.
- As a shop owner, I want to delete products in the inventory so that I can remove items I no longer sell.
- As a shop owner or shop assistant, I want to search for products by name or scan a barcode so that I can quickly find the product and tell the customer the price.
- As a shop assistant, I want to view the product list and scan barcodes or search by name to help with stock-taking and tell the customer the price, but not edit or delete products.

### 3. Sales Tracking
- As a shop owner, I want to log sales by selecting or scanning products so that my stock levels are updated automatically.
- As a shop owner, I want to view a summary of daily and weekly sales so that I can understand my business performance.
- As a shop assistant, I want to log sales by scanning or selecting products so that I can help with checkout and sales tracking.

### 4. Dashboard & Analytics
- As a shop owner, I want to see my daily/weekly profit and revenue so that I can track my business growth.
- As a shop owner, I want to see which products are my best sellers so that I can make informed purchasing decisions.
- As a shop owner, I want to receive low-stock alerts so that I never run out of popular items.
- As a shop assistant, I want to receive low-stock alerts so I can notify the shop owner or help restock items.
- As a shop owner, I want to print a shop report on sales and inventory so that it pops up as a PDF and I can download it for my records.

### 5. Feedback, Alerts & Error Handling
- As a user, I want to receive clear success and error messages when I perform actions so I know if my changes were saved or if there was a problem.
- As a user, I want to see validation errors if I enter invalid data in forms so I can correct mistakes before submitting.

### 6. Offline-First Experience & Data Sync
- As a shop owner, I want the app to work without an internet connection so that I can use it anywhere, anytime.
- As a shop owner, I want my data to sync automatically when I am back online so that my records are always up to date.
- As a shop assistant, I want the app to work offline so I can continue helping with sales and stock-taking even without internet.

### 7. Security & Data Integrity
- As a shop owner, I want my data to be securely stored and backed up so that I don't lose important business information.
- As a shop assistant, I want my access to be limited to sales and stock-taking tasks, so sensitive business data is protected.

### 8. Mobile & PWA Experience
- As a shop owner, I want to install the app on my phone and use it like a native app so that it is always accessible.
- As a shop owner, I want to use my phone's camera for barcode scanning to speed up sales and stock-taking.
- As a shop assistant, I want to use the app on my phone and scan barcodes to help with sales and inventory.
- As a user, I want the app to prompt me to install it on my device for a better experience.

---

*These user stories will evolve as we gather feedback from real users and continue to improve CounterPulse.*
