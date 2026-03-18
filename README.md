# 🐾 Animal Rescue Network

## 🌟 Overview

**Animal Rescue Network** is a full-stack web application designed to streamline the process of reporting, tracking, and managing stray animal rescue operations within a city.

The platform connects **citizens, volunteers, and donors** to ensure faster rescue responses and better medical support for injured or abandoned animals.

Users can report rescue cases with images and location, volunteers can claim and manage rescue tasks, and donors can contribute funds for treatment — all in one unified system.

---

## 🚀 Key Features

* 📢 **Report Rescue Cases**
  Users can post "Rescue Required" requests with images and geo-location.

* 🐕 **Volunteer Claim System**
  Volunteers can claim rescue requests and update their status.

* 📍 **Geo-Location Support**
  Rescue locations are stored using latitude and longitude.

* 💰 **Donation Portal**
  Users can donate for specific rescue cases requiring medical treatment.

* 🔐 **Authentication & Authorization**
  Secure login system using JWT-based authentication.

* 📷 **Image Upload**
  Upload and manage images for rescue posts.

* 📊 **Dashboard**
  View all rescue cases and track their progress.

---

## 🏗️ System Architecture

```text
User
 │
 ▼
React Frontend (Vite)
 │
 ▼
Spring Boot Backend (REST API)
 │
 ▼
PostgreSQL Database
```

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Axios
* Bootstrap / CSS
* React Icons

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* REST APIs

### Database

* PostgreSQL (or MySQL)

### DevOps

* Docker
* Render (Deployment)

---

## 📂 Project Structure

```text
Animal-Rescue-Network
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── config
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/animal-rescue-network.git
cd animal-rescue-network
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### 3️⃣ Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

### 4️⃣ Database Setup (PostgreSQL)

```sql
CREATE DATABASE animalrescuedb;
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/animalrescuedb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔗 API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Rescue

* `POST /api/rescue/create`
* `GET /api/rescue/all`
* `GET /api/rescue/{id}`
* `PUT /api/rescue/claim/{id}`
* `PUT /api/rescue/complete/{id}`

### Donations

* `POST /api/donation/add`
* `GET /api/donation/rescue/{id}`

---

## 🌍 Deployment

### Frontend

Deployed on Render:

```
https://animal-rescue-network-frontend.onrender.com
```

### Backend

Deployed on Render (example):

```
https://animal-rescue-network-backend.onrender.com
```

---

## 🎯 Purpose

This project aims to:

* Improve response time for animal rescues
* Connect communities with volunteers
* Enable transparent donation tracking
* Provide a centralized rescue management system

---

## 🚧 Future Enhancements

* 🗺️ Google Maps integration
* 📱 Mobile responsiveness improvements
* 🔔 Real-time notifications
* 🧑‍⚕️ Veterinary support integration
* 📊 Advanced analytics dashboard

---

## 🤝 Contribution

Contributions are welcome!
Feel free to fork this repository and submit pull requests.

---

## 📄 License

This project is developed for educational and social impact purposes.

---

## 💡 Author

Developed by **Venky**
