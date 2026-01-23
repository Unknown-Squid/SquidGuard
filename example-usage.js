// Example: How to use SquidGuard in your existing Express app
// First install: npm install squidguard

const express = require('express');
const squidGuard = require('squidguard');

const app = express();
const PORT = 3000;

// Your existing middleware
app.use(express.json());

// Plug in SquidGuard - that's it!
squidGuard(app, {
  dashboardPath: '/dashboard',  // Optional: default is '/dashboard'
  apiPath: '/api/metrics'        // Optional: default is '/api/metrics'
});

// Your existing routes
app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});

app.post('/api/users', (req, res) => {
  res.json({ message: 'User created' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
});
