# BhashaBridge Frontend

AI-powered Indian language learning platform - React Frontend

## Prerequisites

- Node.js 18+

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
# .env file already configured for local backend
VITE_API_URL=http://localhost:5000/api
```

3. **Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

✅ User authentication (Register/Login)
✅ Language selection (6 Indian languages)
✅ Situation-based learning
✅ Web Speech API integration
  - Text-to-Speech for phrase pronunciation
  - Speech Recognition for user practice
✅ Real-time pronunciation feedback
✅ XP and level progression
✅ User progress dashboard
✅ Responsive design with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Web Speech API** - Speech recognition and synthesis

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── LanguageSelection.jsx
│   ├── Learning.jsx
│   └── Dashboard.jsx
├── store/           # Zustand stores
│   ├── authStore.js
│   └── learningStore.js
├── services/        # API client
│   └── api.js
├── App.jsx          # Main app with routing
└── index.css        # Global styles
```

## Browser Requirements

For Web Speech API to work:
- ✅ Chrome 25+
- ✅ Edge 79+
- ✅ Safari 14.1+
- ❌ Firefox (limited support)

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory, ready for deployment to Vercel or any static hosting.
