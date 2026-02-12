const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// /api/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

// /api/tasks/:id
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// /api/tasks/:id/toggle
router.patch('/:id/toggle', toggleTask);

module.exports = router;
