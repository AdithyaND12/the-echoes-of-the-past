# The Echoes of the Past - Audio Memory Game

A futuristic, sci-fi-themed web application for event-based puzzle competitions.

## Features
- **Cyberpunk Terminal UI**: Immersive sci-fi experience with CRT effects and glowing aesthetics.
- **Audio Identification**: Participants listen to nostalgic clips and decrypt memory fragments.
- **Dynamic Hint System**: Unlocks hints based on failed attempts (Level 1 at 2 fails, Level 2 at 4 fails).
- **Admin Dashboard**: Manage puzzles, track team progress, and configure game settings.
- **Leaderboard**: Real-time rankings based on completion and speed.
- **Completion Codes**: Securely generated codes for proof of mission success.

## Tech Stack
- **Frontend**: Next.js 14+, Tailwind CSS v4, Framer Motion.
- **Backend**: Next.js API Routes, MongoDB (Mongoose).
- **Audio**: Howler.js for precise control.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_PASSWORD=your_admin_panel_password
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Assets
- Place background sound effects in `public/sounds/`:
  - `beep.mp3`, `success.mp3`, `error.mp3`, `unlock.mp3`
- Upload your puzzle audio files to the `public/uploads/` directory or use external URLs in the Admin Panel.

### 4. Run Development Server
```bash
npm run dev
```

## Admin Access
- URL: `/admin/login`
- Use the `ADMIN_PASSWORD` defined in your environment variables.
- Features: Add/Edit/Delete puzzles, view active teams, and monitor stats.

## Gameplay Flow
1. **Join**: Teams enter their Name and a unique Access ID.
2. **Solve**: Listen to the audio and type the identification.
3. **Hints**: If stuck, hints appear after 2 and 4 failed attempts.
4. **Win**: Complete all nodes to receive the Unique Completion Hash.
