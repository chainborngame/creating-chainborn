const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:8081/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      }
    })
  );
  app.use(
    '/rest',
    proxy({
      target: 'https://ghost.chainborn.xyz/rest',
      changeOrigin: true,
      pathRewrite: {
        '^/rest': '/'
      }
    })
  );
};
