const express = require('express');
const router = express.Router();

// Import route modules
const storyRoutes = require('./story');
const animationRoutes = require('./animation');
const projectRoutes = require('./projects');

// API version and info
router.get('/', (req, res) => {
  res.json({
    message: 'v1.0',
    endpoints: {
      story: '/api/story',
      animation: '/api/animation',
      projects: '/api/projects'
    },
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/story', storyRoutes);
router.use('/animation', animationRoutes);
router.use('/projects', projectRoutes);

module.exports = router; 