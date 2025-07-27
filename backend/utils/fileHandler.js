const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/services');
const axios = require('axios');

class FileHandler {
  // Save uploaded file
  async saveFile(file, userId) {
    try {
      const filename = `${userId}-${uuidv4()}-${file.originalname}`;
      const filePath = path.join(config.fileUpload.uploadDir, filename);
      
      await fs.move(file.path, filePath);
      
      return {
        success: true,
        filename: filename,
        filePath: filePath,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      };
    } catch (error) {
      console.error('File save error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete file
  async deleteFile(filePath) {
    try {
      await fs.remove(filePath);
      return { success: true };
    } catch (error) {
      console.error('File delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Save audio file
  async saveAudio(audioBuffer, userId, format = 'mp3') {
    try {
      const filename = `${userId}-${uuidv4()}.${format}`;
      const filePath = path.join(config.fileUpload.uploadDir, filename);
      
      await fs.writeFile(filePath, audioBuffer);
      
      return {
        success: true,
        filename: filename,
        filePath: filePath,
        format: format
      };
    } catch (error) {
      console.error('Audio save error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get file URL for external access
  getFileUrl(filename) {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${filename}`;
  }

  // Validate file type
  validateFileType(mimeType) {
    return config.fileUpload.allowedTypes.includes(mimeType);
  }

  // Validate file size
  validateFileSize(fileSize) {
    return fileSize <= config.fileUpload.maxSize;
  }

  // Clean up temporary files
  async cleanupTempFiles(filePaths) {
    try {
      for (const filePath of filePaths) {
        if (filePath && await fs.pathExists(filePath)) {
          await fs.remove(filePath);
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Cleanup error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create directory if it doesn't exist
  async ensureDirectory(dirPath) {
    try {
      await fs.ensureDir(dirPath);
      return { success: true };
    } catch (error) {
      console.error('Directory creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Download a file from a URL and save it locally
  async downloadFileFromUrl(url, userId, ext = 'mp4') {
    try {
      const filename = `${userId}-${uuidv4()}.${ext}`;
      const filePath = path.join(config.fileUpload.uploadDir, filename);
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
      });
      await new Promise((resolve, reject) => {
        const stream = response.data.pipe(fs.createWriteStream(filePath));
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
      return {
        success: true,
        filename,
        filePath,
        ext
      };
    } catch (error) {
      console.error('File download error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new FileHandler(); 