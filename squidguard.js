const path = require('path');

// In-memory storage for request metrics
const metrics = {
  totalRequests: 0,
  requests: [],
  statusCodes: {},
  endpoints: {},
  responseTimes: [],
  errors: [],
  startTime: Date.now()
};

// Request monitoring middleware
function squidGuardMiddleware() {
  return (req, res, next) => {
    const startTime = Date.now();
    const requestId = Date.now() + Math.random();
    
    // Override res.end to capture response data
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // Store request data
      const requestData = {
        id: requestId,
        method: req.method,
        url: req.url,
        path: req.path,
        statusCode: statusCode,
        duration: duration,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent') || 'Unknown'
      };
      
      // Update metrics
      metrics.totalRequests++;
      metrics.requests.push(requestData);
      
      // Keep only last 1000 requests in memory
      if (metrics.requests.length > 1000) {
        metrics.requests.shift();
      }
      
      // Update status code counts
      metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;
      
      // Update endpoint stats
      const endpoint = `${req.method} ${req.path}`;
      if (!metrics.endpoints[endpoint]) {
        metrics.endpoints[endpoint] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          minDuration: Infinity,
          maxDuration: 0,
          statusCodes: {}
        };
      }
      metrics.endpoints[endpoint].count++;
      metrics.endpoints[endpoint].totalDuration += duration;
      metrics.endpoints[endpoint].avgDuration = Math.round(
        metrics.endpoints[endpoint].totalDuration / metrics.endpoints[endpoint].count
      );
      metrics.endpoints[endpoint].minDuration = Math.min(
        metrics.endpoints[endpoint].minDuration,
        duration
      );
      metrics.endpoints[endpoint].maxDuration = Math.max(
        metrics.endpoints[endpoint].maxDuration,
        duration
      );
      metrics.endpoints[endpoint].statusCodes[statusCode] = 
        (metrics.endpoints[endpoint].statusCodes[statusCode] || 0) + 1;
      
      // Track response times
      metrics.responseTimes.push(duration);
      if (metrics.responseTimes.length > 1000) {
        metrics.responseTimes.shift();
      }
      
      // Track errors (4xx and 5xx)
      if (statusCode >= 400) {
        metrics.errors.push(requestData);
        if (metrics.errors.length > 100) {
          metrics.errors.shift();
        }
      }
      
      // Call original end
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
}

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// API route handler
function getMetrics() {
  const uptime = Date.now() - metrics.startTime;
  const recentRequests = metrics.requests.slice(-100).reverse();
  
  // Calculate average response time
  const avgResponseTime = metrics.responseTimes.length > 0
    ? Math.round(metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length)
    : 0;
  
  // Calculate requests per minute
  const requestsPerMinute = Math.round((metrics.totalRequests / (uptime / 60000)) * 100) / 100;
  
  return {
    totalRequests: metrics.totalRequests,
    uptime: uptime,
    uptimeFormatted: formatUptime(uptime),
    requestsPerMinute: requestsPerMinute,
    avgResponseTime: avgResponseTime,
    statusCodes: metrics.statusCodes,
    endpoints: metrics.endpoints,
    recentRequests: recentRequests,
    errors: metrics.errors.slice(-50).reverse(),
    responseTimeStats: {
      min: metrics.responseTimes.length > 0 ? Math.min(...metrics.responseTimes) : 0,
      max: metrics.responseTimes.length > 0 ? Math.max(...metrics.responseTimes) : 0,
      avg: avgResponseTime
    }
  };
}

// Setup routes for Express app
function setupRoutes(app, options = {}) {
  const dashboardPath = options.dashboardPath || '/dashboard';
  const apiPath = options.apiPath || '/api/metrics';
  
  // API endpoint to get metrics
  app.get(apiPath, (req, res) => {
    res.json(getMetrics());
  });
  
  // Dashboard route
  app.get(dashboardPath, (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  });
}

// Main function to integrate SquidGuard into an Express app
function squidGuard(app, options = {}) {
  // Add middleware
  app.use(squidGuardMiddleware());
  
  // Setup routes
  setupRoutes(app, options);
  
  return {
    middleware: squidGuardMiddleware(),
    getMetrics: getMetrics
  };
}

module.exports = squidGuard;
module.exports.middleware = squidGuardMiddleware;
module.exports.getMetrics = getMetrics;
module.exports.setupRoutes = setupRoutes;
