import { Hono } from 'hono';
import { cors } from 'hono/cors';
import mongoose from 'mongoose';

// Import models
import User from './models/User.js';
import Task from './models/Task.js';

// Import controllers
import { register, login, verifyEmail, getCurrentUser } from './controllers/authController.js';
import { getTasks, getTaskById, createTask, updateTask, toggleTask, deleteTask } from './controllers/taskController.js';

const app = new Hono();

// MongoDB connection cache for Workers
let cachedDb = null;

async function connectDB(mongoUri) {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 1, // Workers should use minimal connections
    });
    cachedDb = mongoose.connection;
    console.log('MongoDB Connected');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// CORS middleware
app.use('*', cors({
  origin: (origin) => origin, // Allow all origins in production, configure as needed
  credentials: true,
}));

// Auth middleware for Hono
const protect = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Not authorized, no token' }, 401);
  }

  try {
    const token = authHeader.split(' ')[1];
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, c.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return c.json({ message: 'User not found' }, 401);
    }
    
    // Attach user to context
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ message: 'Not authorized, token failed' }, 401);
  }
};

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/register', async (c) => {
  const body = await c.req.json();
  // Create Express-like req/res objects
  const req = { body, get: (header) => c.req.header(header) };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await register(req, res);
});

app.post('/api/auth/login', async (c) => {
  const body = await c.req.json();
  const req = { body };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await login(req, res);
});

app.get('/api/auth/verify-email', async (c) => {
  const token = c.req.query('token');
  const req = { query: { token } };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await verifyEmail(req, res);
});

app.get('/api/auth/me', protect, async (c) => {
  const req = { user: c.get('user') };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await getCurrentUser(req, res);
});

// Task routes
app.get('/api/tasks', protect, async (c) => {
  const req = { user: c.get('user') };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await getTasks(req, res);
});

app.get('/api/tasks/:id', protect, async (c) => {
  const req = { user: c.get('user'), params: { id: c.req.param('id') } };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await getTaskById(req, res);
});

app.post('/api/tasks', protect, async (c) => {
  const body = await c.req.json();
  const req = { user: c.get('user'), body };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await createTask(req, res);
});

app.put('/api/tasks/:id', protect, async (c) => {
  const body = await c.req.json();
  const req = { user: c.get('user'), params: { id: c.req.param('id') }, body };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await updateTask(req, res);
});

app.patch('/api/tasks/:id/toggle', protect, async (c) => {
  const req = { user: c.get('user'), params: { id: c.req.param('id') } };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await toggleTask(req, res);
});

app.delete('/api/tasks/:id', protect, async (c) => {
  const req = { user: c.get('user'), params: { id: c.req.param('id') } };
  const res = {
    status: (code) => ({
      json: (data) => c.json(data, code)
    }),
    json: (data) => c.json(data)
  };
  await deleteTask(req, res);
});

// 404 handler
app.notFound((c) => {
  return c.json({ message: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ 
    message: err.message || 'Internal server error',
    stack: c.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500);
});

// Cloudflare Workers export
export default {
  async fetch(request, env, ctx) {
    // Connect to MongoDB
    await connectDB(env.MONGODB_URI);
    
    // Create a new app instance with env variables
    const appWithEnv = new Hono();
    
    // Add env to all requests
    appWithEnv.use('*', async (c, next) => {
      c.env = env;
      await next();
    });
    
    // Mount main app
    appWithEnv.route('/', app);
    
    return appWithEnv.fetch(request, env, ctx);
  },
};
