const Replicate = require('replicate');
const config = require('../config/services');
const fileHandler = require('../utils/fileHandler');

const replicate = new Replicate({
  auth: config.replicate.apiToken,
});

class ReplicateService {
  constructor() {
    if (!config.replicate.apiToken) {
      throw new Error('Replicate API token is required');
    }
  }

  // Generate animation from text prompt
  async generateAnimationFromText(prompt, duration = 3, userId = 'debug') {
    try {
      console.log('Starting animation generation from text:', prompt);
      
      const output = await replicate.run(
        config.replicate.animationModel,
        {
          input: {
            prompt: prompt,
            negative_prompt: "low quality, blurry, distorted, ugly, bad anatomy",
            num_frames: Math.floor(duration * 8), // 8 fps
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: 512,
            height: 512
          }
        }
      );

      console.log('Replicate animation output:', output);
      // Handle both string and array output
      let videoUrl = null;
      if (typeof output === 'string' && output.startsWith('http')) {
        videoUrl = output;
      } else if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string') {
        videoUrl = output[0];
      }
      let localPath = null;
      let localUrl = null;
      if (videoUrl) {
        const downloadResult = await fileHandler.downloadFileFromUrl(videoUrl, userId, 'mp4');
        if (downloadResult.success) {
          localPath = downloadResult.filePath;
          localUrl = fileHandler.getFileUrl(downloadResult.filename);
        }
      }

      return {
        success: true,
        animationUrl: videoUrl,
        localPath,
        localUrl,
        duration: duration
      };
    } catch (error) {
      console.error('Replicate animation generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate animation'
      };
    }
  }

  // Generate video from image
  async generateVideoFromImage(imageUrl, duration = 3, userId = 'debug') {
    try {
      console.log('Starting video generation from image');
      const output = await replicate.run(
        config.replicate.imageToVideoModel,
        {
          input: {
            input_image: imageUrl, // Correct key for most Replicate models
            video_length: '14_frames_with_svd', // Valid value for this model
            fps: 8,
            motion_bucket_id: 127,
            cond_aug: 0.02,
            decoding_t: 7
          }
        }
      );

      console.log('Replicate video output:', output);
      // Handle both string and array output
      let videoUrl = null;
      if (typeof output === 'string' && output.startsWith('http')) {
        videoUrl = output;
      } else if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string') {
        videoUrl = output[0];
      }
      let localPath = null;
      let localUrl = null;
      if (videoUrl) {
        const downloadResult = await fileHandler.downloadFileFromUrl(videoUrl, userId, 'mp4');
        if (downloadResult.success) {
          localPath = downloadResult.filePath;
          localUrl = fileHandler.getFileUrl(downloadResult.filename);
        }
      }

      return {
        success: true,
        videoUrl,
        localPath,
        localUrl,
        duration: duration
      };
    } catch (error) {
      console.error('Replicate video generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate video'
      };
    }
  }

  // Generate animation from image and text combination
  async generateAnimationFromImageAndText(imageUrl, prompt, duration = 3) {
    try {
      console.log('Starting animation generation from image and text');
      
      // First try to generate from image
      const videoResult = await this.generateVideoFromImage(imageUrl, duration);
      
      if (videoResult.success) {
        return videoResult;
      }
      
      // Fallback to text-based generation
      console.log('Falling back to text-based animation');
      return await this.generateAnimationFromText(prompt, duration);
    } catch (error) {
      console.error('Replicate combined generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate animation'
      };
    }
  }

  // Check prediction status
  async getPredictionStatus(predictionId) {
    try {
      const prediction = await replicate.predictions.get(predictionId);
      return {
        success: true,
        status: prediction.status,
        output: prediction.output,
        error: prediction.error
      };
    } catch (error) {
      console.error('Replicate prediction status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get prediction status'
      };
    }
  }
}

module.exports = new ReplicateService(); 