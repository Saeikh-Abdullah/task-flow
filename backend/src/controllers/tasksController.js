const { db } = require('../models/db');

const getAllTasks = (req, res) => {
  try {
    const { status } = req.query;
    let tasks;

    if (status && ['pending', 'completed'].includes(status)) {
      tasks = db
        .prepare('SELECT * FROM tasks WHERE status = ? ORDER BY priority DESC, created_at DESC')
        .all(status);
    } else {
      tasks = db
        .prepare('SELECT * FROM tasks ORDER BY priority DESC, created_at DESC')
        .all();
    }

    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

const createTask = (req, res) => {
  const { title, description, priority, due_date } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required and cannot be empty',
    });
  }
  if (title.trim().length > 255) {
    return res.status(400).json({
      success: false,
      message: 'Title must be 255 characters or fewer',
    });
  }

  const validPriorities = ['low', 'medium', 'high'];
  const taskPriority = validPriorities.includes(priority) ? priority : 'medium';

  try {
    const result = db
      .prepare(
        `INSERT INTO tasks (title, description, priority, due_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
      )
      .run(
        title.trim(),
        description?.trim() || null,
        taskPriority,
        due_date || null
      );

    const newTask = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ success: false, message: 'Title cannot be empty' });
  }

  const validStatuses = ['pending', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be pending or completed',
    });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Priority must be low, medium, or high',
    });
  }

  try {
    const updatedTitle    = title       !== undefined ? title.trim()               : existing.title;
    const updatedDesc     = description !== undefined ? (description.trim() || null) : existing.description;
    const updatedStatus   = status   || existing.status;
    const updatedPriority = priority || existing.priority;
    const updatedDueDate  = due_date !== undefined ? (due_date || null)            : existing.due_date;

    db.prepare(
      `UPDATE tasks
       SET title=?, description=?, status=?, priority=?, due_date=?, updated_at=datetime('now')
       WHERE id=?`
    ).run(updatedTitle, updatedDesc, updatedStatus, updatedPriority, updatedDueDate, id);

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

const toggleTask = (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const newStatus = existing.status === 'pending' ? 'completed' : 'pending';

  try {
    db.prepare(
      `UPDATE tasks SET status=?, updated_at=datetime('now') WHERE id=?`
    ).run(newStatus, id);

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to toggle task' });
  }
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};

module.exports = { getAllTasks, createTask, updateTask, toggleTask, deleteTask };