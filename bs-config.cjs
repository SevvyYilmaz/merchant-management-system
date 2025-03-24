const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');

module.exports = {
  port: 3001,
  server: {
    baseDir: 'frontend',
    middleware: [
      history(),
      createProxyMiddleware('/api', {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      })
    ]
  }
};
