const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Services
const openaiService = require('../services/openaiService');
const replicateService = require('../services/replicateService');
const supabaseService = require('../services/supabaseService');

// File upload setup
fs.ensureDirSync('uploads');
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const { supabase } = require('../config/database');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Auth failed' });
  }
};

// Main dream processing endpoint
router.post('/process-dream', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { dreamText, title } = req.body;
    const files = req.files || [];
    
    if (!dreamText?.trim() && files.length === 0) {
      return res.status(400).json({ error: 'Dream text or images required' });
    }

    // Process dream asynchronously
    processDreamAsync(req.user.id, dreamText?.trim(), title, files);
    
    res.json({ message: 'Dream processing started', status: 'processing' });
  } catch (error) {
    console.error('Process dream error:', error);
    res.status(500).json({ error: 'Failed to process dream' });
  }
});

// Get user projects
router.get('/projects', auth, async (req, res) => {
  try {
    const result = await supabaseService.getUserProjects(req.user.id);
    res.json({ projects: result.projects || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// API info
router.get('/', (req, res) => {
  res.json({ message: 'Vision Board API v1.0' });
});

// Async dream processing
async function processDreamAsync(userId, dreamText, title, files) {
  try {
    let imageDescriptions = [];
    
    // Analyze uploaded images
    for (const file of files) {
      const imageBuffer = fs.readFileSync(file.path);
      const analysis = await openaiService.analyzeImage(imageBuffer);
      if (analysis.success) {
        imageDescriptions.push(analysis.description);
      }
    }

    // Generate story
    const storyResult = await openaiService.generateStory(dreamText, imageDescriptions.join('. '));
    if (!storyResult.success) throw new Error('Story generation failed');

    // Generate animation
    let animationUrl = null;
    if (files.length > 0) {
      const imageUrl = `http://localhost:5001/uploads/${files[0].filename}`;
      const animationResult = await replicateService.generateVideoFromImage(imageUrl, 3);
      if (animationResult.success) {
        animationUrl = animationResult.videoUrl;
      }
    } else if (dreamText) {
      const animationResult = await replicateService.generateAnimationFromText(dreamText, 3);
      if (animationResult.success) {
        animationUrl = animationResult.animationUrl;
      }
    }

    // Generate audio
    let audioUrl = null;
    const audioResult = await openaiService.generateTTS(storyResult.story);
    if (audioResult.success) {
      const audioFile = `${userId}-${uuidv4()}.mp3`;
      fs.writeFileSync(`uploads/${audioFile}`, audioResult.audioBuffer);
      audioUrl = `http://localhost:5001/uploads/${audioFile}`;
    }

    // Save to database
    await supabaseService.saveProject({
      userId,
      title: title || 'Untitled Dream',
      content: dreamText || '',
      story: storyResult.story,
      animationUrl,
      audioUrl,
      type: 'dream',
      status: 'completed'
    });

    console.log(`Dream processed for user ${userId}`);
  } catch (error) {
    console.error('Dream processing error:', error);
  }
}

module.exports = router; 