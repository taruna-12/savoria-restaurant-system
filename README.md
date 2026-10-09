# 🍽️ Savoria — Smart Restaurant Reservation & Pre-Ordering System

## 📌 Overview

**Savoria** is a centralized web application designed to streamline restaurant operations by replacing manual phone bookings with real-time table reservations and digital food pre-ordering.

The platform aims to reduce dependency on third-party aggregators and their commissions while providing customers with convenient table selection, menu browsing, and a seamless dining experience.

## ✨ Features

- 🪑 **Real-Time Table Reservations** — Efficient booking management with double-booking conflict prevention.
- 📋 **Interactive Digital Menu** — Browse categorized menu items with Veg and Non-Veg filters.
- 🛒 **Digital Pre-Ordering** — Add menu items to a cart and associate orders with table reservations.
- 🛡️ **Secure Authentication** — Customer and admin authentication using JWT and password hashing.
- 📊 **Admin Dashboard** — Manage menus, reservations, and table allocations.
- ✉️ **Email Confirmations** — Automated booking notifications with unique booking tokens.
- 📱 **Responsive Interface** — Access the platform across desktop, tablet, and mobile devices.

## 🖥️ Frontend

The frontend provides a responsive interface for customers to explore menus, select tables, manage carts, and make reservations.

**Technologies Used**
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Context API for authentication and cart state management
- Axios for API communication

## ⚙️ Backend

The backend manages business logic, reservation scheduling, authentication, and communication between the frontend and database.

**Key Functions**
- RESTful API routing and endpoint management
- Table availability validation and booking conflict prevention
- JWT authentication and role-based authorization
- Password hashing for secure credential storage
- Email notifications through SMTP
- Database operations for reservations, users, and menu items

**Technologies Used**
- Node.js
- Express.js
- MongoDB Atlas with Mongoose
- MySQL with Sequelize as an alternative database option
- JSON Web Tokens (JWT)
- Bcrypt.js
- Nodemailer


## 🔐 Security

- JWT-based authentication and authorization
- Password hashing
- Server-side validation of reservation requests
- Prevention of conflicting table bookings
- Environment-based configuration for sensitive credentials

## 👩‍💻 Author

**Taruna Ezhumalai**

Developed as a restaurant reservation and digital pre-ordering web application.
