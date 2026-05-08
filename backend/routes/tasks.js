const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { auth, adminOnly } = require('../middleware/auth');

// Get tasks (filter by project, status, assignedTo)
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.user.role !== 'admin') filter.assignedTo = req.user._id;
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create task (admin only)
router.post('/', auth, adminOnly, [
  body('title').notEmpty().withMessage('Title is required'),
  body('project').notEmpty().withMessage('Project is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, project, assignedTo, createdBy: req.user._id });
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
      { path: 'project', select: 'name' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update task (admin or assignee)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isAssignee) return res.status(403).json({ msg: 'Not authorized' });
    // Members can only update status
    if (req.user.role !== 'admin') {
      task.status = req.body.status || task.status;
    } else {
      Object.assign(task, req.body);
    }
    await task.save();
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
      { path: 'project', select: 'name' }
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete task (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
