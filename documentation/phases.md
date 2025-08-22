# CounterPulse Project Phases & Documentation

This document complements the main README.md and provides a phase-by-phase breakdown for building CounterPulse, including technology stack, setup, and development journey.

---

## Project Overview

CounterPulse is a lightweight, offline-first Progressive Web App (PWA) for spaza shop owners and informal traders. It helps manage inventory, track sales, and monitor profit, all from a basic smartphone, with or without an internet connection.

---

## Technology Stack

| Category      | Technology                                                                                 | Rationale                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Frontend**  | React (PWA), Zustand/Redux Toolkit                                                         | Powerful PWA capabilities, state management, and offline support.                                     |
| **Backend**   | Node.js, Express                                                                           | Lean REST API for syncing data from offline devices.                                                  |
| **Database**  | PostgreSQL or MongoDB                                                                      | Data integrity, reliability, and powerful querying.                                                   |
| **Mobile**    | Capacitor                                                                                  | Wraps PWA as a native app for Android/iOS.                                                            |

---

## File Structure

```
CounterPulse/
├── client/                # React PWA frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # App pages (Dashboard, Products, Sales, etc.)
│   │   ├── store/         # Zustand/Redux state management
│   │   ├── utils/         # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js/Express backend
│   ├── controllers/
│   ├── models/            # Database models (Product, Sale, User, etc.)
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── package.json
├── database/              # DB setup/migrations (PostgreSQL/MongoDB)
├── documentation/         # Project documentation
│   ├── phases.md
│   └── user stories.md
├── README.md
└── .gitignore
```

---

## Phase 1: Planning & Setup
- **Description:** Define requirements, user stories, and technical stack. Set up repositories and initial project structure.
- **Deliverables:**
  - Project requirements document
  - User stories and acceptance criteria
  - Initial file structure and repository setup
- **Tasks:**
  - Research user needs
  - Choose tech stack (React, Node.js, PostgreSQL, etc.)
  - Initialize Git repository
  - Create base folders for client and server

---

## Phase 2: Frontend MVP
- **Description:** Build the core user interface as a PWA with offline support.
- **Deliverables:**
  - React PWA scaffolded
  - Product entry and listing UI
  - State management (Zustand/Redux)
  - Barcode scanning integration
  - Service worker for offline support
- **Tasks:**
  - Scaffold React app
  - Implement product CRUD UI
  - Integrate barcode scanner
  - Add offline capabilities

---

## Phase 3: Backend MVP
- **Description:** Develop the backend API and database models for syncing and persistence.
- **Deliverables:**
  - Node.js/Express API scaffolded
  - Database models (Product, Sale, User)
  - REST endpoints for products, sales, and sync
  - (Optional) Basic authentication
- **Tasks:**
  - Scaffold Express app
  - Design and implement models
  - Create REST endpoints
  - Connect to PostgreSQL/MongoDB

---

## Phase 4: Core Features
- **Description:** Implement business logic and analytics.
- **Deliverables:**
  - Sales logging and stock updates
  - Profit calculation logic
  - Dashboard with analytics (profit, top sellers, low stock)
  - Offline data queue and sync logic
- **Tasks:**
  - Implement sales and inventory logic
  - Build dashboard components
  - Add sync logic for offline/online

---

## Phase 5: Testing & Optimization
- **Description:** Ensure reliability, performance, and usability.
- **Deliverables:**
  - Tested offline/online transitions
  - Optimized for low-end devices
  - User feedback incorporated
  - Bug fixes and polish
- **Tasks:**
  - Manual and automated testing
  - Performance profiling
  - User testing
  - Final bug fixes

---

## Phase 6: Deployment
- **Description:** Deploy the application and prepare for production use.
- **Deliverables:**
  - Backend deployed (Heroku, Render, etc.)
  - Frontend deployed as PWA (Vercel, Netlify, etc.)
  - Domain and SSL configured
- **Tasks:**
  - Set up hosting
  - Configure environment variables
  - Deploy and test live

---

## Mobile App with Capacitor

You can turn CounterPulse into a native mobile app using [Capacitor](https://capacitorjs.com/):

1. **Install Capacitor in your React project:**
    ```sh
    npm install @capacitor/core @capacitor/cli
    npx cap init
    ```
2. **Add platforms:**
    ```sh
    npx cap add android
    npx cap add ios
    ```
3. **Build your React app:**
    ```sh
    npm run build
    npx cap copy
    ```
4. **Open and run on device/emulator:**
    ```sh
    npx cap open android
    npx cap open ios
    ```
5. **Publish to app stores:**
    - Use Android Studio/Xcode to build and submit your app.

With Capacitor, you maintain a single codebase for web, PWA, and native mobile apps. You can also use Capacitor plugins to access device features like the camera for barcode scanning.

---

## Development Journey

The inspiration for CounterPulse came from observing the daily hustle of local spaza shops. The initial idea was a simple stock counter, but the project's true purpose was unlocked with one key addition: tracking both **cost price** and **selling price**. This decision transformed the app from a simple utility into a powerful profit-tracking tool.

The biggest technical challenge was perfecting the **offline-first sync logic**. I implemented a system using service workers to intercept network requests while offline, storing them in a queue. When the app detects an internet connection, it processes this queue, syncing the data with the backend API. This ensures zero data loss and a seamless user experience, even in areas with unreliable connectivity. The result is a focused MVP that delivers immediate financial clarity to a vital, underserved sector of the economy.

---

*Empowering small businesses with simple, effective, and modern inventory management.*

