# Vision Board - Complete Installation Guide

This guide will help you set up the Vision Board application with both frontend and backend components.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## Required API Keys

You'll need to obtain the following API keys:

1. **OpenAI API Key** - [Get it here](https://platform.openai.com/api-keys)
2. **Replicate API Token** - [Get it here](https://replicate.com/account/api-tokens)
3. **Supabase Project** - [Create one here](https://supabase.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd CS-girlies
```

## Step 2: Install Frontend Dependencies

```bash
cd vision-board
npm install
```

## Step 3: Install Backend Dependencies

```bash
cd ../backend
npm install
```

## Step 4: Set Up Environment Variables

### Frontend Environment (.env in vision-board directory)

Create a `.env` file in the `vision-board` directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend Environment (.env in backend directory)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Replicate Configuration
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Step 5: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL commands:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  content TEXT,
  story TEXT,
  animation_url TEXT,
  audio_url TEXT,
  type TEXT DEFAULT 'dream',
  status TEXT DEFAULT 'completed',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table (optional)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  original_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for files
CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid() = user_id);
```

## Step 6: Start the Backend Server

```bash
cd backend
npm start
```

The backend server should start on `http://localhost:5000`

## Step 7: Start the Frontend Application

In a new terminal:

```bash
cd vision-board
npm start
```

The frontend application should start on `http://localhost:3000`

## Step 8: Test the Application

1. Open your browser and go to `http://localhost:3000`
2. Sign up for a new account or sign in
3. Try creating a dream project with text and/or images
4. Check that the backend processes the request and generates content

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure the `FRONTEND_URL` in your backend `.env` matches your frontend URL
   - Check that both servers are running

2. **API Key Errors**
   - Verify all API keys are correctly set in the `.env` files
   - Check that your OpenAI and Replicate accounts have sufficient credits

3. **Database Connection Issues**
   - Verify your Supabase URL and keys are correct
   - Make sure the database tables are created properly

4. **File Upload Issues**
   - Check that the `uploads` directory exists in the backend
   - Verify file permissions

5. **Node.js Version Issues**
   - Make sure you're using Node.js v16 or higher
   - Try clearing npm cache: `npm cache clean --force`

### Development Mode

For development, you can run the backend with nodemon for auto-restart:

```bash
cd backend
npm run dev
```

### Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend `.env`
2. Configure proper CORS origins
3. Set up cloud storage for file uploads
4. Configure environment variables on your hosting platform
5. Set up proper SSL certificates

## API Endpoints

Once running, you can test the API endpoints:

- Health check: `GET http://localhost:5000/health`
- API info: `GET http://localhost:5000/api`
- Process dream: `POST http://localhost:5000/api/projects/process-dream`

## Support

If you encounter any issues:

1. Check the console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that all required services (OpenAI, Replicate, Supabase) are accessible

## Next Steps

After successful installation:

1. Customize the UI and branding
2. Add more AI models and features
3. Implement user management features
4. Add analytics and monitoring
5. Scale the application for production use 