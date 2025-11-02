# MERN Blog Application

A full-stack blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, CRUD operations, and a responsive UI.

##  Features 

### Backend (Express.js + MongoDB)
- **RESTful API** with complete CRUD operations for blog posts
- **User Authentication** with JWT tokens and password hashing
- **Mongoose Models** for Post, Category, and User
- **Input Validation** and error handling middleware
- **CORS** enabled for frontend communication

### Frontend (React.js + Vite)
- **React Router** for single-page application navigation
- **Authentication System** with login/register forms
- **Context API** for global state management (Auth & Categories)
- **Responsive UI** with custom styling
- **Real-time CRUD Operations** for blog posts

### Core Functionality
-  User registration and login
-  Create, read, update, and delete blog posts
-  View individual post pages
-  Dynamic categories system
-  Protected routes and authentication
-  Responsive design

##  Technologies Used

- **Frontend**: React.js, Vite, React Router DOM, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Styling**: Inline CSS with responsive design

##  Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm 

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
    ```
    npm install
    ```
3. Create a .env file:
    ```
    MONGODB_URI=mongodb://localhost:27017/mern-blog
    PORT=5000
    NODE_ENV=development
    JWT_SECRET=your_super_secret_jwt_key_here_2025_07
    ```
4. Start the server:
    ```
    node server.js
    ```
### Frontend Setup
1. Navigate to client directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Create a .env file with:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

Project Structure
mern-blog/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── server.js           # Server entry point
└── README.md
## API ENDPOINTS
### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
### Posts
- GET /api/posts - Get all posts
- GET /api/posts/:id - Get single post
- POST /api/posts - Create new post
- PUT /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post
### Categories
- GET /api/categories - Get all categories
- POST /api/categories - Create new category

## USAGE
- Register/Login: Create an account or login with existing credentials
- Create Posts: Use the form to create new blog posts
- Manage Posts: Edit or delete your existing posts
- View Posts: Click on post titles to view individual posts
- Navigation: Use the header to navigate between pages

## LICENSE
This project is for educational purposes.

## DEVELOPER
Built as part of a MERN stack assignment demonstrating full-stack development capabilities