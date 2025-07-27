const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const replicateService = require('../services/replicateService');
const fileHandler = require('../utils/fileHandler');
const ResponseHandler = require('../utils/responseHandler');

// Generate animation from text prompt
router.post('/generate-from-text', authenticateUser, async (req, res) => {
  try {
    const { prompt, duration = 3 } = req.body;
    
    if (!prompt || !prompt.trim()) {
      return ResponseHandler.validationError(res, {
        prompt: 'Animation prompt is required'
      });
    }

    const result = await replicateService.generateAnimationFromText(prompt.trim(), duration);
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, {
      animationUrl: result.animationUrl,
      duration: result.duration
    }, 'Animation generated successfully');

  } catch (error) {
    console.error('Animation generation error:', error);
    return ResponseHandler.error(res, 'Failed to generate animation', 500, error);
  }
});

// Generate video from image
router.post('/generate-from-image', authenticateUser, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return ResponseHandler.validationError(res, {
        image: 'Image file is required'
      });
    }

    const { duration = 3 } = req.body;

    // Save uploaded file
    const fileResult = await fileHandler.saveFile(req.file, req.user.id);
    if (!fileResult.success) {
      return ResponseHandler.error(res, fileResult.error, 500);
    }

    // Get public URL for the image
    const imageUrl = fileHandler.getFileUrl(fileResult.filename);

    // Generate video from image
    const result = await replicateService.generateVideoFromImage(imageUrl, duration);
    
    if (!result.success) {
      // Clean up file
      await fileHandler.deleteFile(fileResult.filePath);
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, {
      videoUrl: result.videoUrl,
      imageUrl: imageUrl,
      duration: result.duration
    }, 'Video generated from image successfully');

  } catch (error) {
    console.error('Image video generation error:', error);
    return ResponseHandler.error(res, 'Failed to generate video from image', 500, error);
  }
});

// Generate animation from image and text combination
router.post('/generate-combined', authenticateUser, uploadSingle, async (req, res) => {
  try {
    const { prompt, duration = 3 } = req.body;
    
    if (!req.file && (!prompt || !prompt.trim())) {
      return ResponseHandler.validationError(res, {
        image: 'Either image file or prompt is required',
        prompt: 'Either image file or prompt is required'
      });
    }

    let imageUrl = null;
    let filePath = null;

    // Handle image upload if provided
    if (req.file) {
      const fileResult = await fileHandler.saveFile(req.file, req.user.id);
      if (!fileResult.success) {
        return ResponseHandler.error(res, fileResult.error, 500);
      }
      imageUrl = fileHandler.getFileUrl(fileResult.filename);
      filePath = fileResult.filePath;
    }

    // Generate animation
    const result = await replicateService.generateAnimationFromImageAndText(
      imageUrl, 
      prompt?.trim() || '', 
      duration
    );
    
    if (!result.success) {
      // Clean up file if it was uploaded
      if (filePath) {
        await fileHandler.deleteFile(filePath);
      }
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, {
      animationUrl: result.animationUrl || result.videoUrl,
      imageUrl: imageUrl,
      duration: result.duration
    }, 'Animation generated successfully');

  } catch (error) {
    console.error('Combined animation generation error:', error);
    return ResponseHandler.error(res, 'Failed to generate animation', 500, error);
  }
});

// Check animation generation status
router.get('/status/:predictionId', authenticateUser, async (req, res) => {
  try {
    const { predictionId } = req.params;
    
    if (!predictionId) {
      return ResponseHandler.validationError(res, {
        predictionId: 'Prediction ID is required'
      });
    }

    const result = await replicateService.getPredictionStatus(predictionId);
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, {
      status: result.status,
      output: result.output,
      error: result.error
    }, 'Status retrieved successfully');

  } catch (error) {
    console.error('Status check error:', error);
    return ResponseHandler.error(res, 'Failed to check status', 500, error);
  }
});

module.exports = router; 