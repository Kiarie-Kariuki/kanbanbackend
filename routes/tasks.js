const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Get all tasks for a user, including their status
router.get('/', authMiddleware, async (req, res) => {
  try {
      const tasks = await Task.find({ assignedTo: req.user.id }).select('title description priority status');
      res.json(tasks);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, status, priority } = req.body; 

    const task = new Task({
        title,
        description,
        status,
        priority,
        assignedTo: req.user.id
    });

    try {
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, priority, status } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, priority, status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
