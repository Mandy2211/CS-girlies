# 🌈 DreamCraft: Turn Imagination into Interactive Media

**Track:** AI/ML • Education • ArtTech  
**Demo:** _[Insert deployed link here]_  
**Backend:** Render/Railway • **Frontend:** Vercel

DreamCraft is a no-code platform that transforms anyone’s creativity—drawings, dreams, vision boards, and even to-do lists—into magical, animated stories using generative AI. It empowers children, creatives, and everyday users to bring their imagination to life with the help of modern AI tools.

---

## ✨ Features

- **🖌️ Upload Input**: Drawings or written dreams, journal entries, goals, and to-dos
- **🌀 Sketch to Animation**: Convert user-uploaded images into short animated clips using AI
- **📖 AI Story Mode**: Generate interactive stories with narration based on user input
- **🧠 Creative Suggestions**: Inspire story ideas through AI-enhanced prompts
- **🖼️ Vision Board Builder**: Design digital vision boards with AI-generated media
- **📓 Dream Journal**: Log entries that can evolve into visual storytelling
- **📂 Project Gallery**: Save and view previous creations
- **🔐 Login & Persistence**: User authentication and long-term media storage
- **🐣 Delightful UI**: Whimsical visuals, animations, and loading screens


---

## 👥 Team Responsibilities

| Team Member | Responsibility |
|-------------|----------------|
| **Sonma**   | Page routing (React Router), Input UI (chat + drawing) |
| **Mandy**   | Auth, database config, and Supabase media storage |
| **Phani**   | Backend API integration, Dream Journal & Vision Board UI |
| **Jenn**    | AI story generation using OpenAI + sketch-to-animation flow |
| **Stuti**   | Gallery view, interactive preview, UX polish & loading animations |

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, Supabase Auth
- **Backend**: Node.js, Express, OpenAI API, Replicate AI
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Local uploads directory

---

## 🚀 Future Plans

- 🎤 **Voice-to-Text Input**: Allow younger users to speak instead of type
- 🎭 **Live Character Movement**: Add AI-powered animations in real-time
- 🎶 **Sound Effects**: Enhance stories with AI-generated music
- 🧪 **Classroom Pilots**: Gather feedback from teachers, parents, and kids

---

## 🧪 Getting Started

```bash
# Clone the repository
git clone -b branch1 https://github.com/yourteam/dreamcraft.git
cd dreamcraft

# Install dependencies
npm install

# Start the frontend (Vercel will auto-deploy otherwise)
npm run dev

# Backend (if separated into /server)
cd server
npm install
npm start
   ```

## API Endpoints

- `POST /api/process-dream` - Process dream (text + images)
- `GET /api/projects` - Get user's projects
- `GET /health` - Health check
