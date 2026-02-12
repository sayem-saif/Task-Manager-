# 🎯 Taskager - Modern Task Management for Students

A full-stack, production-ready task management application designed for students to organize assignments, track deadlines, and boost productivity.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-Express-green)
![Tech Stack](https://img.shields.io/badge/MongoDB-Atlas-success)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tech Stack](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

### 🎨 Frontend Features
- ✅ **Task Management** - Create, edit, delete, and organize tasks
- 📅 **Due Dates & Times** - Set precise deadlines with countdown timers
- 🎯 **Priority Levels** - Categorize as Low, Medium, or High priority
- 🔔 **Smart Notifications** - Browser notifications for upcoming tasks
- ⚡ **Real-time Updates** - Live countdown & overdue task highlighting
- 📊 **Progress Tracking** - Visual progress bars and statistics
- 🌓 **Dark Mode** - Elegant dark/light theme support
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚙️ **Filtering & Sorting** - Filter by status, sort by date or priority
- 🎭 **Loading Skeletons** - Smooth loading states with animations
- 🎨 **Modern UI** - Built with shadcn/ui components

### 🔐 Backend Features
- 🔒 **User Authentication** - Secure JWT-based auth system
- 📧 **Email Verification** - Optional email confirmation
- 🔑 **Password Security** - bcrypt password hashing
- 🛡️ **Protected Routes** - User-specific task isolation
- 📡 **RESTful API** - Clean, documented API endpoints
- 🗄️ **MongoDB Integration** - Cloud database with MongoDB Atlas
- ⚠️ **Error Handling** - Comprehensive error management
- 🚀 **Production Ready** - Deployment configs included

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching & caching
- **Axios** - HTTP client with interceptors
- **Lucide Icons** - Modern icon system

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18** - Web framework
- **MongoDB + Mongoose** - NoSQL database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **CORS** - Cross-origin security

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- MongoDB Atlas account (free tier works!)

### Installation

**1. Clone repository**
```bash
git clone https://github.com/sayem-saif/Task-Manager-.git
cd Task-Manager--main
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

**4. Configure environment variables**

Frontend (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Taskager
VITE_NODE_ENV=development
```

Backend (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:8080
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**5. Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**6. Open browser**
```
Frontend: http://localhost:8080
Backend:  http://localhost:5000
```

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deploy to Render + Vercel
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete file structure
- **[AUTHENTICATION_GUIDE.md](backend/AUTHENTICATION_GUIDE.md)** - Auth setup
- **[EMAIL_SETUP.md](backend/EMAIL_SETUP.md)** - Email configuration

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/verify-email/:id  Verify email
POST   /api/auth/resend            Resend verification
GET    /api/auth/me                Get current user
```

### Tasks (Protected)
```
GET    /api/tasks                  Get all user tasks
GET    /api/tasks/:id              Get task by ID
POST   /api/tasks                  Create new task
PUT    /api/tasks/:id              Update task
PATCH  /api/tasks/:id/toggle       Toggle completion
DELETE /api/tasks/:id              Delete task
```

## 🌐 Deployment

### Deploy Backend to Render
```bash
1. Create account at render.com
2. Connect GitHub repository
3. Set root directory to "backend"
4. Add environment variables
5. Deploy!
```

### Deploy Frontend to Vercel
```bash
# Using Vercel CLI
npm install -g vercel
vercel --prod

# Or use Vercel Dashboard
1. Import project from GitHub
2. Set build command: npm run build
3. Set output directory: dist
4. Add environment variables
5. Deploy!
```

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for detailed instructions.

## 📁 Project Structure

```
Task-Manager--main/
├── backend/              # Express API server
│   ├── config/           # Database, email, constants
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth, error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── server.js         # Entry point
├── src/                  # React frontend
│   ├── api/              # API service layer
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Route pages
│   └── types/            # TypeScript types
├── .env                  # Frontend env vars
└── package.json          # Dependencies
```

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshot-dashboard.png)

### Task Creation
![Create Task](docs/screenshot-create.png)

### Dark Mode
![Dark Mode](docs/screenshot-dark.png)

## 🧪 Testing
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🧪 Testing

Basic tests included in `src/test/`

```bash
npm run test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Sayem Saif**
- GitHub: [@sayem-saif](https://github.com/sayem-saif)
- Repository: [Task-Manager-](https://github.com/sayem-saif/Task-Manager-)

## 🙏 Acknowledgments

- React community for amazing tools
- shadcn for beautiful UI components
- MongoDB Atlas for cloud database
- Render & Vercel for hosting platforms

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation files
- Review the deployment guide

---

**Made with ❤️ for students by students**
