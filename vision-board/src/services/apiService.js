const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from Supabase
  getAuthToken() {
    const session = JSON.parse(localStorage.getItem('supabase.auth.token'));
    return session?.currentSession?.access_token;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // File upload request
  async uploadFile(endpoint, formData) {
    const token = this.getAuthToken();
    
    const config = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Story Generation
  async generateStory(dreamText) {
    return this.request('/story/generate', {
      method: 'POST',
      body: JSON.stringify({ dreamText }),
    });
  }

  async generateStoryFromImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return this.uploadFile('/story/generate-from-image', formData);
  }

  async generateAudio(text) {
    return this.request('/story/generate-audio', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Animation Generation
  async generateAnimationFromText(prompt, duration = 3) {
    return this.request('/animation/generate-from-text', {
      method: 'POST',
      body: JSON.stringify({ prompt, duration }),
    });
  }

  async generateAnimationFromImage(imageFile, duration = 3) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('duration', duration);
    
    return this.uploadFile('/animation/generate-from-image', formData);
  }

  async generateCombinedAnimation(imageFile, prompt, duration = 3) {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (prompt) {
      formData.append('prompt', prompt);
    }
    formData.append('duration', duration);
    
    return this.uploadFile('/animation/generate-combined', formData);
  }

  async checkAnimationStatus(predictionId) {
    return this.request(`/animation/status/${predictionId}`);
  }

  // Project Management
  async processDream(dreamText, title, files = []) {
    const formData = new FormData();
    
    if (dreamText) {
      formData.append('dreamText', dreamText);
    }
    if (title) {
      formData.append('title', title);
    }
    
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    
    return this.uploadFile('/projects/process-dream', formData);
  }

  async getProjects(limit = 50, offset = 0) {
    return this.request(`/projects?limit=${limit}&offset=${offset}`);
  }

  async getProject(projectId) {
    return this.request(`/projects/${projectId}`);
  }

  async updateProject(projectId, updateData) {
    return this.request(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Dream-specific methods
  async saveDream(dreamData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(dreamData),
    });
  }

  async getDreams(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return this.request(`/projects?${queryParams.toString()}`);
  }

  async searchDreams(query) {
    return this.request(`/projects/search?q=${encodeURIComponent(query)}`);
  }

  async deleteProject(projectId) {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default new ApiService(); 