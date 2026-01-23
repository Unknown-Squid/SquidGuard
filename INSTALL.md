# Quick Installation Guide

## Method 1: Clone and Use Directly

1. Clone the repository:
   ```bash
   git clone https://github.com/Unknown-Squid/SquidGuard.git
   cd SquidGuard
   npm install
   ```

2. Use in your Express app:
   ```javascript
   const express = require('express');
   const squidGuard = require('./SquidGuard/squidguard');
   
   const app = express();
   squidGuard(app);
   
   app.listen(3000);
   ```

## Method 2: Copy Files to Your Project

1. Clone or download the repo
2. Copy these files to your project:
   - `squidguard.js`
   - `dashboard.html`
3. Install Express (if not already installed):
   ```bash
   npm install express
   ```
4. Use it:
   ```javascript
   const squidGuard = require('./squidguard');
   squidGuard(app);
   ```

## Method 3: Git Submodule (For Git Projects)

```bash
git submodule add https://github.com/Unknown-Squid/SquidGuard.git
```

Then use:
```javascript
const squidGuard = require('./SquidGuard/squidguard');
squidGuard(app);
```

That's it! Visit `/dashboard` to see your monitoring dashboard.
