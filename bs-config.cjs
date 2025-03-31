const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  server: {
    baseDir: ['frontend'],
    middleware: [
      // 📦 Support AngularJS HTML5 routing
      history(),

      // 🔁 Proxy API requests to backend
      createProxyMiddleware('/api', {
        target: 'http://localhost:3005',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      })
    ],
    routes: {
      '/node_modules': 'node_modules'
    }
  },
  port: 3001,
  open: true
};
