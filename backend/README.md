# Taskager Backend API

Production-ready backend API for Taskager - Student Task Manager application.

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment variables
- **CORS** - Cross-Origin Resource Sharing

## 📁 Project Structure

```
backend/
├── config/          # Database and configuration files
├── controllers/     # Request handlers
├── models/          # Mongoose models/schemas
├── routes/          # API route definitions
├── middleware/      # Custom middleware
├── server.js        # Entry point
├── package.json     # Dependencies
├── .env.example     # Environment variables template
└── README.md        # Documentation
```

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` file and set your MongoDB URI and other settings.

## 🎯 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌐 API Endpoints

### Root
- `GET /` - API welcome message

### Health Check
- `GET /api/health` - Server health status

### Future Routes
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🚦 Getting Started

1. Ensure MongoDB is running locally or use MongoDB Atlas
2. Configure your `.env` file
3. Run `npm run dev` to start the development server
4. API will be available at `http://localhost:5000`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/taskager |
| CLIENT_URL | Frontend URL for CORS | http://localhost:8080 |

## 🔒 Security Features

- CORS enabled with configurable origins
- Error handling middleware
- Input validation (to be implemented)
- Environment variable protection

## 🏗️ Best Practices Implemented

- Clean architecture with separation of concerns
- Centralized error handling
- Environment-based configuration
- Graceful shutdown handling
- Connection pooling for MongoDB
- Proper HTTP status codes
- Structured logging

## 📄 License

MIT License - See LICENSE file for details
