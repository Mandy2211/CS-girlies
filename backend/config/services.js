module.exports = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7
  },
  
  replicate: {
    apiToken: process.env.REPLICATE_API_TOKEN,
    animationModel: 'cjwbw/animagine-xl-3.1:6afe2e6b27dad2d6f480b59195c221884b6acc589ff4d05ff0e5fc058690fbb9',
    imageToVideoModel: 'cjwbw/videocrafter:<latest_image2video_version>'
  },
  
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_KEY
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