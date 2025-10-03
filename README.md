# 📱 The Conduit – Social Media Dashboard

<p align="center">
  <img src="https://placehold.co/800x350/1a1a1a/FFFFFF?text=The+Conduit+Social+Media&font=raleway" alt="Project Banner">
</p>

A full-featured **social media dashboard** built with the **MEVN stack**. This platform offers **real-time chat, algorithmic feeds, post creation with image uploads, JWT authentication, admin controls, and a responsive modern UI**.

---

## 🎯 Features

### Core Functionality

* **JWT Authentication**: Secure login & registration with httpOnly cookies
* **Algorithmic Feed**: Engagement-based post ranking with infinite scroll
* **Post Interactions**: Likes, comments, shares with optimistic UI updates
* **Image Uploads**: Cloudinary-powered media uploads in posts
* **User Profiles**: Dynamic profiles with custom avatars and posts
* **Real-Time Chat**: Powered by Socket.IO for instant messaging
* **Admin Dashboard**: User management with ban/unban functionality

### Advanced Features

* **Responsive Design**: Tailwind CSS-powered UI with dark/light mode and animations
* **Optimized Performance**: Efficient backend API routes and frontend lazy-loading
* **Docker Support**: Containerized setup for development and production
* **Scalable Architecture**: Modular structure for easy feature additions

---

## 🛠️ Tech Stack

![Vue.js](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge\&logo=vue.js\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38b2ac?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge\&logo=socket.io\&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-0A0A0A?style=for-the-badge\&logo=cloudinary\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-323330?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)

---

## 📋 Installation & Setup

### Prerequisites

* Node.js v20+ and npm
* MongoDB (local instance or Atlas cluster)
* Docker (optional, for containerized setup)

---

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/ShashwatS02/The-Conduit-Social-Media.git
cd The-Conduit-Social-Media
```

2. **Install dependencies**

```bash
# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..
```

3. **Configure Environment Variables**

Inside `backend/` create a `.env` file:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **(Optional) Seed the Database**

```bash
cd backend
npm run seed
```

5. **Run the Application**

```bash
npm run dev
```

* **Frontend** → [http://localhost:5173](http://localhost:5173)
* **Backend** → [http://localhost:5000](http://localhost:5000)

6. **Docker Setup (Optional)**

```bash
docker-compose up --build
```

This spins up both frontend and backend services in Docker containers.

---

## 🎮 Usage Guide

### Interacting with the App

1. **Sign Up / Login**

   * Secure authentication using JWT
2. **Feed & Posts**

   * Create posts with images
   * Like, comment, and share posts
3. **Chat**

   * Real-time messaging via Socket.IO
4. **Admin Controls**

   * View users, ban/unban accounts
5. **Responsive UI**

   * Works seamlessly across desktop and mobile

---

## 🛠️ Development

### Project Structure

```
The-Conduit-Social-Media/
├── backend/        # Express.js REST API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/       # Vue 3 + Vite client
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── store/
│   │   └── App.vue
│   └── ...
├── docker-compose.yml
├── package.json
└── README.md
```

### Key Technologies

* **Frontend**: Vue 3, Vite, Pinia, Tailwind CSS
* **Backend**: Node.js, Express.js, JWT Authentication, Socket.IO
* **Database**: MongoDB with Mongoose
* **Media Handling**: Cloudinary for image uploads
* **Real-Time Communication**: Socket.IO
* **Containerization**: Docker & Docker Compose for easy deployment

---

## 📈 Performance & Optimization

* Efficient database queries and indexing for scalable feeds
* Lazy-loaded components for faster frontend performance
* Real-time chat optimized for low-latency messaging
* Responsive design for desktop and mobile screens

---

## 🔒 Privacy & Security

* JWT-based authentication with httpOnly cookies
* Passwords hashed with bcryptjs
* Admin controls for user management and content moderation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License – free to use, modify, and distribute.

---

**Built with ❤️ by Shashwat Singh – a fully-featured social media dashboard powered by MEVN & Docker**
