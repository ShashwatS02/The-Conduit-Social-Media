# 📱 Social Media Dashboard – Full-Stack MEVN Application

A complete, production-grade **social media dashboard** built with the **MEVN stack** (MongoDB, Express.js, Vue.js, Node.js).  
This application provides a rich, interactive user experience with **real-time chat, algorithmic feeds, post creation with image uploads, JWT authentication, and an admin dashboard**.  

---

## 📊 GitHub Stats

[![Stars](https://img.shields.io/github/stars/ShashwatS02/The-Conduit-Social-Media?style=for-the-badge&logo=github)](https://github.com/ShashwatS02/The-Conduit-Social-Media/stargazers)
[![Forks](https://img.shields.io/github/forks/ShashwatS02/The-Conduit-Social-Media?style=for-the-badge&logo=github)](https://github.com/ShashwatS02/The-Conduit-Social-Media/network/members)
[![Issues](https://img.shields.io/github/issues/ShashwatS02/The-Conduit-Social-Media?style=for-the-badge&logo=github)](https://github.com/ShashwatS02/The-Conduit-Social-Media/issues)
[![Last Commit](https://img.shields.io/github/last-commit/ShashwatS02/The-Conduit-Social-Media?style=for-the-badge&logo=git)](https://github.com/ShashwatS02/The-Conduit-Social-Media/commits/main)

---

## ✨ Features

- 🔐 **JWT Authentication**: Secure registration & login with httpOnly cookies.  
- 📰 **Algorithmic Feed**: Engagement-based ranking with infinite scroll.  
- ❤️ **Rich Post Interactions**: Likes, comments, shares with optimistic UI updates.  
- 🖼️ **Post Creation**: Image upload via **Cloudinary** with modern post composer.  
- 👤 **User Profiles**: Dynamic profiles with custom avatars and user posts.  
- 💬 **Real-Time Chat**: Built with **Socket.IO**, supporting secure messaging.  
- 🛡️ **Admin Dashboard**: User management with ban/unban controls.  
- 🎨 **UI/UX**: Responsive, Tailwind-powered with light/dark mode & animations.  

---

## 🛠️ Tech Stack

- **Frontend**: Vue 3 (Composition API), Vite, Pinia, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose  
- **Real-Time**: Socket.IO  
- **Image Hosting**: Cloudinary  
- **Authentication**: JWT + bcryptjs  

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js **v20.x or later**  
- MongoDB (local instance or Atlas cluster)  

---

### 📥 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShashwatS02/The-Conduit-Social-Media.git
   cd The-Conduit-Social-Media
Install Frontend dependencies

bash
Copy code
cd frontend
npm install
cd ..
Install Backend dependencies

bash
Copy code
cd backend
npm install
cd ..
⚙️ Configure Environment Variables
Inside the backend/ directory, create a .env file:

env
Copy code
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
(Optional) Seed the Database
Populate the DB with test users & posts. Run from the backend directory:

bash
Copy code
npm run seed
Run the application
From the project root:

bash
Copy code
npm run dev
Frontend → http://localhost:5173

Backend → http://localhost:5000

📂 Project Structure
plaintext
Copy code
The-Conduit-Social-Media/
├── backend/        # Express.js REST API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── .env
│   └── server.js
├── frontend/       # Vue 3 + Vite client
│   ├── src/
│   ├── public/
│   └── ...
├── package.json
├── README.md
└── ...
🤝 Contributing
We welcome contributions! 🚀

Fork the repo

Create your branch → git checkout -b feature/amazing-feature

Commit changes → git commit -m "Add amazing feature"

Push branch → git push origin feature/amazing-feature

Open a Pull Request

📜 License
This project is licensed under the MIT License – free to use, modify, and distribute.

🌟 Built with passion by Shashwat Singh
yaml
