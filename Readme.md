# CounterPulse 📦

**The heartbeat of your hustle.**

![Status](https://img.shields.io/badge/status-Hackathon%20MVP-brightgreen)

This project is a submission for the **Platform45 Future Tech Graduate Internship Program: Solo Hackathon Challenge**.

---
### **The Problem**

Spaza shop owners and informal traders are the backbone of our communities, but they often operate with one hand tied behind their back. Managing stock with memory or scattered notebooks leads to constant uncertainty: popular items run out, disappointing customers and losing sales; perishable goods expire, wasting money; and most importantly, **profit is just a guess**. This makes sustainable growth nearly impossible.

### **The Solution: CounterPulse**

**CounterPulse** is a lightweight, offline-first Progressive Web App (PWA) designed specifically for the needs of informal traders. It replaces guesswork with data, empowering any small business owner to manage their inventory, track sales, and see their real-time profit—all from a basic smartphone, with or without an internet connection.

### **Key Features (MVP)**

-   📲 **Offline-First Reliability:** The app works flawlessly without an internet connection. All sales and stock updates are saved locally and synced securely to the cloud when the user is back online.
-   📈 **Simple Profit Dashboard:** At a glance, users can see their daily/weekly profit, total revenue, and best-selling items, turning raw sales data into business intelligence.
-   🔔 **Smart Low-Stock Alerts:** CounterPulse automatically highlights products that are running low, helping owners reorder in time and never miss a sale.
-   📦 **Barcode Scanning:** Uses the phone's camera to quickly add new items or log sales, dramatically speeding up the checkout and stock-taking process.

### **Technology Stack**

A modern, pragmatic stack was chosen to deliver a fast, reliable, and accessible user experience.

| Category      | Technology                                                                                                                                                               | Rationale                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Frontend**  | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)                                                                                            | Chosen for its powerful PWA capabilities (via Service Workers) to deliver the critical offline-first experience. |
| **Backend**   | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) | Selected for its efficiency in building a lean REST API designed for syncing data from offline devices.    |
| **Database**  | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white)                                                                           | A robust relational database chosen for its data integrity, reliability, and powerful querying capabilities.         |
| **Mobile**    | ![Capacitor](https://img.shields.io/badge/-Capacitor-119EFF?logo=capacitor&logoColor=white)                                                                              | Used to package the PWA as a native mobile app for Android/iOS, enabling access to device features.                |

### **Local Setup & Installation**

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/[YourUsername]/Stok-Smart.git
    cd Stok-Smart
    ```

2.  **Setup Backend:**
    ```sh
    cd server
    npm install
    # Create a .env file based on .env.example and add your database credentials
    npm run dev
    ```

3.  **Setup Frontend:**
    ```sh
    cd client
    npm install
    npm start
    ```

The application will be running on `http://localhost:3000`.

### **Development Journey**

The inspiration for CounterPulse came from observing the daily hustle of local spaza shops. The initial idea was a simple stock counter, but the project's true purpose was unlocked with one key addition: tracking both **cost price** and **selling price**. This decision transformed the app from a simple utility into a powerful profit-tracking tool.

The biggest technical challenge was perfecting the **offline-first sync logic**. I implemented a system using service workers to intercept network requests while offline, storing them in a queue. When the app detects an internet connection, it processes this queue, syncing the data with the backend API. This ensures zero data loss and a seamless user experience, even in areas with unreliable connectivity. The result is a focused MVP that delivers immediate financial clarity to a vital, underserved sector of the economy.
