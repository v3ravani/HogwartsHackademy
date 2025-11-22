# StockMaster — A Modern Stock & Inventory Management System

## 📌 Introduction
StockMaster is a lightweight, fast, and modern stock & inventory management system designed for small businesses, local shops, and personal stock tracking.  
It offers clean UI, smooth navigation, and essential stock management features without unnecessary complexity.  
The system uses **MySQL** for backend data storage and **LocalStorage** for lightweight client-side caching.
---


## 📑 Index

1. Introduction  
2. Tech Stack  
3. Features  
4. System Architecture & Database Schema  
5. How to Setup  
6. Screenshots  
7. Contributors

---

## 🛠️ Tech Stack

**Frontend**
- HTML5  
- CSS3 (Modern utility-first styling + custom components)
- JavaScript (Vanilla JS + modular architecture)

**Backend**
- PHP (API + server-side logic)
- MySQL (database for products, sales, categories, logs)

**Other**
- LocalStorage (for client-side caching)
- Chart.js (analytics & insights charts)

---
## ⭐ Features

### 🔹 Core Inventory Features
- Add, edit, delete products  
- Category-wise product organization  
- Automatic low-stock warnings  
- Product search & smart filters  
- Bulk import/export (CSV)

### 🔹 Stock Tracking
- Purchase entry  
- Stock-in / Stock-out logs  
- Real-time update of quantities  
- Expiry date tracking  
- Supplier assignment per product

### 🔹 Sales Management
- Create instant bills  
- Apply discounts & tax  
- Auto stock deduction on billing  
- Daily/weekly/monthly revenue reports  
- Saved bills & invoice history

### 🔹 Analytics & Insights
- Best-selling products  
- Category performance  
- Stock movement trends  
- Profit tracking (basic)  
- Analytics charts using Chart.js

### 🔹 Screens (All Screens Included)
- Dashboard  
- Product List  
- Add / Edit Product  
- Categories  
- Stock Logs  
- Sales / Billing  
- Sales History  
- Analytics  
- Settings  
- Profile  
- Login / Register  

### 🔹 System Utilities
- Dark mode  
- LocalStorage caching for faster page loads  
- Responsive design for mobile/tablet  
- Backup/Restore system (MySQL)  
- Activity log for user actions  

---


## 🧩 System Architecture & Database Schema

### **System Architecture**
StockMaster follows a simple and efficient 3-layer structure:

1. **Frontend (Client Layer)**
   - Pure HTML, CSS, JavaScript
   - UI rendering + form validation
   - LocalStorage caching for quick fetches

2. **Backend (Server Layer)**
   - PHP-based REST-style API endpoints
   - Handles CRUD operations, authentication, analytics calculations

3. **Database Layer**
   - MySQL storing products, categories, users, sales, logs, stock history

Data Flow:
Frontend → API (PHP) → MySQL → API Response → Rendered on UI

---

### **Database Schema**

#### **1. users**
| column        | type          | details                |
|---------------|----------------|------------------------|
| id            | INT (PK)       | auto increment         |
| name          | VARCHAR(100)   |                        |
| email         | VARCHAR(150)   | unique                 |
| password      | VARCHAR(255)   | hashed                 |
| role          | VARCHAR(20)    | admin / staff          |
| created_at    | TIMESTAMP      | default current        |

#### **2. products**
| column        | type            | details                   |
|---------------|------------------|---------------------------|
| id            | INT (PK)         | auto increment            |
| name          | VARCHAR(150)     |                           |
| category_id   | INT (FK)         | references categories     |
| quantity      | INT              |                           |
| price         | DECIMAL(10,2)    | selling price             |
| cost_price    | DECIMAL(10,2)    | buying cost               |
| expiry_date   | DATE             | nullable                  |
| supplier      | VARCHAR(150)     | nullable                  |
| created_at    | TIMESTAMP        |                           |

#### **3. categories**
| id | name |
|----|------|

#### **4. sales**
| column        | type             | details               |
|---------------|-------------------|-----------------------|
| id            | INT (PK)          |                       |
| bill_no       | VARCHAR(50)       | unique                |
| total_amount  | DECIMAL(10,2)     |                       |
| discount      | DECIMAL(10,2)     |                       |
| tax           | DECIMAL(10,2)     |                       |
| final_amount  | DECIMAL(10,2)     |                       |
| created_at    | TIMESTAMP         |                       |

#### **5. sale_items**
| sale_id | product_id | quantity | price_at_sale |

#### **6. stock_logs**
| id | product_id | type (in/out) | quantity | note | created_at |

#### **7. activity_log**
| id | action | user_id | details | created_at |

---



##  How to Set Up
### 1 Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```
### 2 Import the MySQL Database
```sql
CREATE DATABASE stockmaster;
USE stockmaster;
SOURCE schema.sql;
```
### 3 Start Local Server
```bash
python3 -m http.server 8080
```
### 4 Configure DB Connection
```js
export const DB_CONFIG = {
host: "localhost",
user: "root",
password: "",
database: "stockmaster"
};
```
### 5 Run the Application
http://localhost:8080


## 👥 Contributors

- **Viraj Ravani** — [GitHub](https://github.com/v3ravani)
- **Visha Yadav** — [GitHub](https://github.com/Vishayadav)
- **Astha Tiwari** — [GitHub](https://github.com/asthatiwari10)
- **Kavya Gada** — [GitHub](https://github.com/thekavyagada)




Made with ❤️ by Team *Hogwarts Hackedemy*.

