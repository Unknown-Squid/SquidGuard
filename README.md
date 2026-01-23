# SQUIDGUARD

SquidGuard is a lightweight Node.js monitoring tool that tracks all incoming HTTP requests, 
measuring latency, request counts, and response times. Ideal for developers who want real-time 
insight into their server performance.

## Features

- **Real-time Dashboard**: Beautiful web-based dashboard at `/dashboard`
- **Request Monitoring**: Tracks every incoming HTTP request
- **Performance Metrics**: Measures request latency and response time
- **Status Code Tracking**: Monitors HTTP status codes distribution
- **Endpoint Analytics**: Tracks performance per endpoint
- **Error Tracking**: Captures and displays errors (4xx, 5xx)
- **Auto-refresh**: Dashboard updates every 2 seconds

## Installation

### Install from npm (for use in your projects)

```bash
npm install squidguard
```

### Install locally (for development)

```bash
npm install
```

## Usage

### Plug-and-Play Integration (Recommended)

Add SquidGuard to your existing Express app in just 2 lines:

```javascript
const express = require('express');
const squidGuard = require('squidguard');

const app = express();

// Plug in SquidGuard - that's it!
squidGuard(app);

// Your existing routes...
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
```

Now visit `http://localhost:3000/dashboard` to see your monitoring dashboard!

**Custom paths (optional):**
```javascript
squidGuard(app, {
  dashboardPath: '/monitor',  // Custom dashboard path
  apiPath: '/metrics'          // Custom API path
});
```

### Standalone Server

If you cloned this repo, you can run it standalone:

Start the standalone server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Access the dashboard:
```
http://localhost:5002/dashboard
```

const app = express();

// Plug in SquidGuard - that's it!
squidGuard(app);

// Your existing routes...
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
```

Now visit `http://localhost:3000/dashboard` to see your monitoring dashboard!

**Custom paths (optional):**
```javascript
squidGuard(app, {
  dashboardPath: '/monitor',  // Custom dashboard path
  apiPath: '/metrics'          // Custom API path
});
```

See `example-usage.js` for a complete example.

## API Endpoints

- `GET /` - Server info
- `GET /dashboard` - Monitoring dashboard
- `GET /api/metrics` - JSON metrics API
- `GET /api/test` - Test endpoint
- `POST /api/test` - Test POST endpoint
- `GET /api/slow` - Slow endpoint (for testing)
- `GET /api/error` - Error endpoint (for testing)
- `GET /api/notfound` - 404 endpoint (for testing)

## Dashboard Features

The dashboard displays:
- Total requests and requests per minute
- Average response time with min/max
- Server uptime
- Error rate and count
- Status code distribution
- Top endpoints by request count
- Recent requests with full details

## How It Works

SquidGuard uses Express middleware to intercept all requests and responses, tracking:
- Request method, path, and URL
- Response status codes
- Response time (duration)
- Client IP and user agent
- Timestamps

All metrics are stored in-memory and the dashboard provides real-time visualization.
