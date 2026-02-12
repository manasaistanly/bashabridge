# 🌏 BhashaBridge
## AI-Powered Indian Language Learning Platform

**Learn Indian languages through real-life conversations, not grammar rules.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install

# Configure environment (.env already created)
# Update MONGODB_URI if needed

# Seed database with sample data (6 languages, 15 phrases each)
npm run seed

# Start backend server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Start frontend development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## ✨ Features

### ✅ Implemented in Prototype

- **User Authentication** - Secure registration and login with JWT
- **6 Indian Languages** - Tamil, Telugu, Hindi, Kannada, Malayalam, Marathi
- **Situation-Based Learning** - Tea Shop, Bus Stand, Restaurant scenarios
- **Web Speech API Integration**
  - 🔊 Text-to-Speech for native pronunciation
  - 🎤 Speech Recognition for practice
- **Real-Time Pronunciation Feedback** - Levenshtein distance algorithm
- **Gamification System** - XP, levels, progress tracking
- **User Dashboard** - Stats, progress by language, achievements
- **Responsive Design** - Works on desktop and mobile

### 🎯 Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios
- Web Speech API

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt password hashing

---

## 📖 How to Use

1. **Register a new account** or **Login**
2. **Choose a language** (e.g., Tamil)
3. **Select a situation** (e.g., Tea Shop)
4. **Listen** to native pronunciation (🔊 button)
5. **Practice speaking** (🎤 button)
6. **Get instant feedback** on accuracy
7. **Earn XP** and level up!
8. **Track progress** on Dashboard

---

## 🗂️ Project Structure

```
BhashaBridge/
├── backend/
│   ├── config/           # Database connection
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & error handling
│   ├── scripts/          # Database seeding
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── store/        # Zustand stores
│   │   ├── services/     # API client
│   │   └── index.css     # Tailwind CSS
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## 🎨 Sample Phrases

**Tamil - Tea Shop:**
- "Give me one tea, please" → "Oru tea kudunga"  
- "How much is the tea?" → "Tea evlo?"

**Hindi - Bus Stand:**
- "Which bus goes to Connaught Place?" → "Connaught Place ki konsi bus jati hai?"
- "When will the bus come?" → "Bus kab aayegi?"

**Telugu - Restaurant:**
- "What do you have for lunch?" → "Lunch ki emundi?"
- "This is too spicy" → "Idi chala karam"

*All phrases include transliteration for pronunciation help!*

---

## 🎯 Learning Flow

```
Register/Login
    ↓
Choose Language (6 options)
    ↓
Select Situation (Tea Shop, Bus Stand, Restaurant)
    ↓
Learn Phrases
    • Listen to pronunciation
    • Practice speaking
    • Get accuracy feedback
    • Earn XP
    ↓
Track Progress on Dashboard
```

---

## 🌟 Key Differentiators

1. **Situation-Based Learning** - Practical, real-world phrases
2. **Speech Recognition** - Practice pronunciation, not just reading
3. **Instant Feedback** - Know your accuracy immediately
4. **Gamification** - XP, levels, streaks keep you motivated
5. **6 Languages** - Comprehensive Indian language coverage

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile (protected)

### Languages
- `GET /api/languages` - Get all languages
- `GET /api/languages/:id` - Get language details
- `GET /api/languages/:id/situations` - Get situations

### Phrases & Learning
- `GET /api/phrases?languageId=&situation=` - Get phrases
- `POST /api/phrases/:id/attempt` - Submit pronunciation (protected)

### Progress
- `GET /api/progress` - Get overall progress (protected)
- `GET /api/progress/:languageId` - Language-specific progress (protected)

---

## 📊 Database Schema

### Collections:
- **users** - User accounts (email, password, XP, level, streak)
- **languages** - Language metadata (name, code, difficulty, speakers)
- **phrases** - Learning content (English, local, transliteration)
- **userprogress** - Learning progress per user/language/situation

---

## 🎤 Browser Compatibility

**Web Speech API Support:**
- ✅ Chrome 25+
- ✅ Edge 79+
- ✅ Safari 14.1+ (limited)
- ❌ Firefox (no support)

**Recommended:** Use Chrome or Edge for best experience.

---

## 🚧 Future Enhancements

- ✨ **Whisper API** integration for better speech recognition
- ✨ **OpenAI GPT** for AI chat simulations
- ✨ **More situations** (Hospital, Office, Bank, etc.)
- ✨ **More phrases** (30+ per situation)
- ✨ **Leaderboards** and social features
- ✨ **Mobile apps** (React Native)
- ✨ **Offline support** with Service Workers

---

## 👨‍💻 Development

**Backend:**
```bash
cd backend
npm run dev    # Start with nodemon
npm run seed   # Reseed database
```

**Frontend:**
```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 📝 License

MIT License - Free to use for learning and portfolio projects.

---

## 🙏 Credits

Built with ❤️ for language learners across India.

**Languages supported:**
- தமிழ் (Tamil)
- తెలుగు (Telugu)
- हिंदी (Hindi)
- ಕನ್ನಡ (Kannada)
- മലയാളം (Malayalam)
- मराठी (Marathi)

---

**Happy Learning! 🎉**
