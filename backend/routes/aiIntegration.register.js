// Register aiIntegration router
const aiIntegrationRouter = require('./aiIntegration');
module.exports = (app) => {
  app.use('/api/ai', aiIntegrationRouter);
}; 