const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5002;

// Import SquidGuard
const squidGuard = require('./squidguard');

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Plug in SquidGuard - it's that easy!
squidGuard(app, {
  dashboardPath: '/dashboard',
  apiPath: '/api/metrics',
  // Only monitor requests from these front-end domains
  frontendDomains: ['localhost:3000', 'localhost:3001']  // Add your front-end domains here
});

// Serve static assets if needed
app.use('/static', express.static('static'));

// Example API routes for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'POST test endpoint', body: req.body });
});

app.get('/api/slow', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Slow endpoint', delay: 2000 });
  }, 2000);
});

app.get('/api/error', (req, res) => {
  res.status(500).json({ error: 'Test error endpoint' });
});

app.get('/api/notfound', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SquidGuard Monitoring Server',
    dashboard: `http://localhost:${PORT}/dashboard`,
    api: `http://localhost:${PORT}/api/metrics`
  });
});

app.listen(PORT, () => {
  console.log(`SquidGuard monitoring server running on http://localhost:${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}/dashboard`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`\nOptions:`);
    console.error(`  1. Kill the process using port ${PORT}:`);
    console.error(`     Windows: netstat -ano | findstr :${PORT}`);
    console.error(`     Then: taskkill /PID <PID> /F`);
    console.error(`  2. Use a different port:`);
    console.error(`     PORT=5001 npm start`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
