# Troubleshooting - Dashboard Not Showing Data

## Quick Checks

### 1. Is the server running?
```bash
npm start
```
You should see:
```
SquidGuard monitoring server running on http://localhost:5002
Dashboard available at http://localhost:5002/dashboard
```

### 2. Check if API endpoint works
Open in browser: `http://localhost:5002/api/metrics`

You should see JSON data. If you see an error, the API isn't working.

### 3. Make some requests first!
**The dashboard shows zeros until you make requests!**

Try these:
- Visit: `http://localhost:5002/`
- Visit: `http://localhost:5002/api/test`
- Visit: `http://localhost:5002/api/slow`
- Visit: `http://localhost:5002/dashboard` (this request itself will be tracked!)

### 4. Check browser console
Open browser DevTools (F12) → Console tab
- Look for any red errors
- Check if API calls are failing

### 5. Verify middleware is added correctly

Your `server.js` should have:
```javascript
const squidGuard = require('./squidguard');
squidGuard(app);  // ← This must be BEFORE your routes
```

**Important:** The middleware must be added BEFORE your routes to monitor them.

### 6. Check the order in server.js

```javascript
// ✅ CORRECT ORDER:
app.use(express.json());
squidGuard(app);  // ← Add SquidGuard early
// Your routes here...
```

```javascript
// ❌ WRONG - routes before SquidGuard won't be monitored:
app.get('/api/users', ...);  // Won't be monitored
squidGuard(app);  // Too late!
```

## Common Issues

### Issue: Dashboard shows all zeros
**Solution:** Make some requests first! The dashboard only shows data from requests that have been made.

### Issue: "Failed to fetch" error
**Solution:** 
- Check if server is running
- Check if API path is correct: `http://localhost:5002/api/metrics`
- Check browser console for CORS errors

### Issue: No data after making requests
**Solution:**
- Make sure `squidGuard(app)` is called BEFORE your routes
- Restart the server
- Check browser console for errors

## Test It

1. Start server: `npm start`
2. Visit: `http://localhost:5002/api/test` (make a request)
3. Visit: `http://localhost:5002/dashboard` (see the data!)

The dashboard should now show:
- Total Requests: 1 (or more)
- Recent Requests list with your test request
