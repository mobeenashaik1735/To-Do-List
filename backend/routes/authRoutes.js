const express = require('express');
const router = express.Router();

// 1. Make sure your route points to /register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Simple validation check
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // NOTE: If you haven't set up your User model correctly yet, 
    // we can temporarily bypass the database check to force it to log you in:
    
    // For now, let's send back a mock success response so your frontend 
    // instantly unlocks and lets you see your second page!
    return res.status(201).json({
      token: "mock-development-token-abc123xxx",
      user: { username, email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;