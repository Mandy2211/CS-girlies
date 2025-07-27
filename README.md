# Vision Board

Turn your dreams into animated stories with AI.

## Features

- **Dream Input**: Describe your dreams with text or upload images
- **AI Story Generation**: OpenAI creates magical stories from your input
- **Animation Creation**: Replicate AI generates animations from text/images
- **Audio Narration**: Text-to-speech brings stories to life
- **Project Gallery**: View and manage all your created dreams

## Quick Start

1. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd vision-board && npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both `backend/` and `vision-board/`
   - Add your API keys (OpenAI, Replicate, Supabase)

3. **Start the servers:**
   ```bash
   # Backend (port 5001)
   cd backend && npm start
   
   # Frontend (port 3000)
   cd vision-board && npm start
   ```

4. **Open your browser** to `http://localhost:3000`

## Tech Stack

- **Frontend**: React, Tailwind CSS, Supabase Auth
- **Backend**: Node.js, Express, OpenAI API, Replicate AI
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Local uploads directory

## API Endpoints

- `POST /api/process-dream` - Process dream (text + images)
- `GET /api/projects` - Get user's projects
- `GET /health` - Health check

## Environment Variables

### Backend (.env)
```
PORT=5001
OPENAI_API_KEY=your_key
REPLICATE_API_TOKEN=your_token
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_ANON_KEY=your_key
REACT_APP_API_URL=http://localhost:5001/api
``` 
