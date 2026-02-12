# 🚀 Quick Start Guide - Taskager Backend

## Initial Setup (First Time Only)

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment:**
   ```bash
   # Copy .env.example to .env (already done)
   # Edit .env if needed to change MongoDB URI or port
   ```

3. **Start MongoDB:**
   - **Local MongoDB:**
     ```bash
     # Windows
     net start MongoDB
     
     # Mac/Linux
     sudo systemctl start mongod
     ```
   
   - **MongoDB Atlas:**
     Update MONGODB_URI in .env with your Atlas connection string

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

## Testing the API

Once server is running, test these endpoints:

1. **Root Endpoint:**
   ```
   GET http://localhost:5000/
   ```

2. **Health Check:**
   ```
   GET http://localhost:5000/api/health
   ```

## Expected Console Output

```
✅ MongoDB Connected Successfully
📍 Host: localhost
🗄️  Database: taskager
🔌 Port: 27017

🚀 Server running in development mode
📡 Listening on port 5000
🌐 API URL: http://localhost:5000
⏰ Started at: [timestamp]
```

## Next Steps

1. Create Task model in `models/Task.js`
2. Create Task controller in `controllers/taskController.js`
3. Create Task routes in `routes/taskRoutes.js`
4. Add routes to `server.js`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in .env
- Or kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# View installed packages
npm list --depth=0

# Update packages
npm update
```
