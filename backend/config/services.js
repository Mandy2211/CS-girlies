module.exports = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7
  },
  
  replicate: {
    apiToken: process.env.REPLICATE_API_TOKEN,
    animationModel: 'anotherjesse/animagine-xl-3.1:bfb3f62a8c23e24a34cede7ab7d9736d4121143d87f5c110582e9ac0a5abc19e',
    imageToVideoModel: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438'
  },
  
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  },
  
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg').split(','),
    uploadDir: 'uploads'
  },
  
  tts: {
    provider: 'openai', // or 'elevenlabs'
    voice: 'alloy',
    model: 'tts-1'
  }
}; 