# 🏭 StockMaster – Smart Inventory Management System  
### Built by **Hogwarts Hackedemy** for Hackathon 2025

StockMaster is a modern, multi-screen, web-based Inventory Management System designed to simplify product control, warehouse operations, and real-time stock visibility.  
It features a clean UI, streamlined workflows, modular pages, and **Firebase-powered Login Authentication**, built for speed, clarity, and hackathon performance.

---

## 🚀 Live Demo
👉 *Add your deployed link here*

---

## ✨ About the Project

Developed during a 48-hour hackathon, **StockMaster** was created with a mission to build a lightweight yet powerful inventory system suitable for warehouses, businesses, and logistics teams.

It includes **16 interconnected modules**, reusable JavaScript logic, dynamic UI rendering, and a flexible data system for products, stock movements, and transactions.

---

## 🧠 Key Features

### 🔐 Authentication (Firebase)
- Login using Firebase Authentication (Email/Password)
- Secure session handling
- Logout & local session removal

---

### 📊 Dashboard
- KPI Cards:
  - Total Products
  - Low Stock Items
  - Pending Receipts
  - Pending Deliveries
  - Scheduled Transfers
- Filters by:
  - Document Type (Receipts / Delivery / Internal / Adjustments)
  - Status (Draft, Waiting, Ready, Done)
  - Warehouse (WH1 / WH2)
  - Category

---

### 📦 Product Management
- Product listing with search
- Add new products
- Stock auto-updated through receipts, deliveries & adjustments
- Clean modal-style forms for creation

---

### 📥 Receipt Management (Incoming Stock)
- Create new receipt orders
- Supplier selection
- Add products & quantities
- Auto-increase stock levels

---

### 📤 Delivery Orders
- Customer delivery module
- Select product, validate stock availability
- Decrease stock automatically

---

### 🔁 Internal Transfers
- Transfer products between locations
- Stock updated per warehouse
- Transfer logs stored for history

---

### 🧮 Stock Adjustments
- Physical count vs system quantity
- Auto-difference calculation
- Adjustment history logging

---

### 🕒 Move History
Unified timeline for:
- Receipts  
- Deliveries  
- Transfers  
- Adjustments  

Each entry includes timestamp, action type, product, quantity, and locations.

---

### ⚙️ Settings
- Manage warehouses (add/remove)
- Manage categories
- Local data persistence

---

### 👤 User Profile
- Display User ID & Name
- Change Password (mock)
- Logout button

---

## 📂 Project Structure
- login.html
- signup.html
- dashboard.html
- products.html
- create_product.html
- receipts.html
- create_receipt.html
- delivery.html
- create_delivery.html
- transfers.html
- create_transfer.html
- adjustments.html
- create_adjustment.html
- move_history.html
- settings.html
- profile.html
- /js/
- data.js
- login.js
- navigation.js
- products.js
- receipts.js
- delivery.js
- transfers.js
- adjustments.js
- history.js




---

## 🔧 Tech Stack

- **Frontend:** HTML, JavaScript (modular structure, dynamic rendering)
- **Authentication:** Firebase Authentication
- **Hosting:** GitHub Pages / Firebase Hosting  
- **Design System:**  
  - Card-based layout  
  - Modern dashboard UI  
  - Inline styling  
  - Responsive design  

---

## 🛠️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/stockmaster.git
cd stockmaster


const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_AUTH_DOMAIN",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_STORAGE_BUCKET",
   messagingSenderId: "YOUR_SENDER_ID",
   appId: "YOUR_APP_ID"
};


⭐ Support

If you found this project useful, consider giving a ⭐ star to the repository!
Contributions & suggestions are welcome.

