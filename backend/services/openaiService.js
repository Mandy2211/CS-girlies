const OpenAI = require('openai');
const config = require('../config/services');

const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

class OpenAIService {
  constructor() {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }

  // Generate story from user input
  async generateStory(dreamText, imageDescription = '') {
    try {
      const prompt = this.buildStoryPrompt(dreamText, imageDescription);
      
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative storyteller who transforms dreams and ideas into engaging, magical stories. Write in a warm, imaginative tone that captures the wonder and emotion of the user\'s vision.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature
      });

      return {
        success: true,
        story: completion.choices[0].message.content.trim(),
        usage: completion.usage
      };
    } catch (error) {
      console.error('OpenAI story generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate story'
      };
    }
  }

  // Generate TTS audio from text
  async generateTTS(text) {
    try {
      const mp3 = await openai.audio.speech.create({
        model: config.tts.model,
        voice: config.tts.voice,
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      
      return {
        success: true,
        audioBuffer: buffer,
        format: 'mp3'
      };
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate audio'
      };
    }
  }

  // Build story prompt based on input
  buildStoryPrompt(dreamText, imageDescription) {
    let prompt = `Transform this dream or idea into a magical story:\n\n"${dreamText}"\n\n`;
    
    if (imageDescription) {
      prompt += `The user also uploaded an image described as: "${imageDescription}"\n\n`;
    }
    
    prompt += `Please create a captivating story that:
- Captures the essence and emotion of the dream
- Is 2-3 paragraphs long
- Has a magical, dreamlike quality
- Includes vivid descriptions and imagery
- Has a satisfying narrative arc
- Is suitable for all ages

Write the story in a warm, engaging tone that brings the dream to life.`;

    return prompt;
  }

  // Analyze image and generate description
  async analyzeImage(imageBuffer) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this image in detail. Focus on the visual elements, colors, style, and any objects or scenes depicted. Be descriptive and imaginative.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      });

      return {
        success: true,
        description: response.choices[0].message.content.trim()
      };
    } catch (error) {
      console.error('OpenAI image analysis error:', error);
      return {
        success: false,
        error: error.message || 'Failed to analyze image'
      };
    }
  }
}

module.exports = new OpenAIService(); 