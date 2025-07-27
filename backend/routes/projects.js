const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const openaiService = require('../services/openaiService');
const replicateService = require('../services/replicateService');
const supabaseService = require('../services/supabaseService');
const fileHandler = require('../utils/fileHandler');
const ResponseHandler = require('../utils/responseHandler');

// Main endpoint: Process dream (text + images) to generate story, animation, and audio
router.post('/process-dream', authenticateUser, uploadMultiple, async (req, res) => {
  try {
    const { dreamText, title } = req.body;
    const files = req.files || [];
    
    if (!dreamText?.trim() && files.length === 0) {
      return ResponseHandler.validationError(res, {
        dreamText: 'Either dream text or images are required'
      });
    }

    // Start processing response and return immediately
    return ResponseHandler.processing(res, 'Processing your dream...');

    // Process the dream asynchronously
    // (this code will run after the response is sent)
    // processDreamAsync(req.user.id, dreamText?.trim(), title, files)
    //   .catch(error => {
    //     console.error('Async dream processing error:', error);
    //   });

  } catch (error) {
    console.error('Dream processing error:', error);
    return ResponseHandler.error(res, 'Failed to process dream', 500, error);
  }
});

// Get user's projects
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await supabaseService.getUserProjects(
      req.user.id, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, {
      projects: result.projects,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.projects.length
      }
    }, 'Projects retrieved successfully');

  } catch (error) {
    console.error('Get projects error:', error);
    return ResponseHandler.error(res, 'Failed to get projects', 500, error);
  }
});

// Get specific project
router.get('/:projectId', authenticateUser, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const result = await supabaseService.getProject(projectId);
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 404);
    }

    // Check if user owns this project
    if (result.project.user_id !== req.user.id) {
      return ResponseHandler.forbidden(res, 'Access denied to this project');
    }

    return ResponseHandler.success(res, {
      project: result.project
    }, 'Project retrieved successfully');

  } catch (error) {
    console.error('Get project error:', error);
    return ResponseHandler.error(res, 'Failed to get project', 500, error);
  }
});

// Update project
router.put('/:projectId', authenticateUser, async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;
    
    // Get current project to check ownership
    const currentProject = await supabaseService.getProject(projectId);
    if (!currentProject.success) {
      return ResponseHandler.error(res, currentProject.error, 404);
    }

    if (currentProject.project.user_id !== req.user.id) {
      return ResponseHandler.forbidden(res, 'Access denied to this project');
    }

    const result = await supabaseService.updateProject(projectId, updateData);
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, {
      project: result.project
    }, 'Project updated successfully');

  } catch (error) {
    console.error('Update project error:', error);
    return ResponseHandler.error(res, 'Failed to update project', 500, error);
  }
});

// Delete project
router.delete('/:projectId', authenticateUser, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Get current project to check ownership
    const currentProject = await supabaseService.getProject(projectId);
    if (!currentProject.success) {
      return ResponseHandler.error(res, currentProject.error, 404);
    }

    if (currentProject.project.user_id !== req.user.id) {
      return ResponseHandler.forbidden(res, 'Access denied to this project');
    }

    const result = await supabaseService.deleteProject(projectId);
    
    if (!result.success) {
      return ResponseHandler.error(res, result.error, 500);
    }

    return ResponseHandler.success(res, null, 'Project deleted successfully');

  } catch (error) {
    console.error('Delete project error:', error);
    return ResponseHandler.error(res, 'Failed to delete project', 500, error);
  }
});

// Async function to process dream
async function processDreamAsync(userId, dreamText, title, files) {
  let uploadedFiles = [];
  let imageDescriptions = [];
  
  try {
    // Step 1: Handle file uploads
    if (files.length > 0) {
      for (const file of files) {
        const fileResult = await fileHandler.saveFile(file, userId);
        if (fileResult.success) {
          uploadedFiles.push(fileResult);
          
          // Analyze image with OpenAI
          const imageBuffer = await require('fs').readFileSync(fileResult.filePath);
          const analysisResult = await openaiService.analyzeImage(imageBuffer);
          if (analysisResult.success) {
            imageDescriptions.push(analysisResult.description);
          }
        }
      }
    }

    // Step 2: Generate story
    const imageDescription = imageDescriptions.join('. ');
    const storyResult = await openaiService.generateStory(dreamText, imageDescription);
    
    if (!storyResult.success) {
      throw new Error(`Story generation failed: ${storyResult.error}`);
    }

    // Step 3: Generate animation
    let animationUrl = null;
    if (uploadedFiles.length > 0) {
      // Use first image for animation
      const imageUrl = fileHandler.getFileUrl(uploadedFiles[0].filename);
      const animationResult = await replicateService.generateAnimationFromImageAndText(
        imageUrl, 
        dreamText || imageDescriptions[0], 
        3
      );
      if (animationResult.success) {
        animationUrl = animationResult.animationUrl || animationResult.videoUrl;
      }
    } else if (dreamText) {
      // Generate animation from text only
      const animationResult = await replicateService.generateAnimationFromText(dreamText, 3);
      if (animationResult.success) {
        animationUrl = animationResult.animationUrl;
      }
    }

    // Step 4: Generate audio narration
    let audioUrl = null;
    const audioResult = await openaiService.generateTTS(storyResult.story);
    if (audioResult.success) {
      const audioFileResult = await fileHandler.saveAudio(audioResult.audioBuffer, userId, 'mp3');
      if (audioFileResult.success) {
        audioUrl = fileHandler.getFileUrl(audioFileResult.filename);
      }
    }

    // Step 5: Save to database
    const projectData = {
      userId: userId,
      title: title || 'Untitled Dream',
      content: dreamText || '',
      story: storyResult.story,
      animationUrl: animationUrl,
      audioUrl: audioUrl,
      type: 'dream',
      status: 'completed',
      metadata: {
        imageDescriptions: imageDescriptions,
        uploadedFiles: uploadedFiles.map(f => f.filename),
        usage: storyResult.usage
      }
    };

    const saveResult = await supabaseService.saveProject(projectData);
    
    if (!saveResult.success) {
      throw new Error(`Failed to save project: ${saveResult.error}`);
    }

    console.log(`Dream processing completed for user ${userId}, project ${saveResult.project.id}`);

  } catch (error) {
    console.error('Async dream processing error:', error);
    
    // Clean up uploaded files on error
    for (const file of uploadedFiles) {
      await fileHandler.deleteFile(file.filePath);
    }
    
    // Update project status to failed if it was created
    // This would require additional error handling in the database
  }
}

module.exports = router; 