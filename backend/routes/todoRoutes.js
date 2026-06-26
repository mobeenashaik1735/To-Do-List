const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

// Get all tasks for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  const { title, priority, category, dueDate } = req.body;
  try {
    const newTodo = new Todo({ user: req.user, title, priority, category, dueDate });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Toggle complete state or modify details
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.user.toString() !== req.user) return res.status(404).json({ message: 'Not found' });

    const updated = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.user.toString() !== req.user) return res.status(404).json({ message: 'Not found' });

    await todo.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;