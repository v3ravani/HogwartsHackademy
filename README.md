# 📦 StockMaster — Inventory Management System

StockMaster is a modern, lightweight, and efficient Inventory Management System designed to help small and medium businesses manage stock operations smoothly.
It includes product management, receipts, deliveries, transfers, adjustments, analytics, and a complete movement history — all presented through a clean, intuitive UI.

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

## Introduction

StockMaster is built for businesses that need an easy-to-use inventory tool without complex enterprise overhead.
With fast UI, modular structure, and MySQL backend, StockMaster helps track stock efficiently across products, warehouses, deliveries, receipts, and adjustments.

---

## Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: PHP

Database: MySQL

Storage: LocalStorage (for non-critical cached UI data)

Charts & Analytics: Chart.js

---

## Features

Core Screens

Login Page – Authenticate user with MySQL.

Signup Page – Register new accounts.

Dashboard – KPIs, quick links, charts.

Products Page – List, filter, and manage products.

Create Product – Add new items with SKU, price, quantity.

Receipts Page – View GRNs (Goods Received Notes).

Create Receipt – Add new stock arrivals.

Delivery Page – View all outgoing deliveries.

Create Delivery – Reduce stock for customer dispatches.

Transfers Page – View inter-location movements.

Create Transfer – Move stock between warehouses/branches.

Adjustments Page – Track corrections (damage, errors, expiry).

Create Adjustment – Manually adjust stock quantities.

Move History Page – A single combined log of all stock movements.

Settings Page – Preferences, theme, configurations.

Profile Page – User info and profile management.


Additional Functional Features

Real-time form validation

Modern UI with clean layout

LocalStorage caching for faster experience

Fully responsive

Dashboard insights with charts

Smooth navigation without heavy animations

Modular JavaScript structure

Search + filter tables

Optimized for speed

---

## System Architecture & Database Schema

Architecture Flow

Frontend (HTML/CSS/JS)
        ↓  
PHP Backend (API-style handlers)
        ↓  
MySQL Database  
        ↓  
LocalStorage (UI cache)

Database Schema

users

id

name

email

password


products

id

name

sku

category

quantity

price

created_at


receipts

id

product_id

qty_received

supplier

date


deliveries

id

product_id

qty_delivered

client

date


transfers

id

product_id

from_location

to_location

qty

date


adjustments

id

product_id

qty_change

reason

date


move_history

id

product_id

type

qty

date

---

## How to Setup

1. Clone the Repository

git clone github.com

2. Go to the Project Folder

cd stockmaster

3. Import the Database

Open phpMyAdmin or MySQL CLI

Create a new database named stockmaster

Import stockmaster.sql


4. Configure Database Credentials

Edit config.php:

DB_HOST = "localhost";
DB_NAME = "stockmaster";
DB_USER = "root";
DB_PASS = "";

5. Run Locally

Place the folder into:

/htdocs → XAMPP  
/www    → WAMP

Then open in browser:

http://localhost/stockmaster

---

## Screenshots

![Dashboard](screenshots/dashboard.png)
![Products Page](screenshots/products.png)
![Move History](screenshots/history.png)

(Add images later)

---

## Contributors

Name	Role

vv	Developer, UI/UX, System Architecture
