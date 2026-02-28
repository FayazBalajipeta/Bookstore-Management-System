📚 Bookstore Management System

A full-stack MERN application for managing an online bookstore with authentication, admin controls, orders, and customer reviews.

🌐 Live Frontend: https://bookstoreapp-tawny.vercel.app

Login Access(Demo):

Admin:admin@gmail.com

password:123456

User:user@gmail.com

passwod:123456

⚙️ Live Backend API: https://bookstore-management-system-6qhx.onrender.com

🚀 Features

👤 User Features

Register & Login (JWT Authentication)

Browse all books

View detailed book page

Add product reviews ⭐

Add items to cart

Place orders

View order history

🛠 Admin Features

Add new books

Update books

Delete books

Manage orders

View analytics

🏗 Tech Stack

Frontend

React.js

Axios

React Router

React Toastify

CSS

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

CORS configuration

Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

📂 Project Structure

BOOKSTORE/

│

├── backend/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   ├── server.js

│

├── frontend/

│   ├── src/

│   ├── public/

🔐 Authentication Flow

User logs in

Backend generates JWT

Token stored in localStorage

Protected routes validate token

Full user object attached via middleware

⭐ Review System

Logged-in users can add reviews

Duplicate reviews prevented

Average rating auto-calculated

Linked to user via ObjectId

📦 Order System

Cart system

Order creation

Address storage

Order status tracking

Editable while pending

⚙️ Environment Variables

Backend 
.env

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=https://bookstoreapp-tawny.vercel.app

Frontend (Vercel Environment Variable)

REACT_APP_API=https://bookstore-management-system-6qhx.onrender.com

🛠 Installation (Local Setup)

1️⃣ Clone Repository

git clone https://github.com/FayazBalajipeta/Bookstore-Management-System.git

cd Bookstore-Management-System

2️⃣ Backend Setup

cd backend

npm install

npm run dev

Server runs on:

http://localhost:5000

3️⃣ Frontend Setup

cd frontend

npm install

npm start

Runs on:

http://localhost:3000

🧠 Key Learning Outcomes

JWT authentication implementation

Role-based authorization (Admin)

MongoDB schema relationships

Production CORS configuration

Full deployment pipeline (Render + Vercel)

RESTful API design

React state management

📈 Future Improvements

Payment gateway integration

Wishlist feature

Pagination

Search & filter

Image upload via Cloudinary

Dark mode

Email notifications

👨‍💻 Author

Fayaz Balajipeta

Full Stack Developer (MERN)


