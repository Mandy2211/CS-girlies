const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { authenticateUser } = require('../middleware/auth');
const openaiService = require('../services/openaiService');
const replicateService = require('../services/replicateService');
const fileHandler = require('../utils/fileHandler');
const ResponseHandler = require('../utils/responseHandler');
const supabaseService = require('../services/supabaseService');

// Multer setup for drawing uploads
const upload = multer({
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// POST /api/ai/generate-story
router.post('/generate-story', authenticateUser, async (req, res) => {
  try {
    const { input, mode, tts } = req.body;
    if (!input || !input.trim()) {
      return ResponseHandler.validationError(res, { input: 'Input required' });
    }
    // Use the same prompt logic as story.js
    const result = await openaiService.generateStory(input.trim());
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }
    let audioUrl = null;
    if (tts) {
      const ttsResult = await openaiService.generateTTS(result.story);
      if (!ttsResult.success) {
        return ResponseHandler.error(res, ttsResult.error, 500);
      }
      // Save audio file
      const audioResult = await fileHandler.saveAudio(
        ttsResult.audioBuffer,
        req.user.id,
        ttsResult.format
      );
      if (!audioResult.success) {
        return ResponseHandler.error(res, audioResult.error, 500);
      }
      audioUrl = fileHandler.getFileUrl(audioResult.filename);
    }
    return ResponseHandler.success(res, {
      story: result.story,
      usage: result.usage,
      audioUrl
    }, 'Story generated successfully');
  } catch (err) {
    console.error('AI Integration story error:', err);
    return ResponseHandler.error(res, 'Failed to generate story', 500, err);
  }
});

// POST /api/ai/drawing-to-animation
router.post('/drawing-to-animation', authenticateUser, upload.single('drawing'), async (req, res) => {
  try {
    if (!req.file) {
      return ResponseHandler.validationError(res, { drawing: 'Drawing file required' });
    }
    // Save uploaded file locally
    const fileResult = await fileHandler.saveFile(req.file, req.user.id);
    if (!fileResult.success) {
      return ResponseHandler.error(res, fileResult.error, 500);
    }
    // Upload to Supabase Storage and get public URL
    const storagePath = `user-${req.user.id}/${fileResult.filename}`;
    const publicUrl = await supabaseService.uploadFileToSupabaseStorage(fileResult.filePath, storagePath);
    // Generate animation from public image URL
    const animationResult = await replicateService.generateAnimationFromImageAndText(
      publicUrl,
      '',
      3
    );
    // Clean up local file
    await fileHandler.deleteFile(fileResult.filePath);
    if (!animationResult.success) {
      return ResponseHandler.error(res, animationResult.error, 500);
    }
    return ResponseHandler.success(res, {
      animationUrl: animationResult.videoUrl || animationResult.animationUrl
    }, 'Animation generated successfully');
  } catch (err) {
    console.error('AI Integration animation error:', err);
    return ResponseHandler.error(res, 'Failed to generate animation', 500, err);
  }
});

module.exports = router; 