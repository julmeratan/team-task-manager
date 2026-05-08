const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth, adminOnly } = require('../middleware/auth');

// Get all projects for current user
router.get('/', auth, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('createdBy', 'name email').populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create project (admin only)
router.post('/', auth, adminOnly, [
  body('name').notEmpty().withMessage('Project name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, description, members } = req.body;
    const project = await Project.create({ name, description, createdBy: req.user._id, members: members || [] });
    const populated = await project.populate([{ path: 'createdBy', select: 'name email' }, { path: 'members', select: 'name email' }]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update project (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('createdBy', 'name email').populate('members', 'name email');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
