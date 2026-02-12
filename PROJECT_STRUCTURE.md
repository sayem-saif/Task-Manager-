# 📁 Taskager - Complete Project Structure

## Root Directory
```
Task-Manager--main/
├── backend/                    # Node.js Express API
├── src/                        # React Frontend
├── public/                     # Static assets
├── .env                        # Frontend environment variables
├── .env.example               # Frontend env template
├── .gitignore                 # Git ignore rules
├── package.json               # Frontend dependencies
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── README.md                  # Project documentation
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
└── AUTHENTICATION_GUIDE.md    # Auth setup guide
```

---

## Backend Structure (`/backend`)

```
backend/
├── config/
│   ├── constants.js           # HTTP status codes & messages
│   ├── database.js            # MongoDB connection
│   └── email.js               # Email service (Nodemailer)
│
├── controllers/
│   ├── authController.js      # Auth logic (register, login, verify)
│   └── taskController.js      # Task CRUD operations
│
├── middleware/
│   ├── asyncHandler.js        # Async error wrapper
│   ├── auth.js                # JWT authentication
│   ├── errorHandler.js        # Global error handler
│   └── logger.js              # Request logging
│
├── models/
│   ├── User.js                # User schema (Mongoose)
│   └── Task.js                # Task schema (Mongoose)
│
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   └── taskRoutes.js          # Task endpoints
│
├── node_modules/              # Dependencies (gitignored)
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
├── .env.production.example    # Production env template
├── .gitignore                 # Backend gitignore
├── package.json               # Backend dependencies
├── server.js                  # Express app entry point
├── AUTHENTICATION_GUIDE.md    # Auth documentation
└── EMAIL_SETUP.md             # Email setup guide
```

### Backend API Endpoints

**Authentication (`/api/auth`)**
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /verify-email/:token` - Verify email
- `POST /resend-verification` - Resend verification email
- `GET /me` - Get current user (protected)

**Tasks (`/api/tasks`)** - All Protected
- `GET /` - Get all user tasks
- `GET /:id` - Get task by ID
- `POST /` - Create new task
- `PUT /:id` - Update task
- `PATCH /:id/toggle` - Toggle completion
- `DELETE /:id` - Delete task

---

## Frontend Structure (`/src`)

```
src/
├── api/
│   ├── client.ts              # Axios instance & interceptors
│   ├── taskApi.ts             # Task API service
│   └── authApi.ts             # Auth API service
│
├── components/
│   ├── ui/                    # shadcn/ui components (35+ components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── AddTaskForm.tsx        # Task creation form
│   ├── DarkModeToggle.tsx     # Theme switcher
│   ├── EditTaskModal.tsx      # Task edit dialog
│   ├── FilterBar.tsx          # Task filtering
│   ├── Header.tsx             # App header
│   ├── LiveClock.tsx          # Real-time clock
│   ├── LoadingSkeleton.tsx    # Loading skeletons
│   ├── NavLink.tsx            # Navigation link
│   ├── ProgressTracker.tsx    # Progress visualization
│   ├── StatsBar.tsx           # Statistics cards
│   ├── TaskCard.tsx           # Individual task card
│   └── TaskList.tsx           # Task list container
│
├── data/
│   └── dummyTasks.ts          # (Deprecated - now using API)
│
├── hooks/
│   ├── use-mobile.tsx         # Mobile detection hook
│   ├── use-toast.ts           # Toast notification hook
│   └── useRealTime.ts         # Real-time features (notifications, countdown)
│
├── lib/
│   └── utils.ts               # Utility functions (cn, etc.)
│
├── pages/
│   ├── Index.tsx              # Main dashboard
│   ├── Login.tsx              # Login/Register page
│   ├── NotFound.tsx           # 404 page
│   └── VerifyEmail.tsx        # Email verification page
│
├── test/
│   ├── example.test.ts        # Example tests
│   └── setup.ts               # Test configuration
│
├── types/
│   └── task.ts                # TypeScript type definitions
│
├── App.css                    # App-specific styles
├── App.tsx                    # App component & routing
├── index.css                  # Global styles & Tailwind
├── main.tsx                   # React entry point
└── vite-env.d.ts             # Vite types
```

---

## Configuration Files

### Root Configuration
- **package.json** - Dependencies: React 18.3, TypeScript, Vite, Tailwind, shadcn/ui, React Router, TanStack Query, axios
- **vite.config.ts** - Vite bundler settings, aliases (@/ → src/)
- **tailwind.config.ts** - Tailwind CSS customization
- **tsconfig.json** - TypeScript compiler options
- **postcss.config.js** - PostCSS plugins
- **components.json** - shadcn/ui configuration

### Backend Configuration
- **package.json** - Dependencies: Express, Mongoose, JWT, bcrypt, nodemailer, CORS
- **server.js** - Express server, middleware, routing
- **.env** - Environment secrets (MongoDB URI, JWT secret, etc.)

---

## Key Dependencies

### Frontend
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.3",
  "@tanstack/react-query": "^5.62.11",
  "axios": "^1.7.9",
  "tailwindcss": "^3.4.17",
  "vite": "^5.4.19",
  "typescript": "~5.7.2",
  "lucide-react": "^0.469.0"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.1.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "nodemailer": "^6.9.8",
  "cors": "^2.8.5",
  "dotenv": "^16.4.1"
}
```

---

## Data Flow

### Authentication Flow
```
User Input → Login.tsx → authApi.login() 
  → apiClient (axios) → Backend /api/auth/login 
  → JWT Generated → sessionStorage → App.tsx → Index.tsx
```

### Task CRUD Flow
```
User Action → Index.tsx → taskApi function 
  → apiClient (axios with Auth header) → Backend /api/tasks/* 
  → MongoDB → Response → Update React State
```

### Protected Routes
```
Request → apiClient Interceptor (adds Bearer token) 
  → Backend → auth.js middleware (verify JWT) 
  → Check user ownership → Execute controller
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Taskager
VITE_NODE_ENV=development
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskager
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:8080
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASSWORD=app_password
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  isVerified: Boolean,
  verificationToken: String,
  verificationTokenExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  dueDate: String,
  dueTime: String,
  priority: String (Low/Medium/High),
  completed: Boolean,
  completedAt: String,
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Build & Run Commands

### Development
```bash
# Frontend
npm run dev         # Start Vite dev server (port 8080)

# Backend  
cd backend
npm run dev         # Start with nodemon (port 5000)
```

### Production Build
```bash
# Frontend
npm run build       # Build to /dist folder
npm run preview     # Preview production build

# Backend
cd backend
npm start           # Run with Node.js
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Update .env.production with real values
- [ ] Test build: `npm run build`
- [ ] Verify API endpoints work
- [ ] Check environment variables
- [ ] Update CORS origins for production

### Backend (Render)
- [ ] Push to GitHub
- [ ] Connect repository on Render
- [ ] Set environment variables
- [ ] Configure build/start commands
- [ ] Whitelist Render IPs in MongoDB Atlas

### Frontend (Vercel)
- [ ] Push to GitHub
- [ ] Import project on Vercel
- [ ] Set environment variables
- [ ] Configure build settings
- [ ] Update backend CORS with Vercel URL

---

## Features Implemented

✅ **Backend**
- Full CRUD API for tasks
- JWT authentication & authorization
- Email verification system
- Password hashing (bcrypt)
- MongoDB integration
- Error handling & logging
- CORS configuration
- Environment-based config

✅ **Frontend**
- Modern React 18 with TypeScript
- Responsive design (mobile-first)
- Dark mode support
- Real-time countdown timers
- Task filtering & sorting
- Loading states & skeletons
- Toast notifications
- Overdue task highlighting
- Smooth animations
- API service layer (axios)
- Protected routes
- Session management

✅ **Deployment Ready**
- Environment variable support
- Production configurations
- Deployment guides (Render + Vercel)
- Security best practices
- Performance optimization

---

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only session storage
- CORS protection
- Input validation
- SQL injection prevention (Mongoose)
- XSS protection
- Rate limiting ready
- Environment variable protection
- User ownership validation

---

## Performance Features

- Code splitting (React Router)
- Lazy loading
- Optimized bundle size
- Image optimization
- CSS minification
- Tree shaking
- Gzip compression (Vite)
- CDN-ready assets
- Efficient re-renders (React Query)
- Database indexing

---

For deployment instructions, see **DEPLOYMENT_GUIDE.md**  
For authentication setup, see **AUTHENTICATION_GUIDE.md**
