const express = require('express');
const router  = express.Router();

const {
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require('../controllers/tasksController');

router.get   ('/',           getAllTasks);
router.post  ('/',           createTask);
router.put   ('/:id',        updateTask);
router.patch ('/:id/toggle', toggleTask);
router.delete('/:id',        deleteTask);

module.exports = router;