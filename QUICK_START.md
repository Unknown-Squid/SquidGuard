# Quick Start Guide

## Method 1: Copy Files (Easiest)

1. **Copy these 2 files to your project:**
   - `squidguard.js`
   - `dashboard.html`

2. **Make sure Express is installed:**
   ```bash
   npm install express
   ```

3. **Add to your Express app:**
   ```javascript
   const express = require('express');
   const squidGuard = require('./squidguard');  // Path to where you copied the file
   
   const app = express();
   
   // Your existing middleware
   app.use(express.json());
   
   // Add SquidGuard - that's it!
   squidGuard(app);
   
   // Your existing routes
   app.get('/api/users', (req, res) => {
     res.json({ users: [] });
   });
   
   app.listen(3000, () => {
     console.log('Server running on http://localhost:3000');
     console.log('Dashboard: http://localhost:3000/dashboard');
   });
   ```

4. **Done!** Visit `http://localhost:3000/dashboard` to see monitoring.

---

## Method 2: Clone as Submodule (For Git Projects)

1. **Add as git submodule:**
   ```bash
   git submodule add https://github.com/Unknown-Squid/SquidGuard.git
   ```

2. **Use in your code:**
   ```javascript
   const express = require('express');
   const squidGuard = require('./SquidGuard/squidguard');
   
   const app = express();
   squidGuard(app);
   // ... rest of your code
   ```

---

## Method 3: Clone Repository

1. **Clone to your project:**
   ```bash
   git clone https://github.com/Unknown-Squid/SquidGuard.git
   ```

2. **Use in your code:**
   ```javascript
   const squidGuard = require('./SquidGuard/squidguard');
   squidGuard(app);
   ```

---

## Custom Paths (Optional)

If you want custom dashboard/API paths:

```javascript
squidGuard(app, {
  dashboardPath: '/monitor',  // Custom dashboard path
  apiPath: '/metrics'          // Custom API path
});
```

Then visit: `http://localhost:3000/monitor`

---

## That's It!

SquidGuard automatically:
- ✅ Monitors ALL incoming requests
- ✅ Tracks response times, status codes, endpoints
- ✅ Shows real-time dashboard
- ✅ No configuration needed!

Just add `squidGuard(app)` and you're done!
