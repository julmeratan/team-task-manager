const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') filter.assignedTo = req.user._id;

    const [totalTasks, pending, inProgress, completed, overdue, projects, recentTasks] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: 'pending' }),
      Task.countDocuments({ ...filter, status: 'in-progress' }),
      Task.countDocuments({ ...filter, status: 'completed' }),
      Task.countDocuments({ ...filter, status: { $ne: 'completed' }, dueDate: { $lt: new Date() } }),
      req.user.role === 'admin' ? Project.countDocuments() : Project.countDocuments({ members: req.user._id }),
      Task.find(filter).sort({ createdAt: -1 }).limit(5)
        .populate('assignedTo', 'name').populate('project', 'name')
    ]);

    res.json({ totalTasks, pending, inProgress, completed, overdue, projects, recentTasks });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
