# CounterPulse 📦

**The heartbeat of your hustle.**

![Status](https://img.shields.io/badge/status-Hackathon%20MVP-brightgreen)

This project is a submission for the **Platform45 Future Tech Graduate Internship Program: Solo Hackathon Challenge**.

---
### **The Problem**

Spaza shop owners and informal traders are the backbone of our communities, but they often operate with one hand tied behind their back. Managing stock with memory or scattered notebooks leads to constant uncertainty: popular items run out, disappointing customers and losing sales; perishable goods expire, wasting money; and most importantly, **profit is just a guess**. This makes sustainable growth nearly impossible.

### **The Solution: CounterPulse**

**CounterPulse** is a lightweight, offline-first Progressive Web App (PWA) designed specifically for the needs of informal traders. It replaces guesswork with data, empowering any small business owner to manage their inventory, track sales, and see their real-time profit—all from a desktop or laptop, with or without an internet connection.

### **Key Features (MVP)**

-   📲 **Offline-First Reliability:** The app works flawlessly without an internet connection. All sales and stock updates are saved locally and synced securely to the cloud when the user is back online.
-   🖥️ **Desktop-First Experience:** Designed for desktop and laptop use—optimized layouts, mouse/keyboard navigation, and external barcode scanner support make it easy to use on any computer.
-   🔍 **Barcode Scanning:** Use an external barcode scanner or manual entry for product barcodes in sales and inventory.
-   📈 **Simple Profit Dashboard:** At a glance, users can see their daily/weekly profit, total revenue, and best-selling items, turning raw sales data into business intelligence.
-   🔔 **Smart Low-Stock Alerts:** CounterPulse automatically highlights products that are running low, helping owners reorder in time and never miss a sale.

### **Desktop Experience**

- Optimized for desktop and laptop screens with responsive layouts.
- Supports external barcode scanners for quick product lookup and sales.
- Installable as a PWA for a native-like experience on desktops.
- Works offline and syncs data when back online.

### **Technology Stack**

A modern, pragmatic stack was chosen to deliver a fast, reliable, and accessible user experience.

| Category      | Technology                                                                                                                                                               | Rationale                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Frontend**  | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)                                                                                            | Chosen for its powerful PWA capabilities (via Service Workers) to deliver the critical offline-first experience. |
| **Backend**   | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) | Selected for its efficiency in building a lean REST API designed for syncing data from offline devices.    |
| **Database**  | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white)                                                                           | A robust relational database chosen for its data integrity, reliability, and powerful querying capabilities.         |

### **Local Setup & Installation**

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/FreakyJay1/CounterPulse.git
    cd CounterPulse
    ```

2.  **Setup Backend:**
    ```sh
    cd server
    npm install
    # Create a .env file based on .env.example and add your database credentials
    npm start
    ```

3.  **Setup Frontend:**
    ```sh
    cd ../client
    npm install
    npm start
    ```

---

For more, see the [documentation](./documentation/user%20stories.md).
