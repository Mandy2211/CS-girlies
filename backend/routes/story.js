const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const openaiService = require('../services/openaiService');
const fileHandler = require('../utils/fileHandler');
const ResponseHandler = require('../utils/responseHandler');

// Generate story from text
router.post('/generate', authenticateUser, async (req, res) => {
  try {
    const { dreamText } = req.body;
    
    if (!dreamText || !dreamText.trim()) {
      return ResponseHandler.validationError(res, {
        dreamText: 'Dream text is required'
      });
    }

    const result = await openaiService.generateStory(dreamText.trim());
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, {
      story: result.story,
      usage: result.usage
    }, 'Story generated successfully');

  } catch (error) {
    console.error('Story generation error:', error);
    return ResponseHandler.error(res, 'Failed to generate story', 500, error);
  }
});

// Generate story from image
router.post('/generate-from-image', authenticateUser, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return ResponseHandler.validationError(res, {
        image: 'Image file is required'
      });
    }

    // Save uploaded file
    const fileResult = await fileHandler.saveFile(req.file, req.user.id);
    if (!fileResult.success) {
      return ResponseHandler.error(res, fileResult.error, 500);
    }

    // Analyze image with OpenAI
    const imageBuffer = await require('fs').readFileSync(fileResult.filePath);
    const analysisResult = await openaiService.analyzeImage(imageBuffer);
    
    if (!analysisResult.success) {
      // Clean up file
      await fileHandler.deleteFile(fileResult.filePath);
      return ResponseHandler.error(res, analysisResult.error, 500);
    }

    // Generate story from image description
    const storyResult = await openaiService.generateStory('', analysisResult.description);
    
    if (!storyResult.success) {
      // Clean up file
      await fileHandler.deleteFile(fileResult.filePath);
      return ResponseHandler.error(res, storyResult.error, 500);
    }

    return ResponseHandler.success(res, {
      story: storyResult.story,
      imageDescription: analysisResult.description,
      imageUrl: fileHandler.getFileUrl(fileResult.filename),
      usage: storyResult.usage
    }, 'Story generated from image successfully');

  } catch (error) {
    console.error('Image story generation error:', error);
    return ResponseHandler.error(res, 'Failed to generate story from image', 500, error);
  }
});

// Generate TTS audio from story
router.post('/generate-audio', authenticateUser, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return ResponseHandler.validationError(res, {
        text: 'Text is required for audio generation'
      });
    }

    const result = await openaiService.generateTTS(text.trim());
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }

    // Save audio file
    const audioResult = await fileHandler.saveAudio(
      result.audioBuffer, 
      req.user.id, 
      result.format
    );

    if (!audioResult.success) {
      return ResponseHandler.error(res, audioResult.error, 500);
    }

    return ResponseHandler.success(res, {
      audioUrl: fileHandler.getFileUrl(audioResult.filename),
      format: result.format
    }, 'Audio generated successfully');

  } catch (error) {
    console.error('Audio generation error:', error);
    return ResponseHandler.error(res, 'Failed to generate audio', 500, error);
  }
});

module.exports = router; 