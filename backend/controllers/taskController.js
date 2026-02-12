const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS, MESSAGES } = require('../config/constants');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  
  // Transform _id to id for frontend compatibility
  const transformedTasks = tasks.map(task => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    completed: task.completed,
    completedAt: task.completedAt
  }));
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: transformedTasks.length,
    data: transformedTasks
  });
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this task'
    });
  }

  // Transform for frontend
  const transformedTask = {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    completed: task.completed,
    completedAt: task.completedAt
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: transformedTask
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, dueTime, priority } = req.body;

  // Validate required fields
  if (!title || !description || !dueDate || !dueTime) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide title, description, due date, and due time'
    });
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    dueTime,
    priority: priority || 'Medium',
    user: req.user._id
  });

  // Transform for frontend
  const transformedTask = {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    completed: task.completed,
    completedAt: task.completedAt
  };

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Task created successfully',
    data: transformedTask
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to update this task'
    });
  }

  task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  // Transform for frontend
  const transformedTask = {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    completed: task.completed,
    completedAt: task.completedAt
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Task updated successfully',
    data: transformedTask
  });
});

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
exports.toggleTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to update this task'
    });
  }

  // Toggle completion status
  task.completed = !task.completed;
  task.completedAt = task.completed 
    ? new Date().toISOString().split('T')[0] 
    : null;

  await task.save();

  // Transform for frontend
  const transformedTask = {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    completed: task.completed,
    completedAt: task.completedAt
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Task marked as ${task.completed ? 'completed' : 'pending'}`,
    data: transformedTask
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Make sure user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to delete this task'
    });
  }

  await task.deleteOne();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Task deleted successfully'
  });
});
