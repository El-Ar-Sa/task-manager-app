const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your-secret-key-here-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const users = [];
const tasks = [];
let userId = 1;
let taskId = 1;

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = {
    id: userId++,
    fullName,
    email,
    password: hashedPassword
  };
  users.push(user);

  const token = jwt.sign({ userId: user.id }, SECRET_KEY);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: user.id, fullName: user.fullName, email: user.email }
  });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY);

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, fullName: user.fullName, email: user.email }
  });
});

// ============ TASK ROUTES ============

// Get all tasks
app.get('/api/tasks', verifyToken, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.userId);
  res.json(userTasks);
});

// Create task
app.post('/api/tasks', verifyToken, (req, res) => {
  const { text, category, dueDate } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Task text is required' });
  }

  const task = {
    id: taskId++,
    userId: req.userId,
    text,
    category: category || 'Personal',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(task);
  res.status(201).json(task);
});

// Update task
app.put('/api/tasks/:id', verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const { text, completed, category, dueDate } = req.body;
  if (text !== undefined) tasks[taskIndex].text = text;
  if (completed !== undefined) tasks[taskIndex].completed = completed;
  if (category !== undefined) tasks[taskIndex].category = category;
  if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;

  res.json(tasks[taskIndex]);
});

// Delete task
app.delete('/api/tasks/:id', verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Database ready with ${users.length} users`);
});