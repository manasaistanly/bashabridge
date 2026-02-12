# BhashaBridge Backend

AI-powered Indian language learning platform - Backend API

## Prerequisites

- Node.js 20+
- MongoDB (local or MongoDB Atlas)

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
# Update .env with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/bhashabridge
```

3. **Seed database with sample data**
```bash
npm run seed
```

4. **Start development server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Languages
- `GET /api/languages` - Get all languages
- `GET /api/languages/:id` - Get language details
- `GET /api/languages/:id/situations` - Get situations for language

### Phrases
- `GET /api/phrases?languageId=&situation=` - Get phrases
- `POST /api/phrases/:id/attempt` - Submit pronunciation attempt (Protected)

### Progress
- `GET /api/progress` - Get user overall progress (Protected)
- `GET /api/progress/:languageId` - Get language-specific progress (Protected)

## Project Structure

```
backend/
├── config/         # Database configuration
├── models/         # Mongoose models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── scripts/        # Utility scripts (seeding)
└── server.js       # Entry point
```

## Technologies

- Express.js - Web framework
- MongoDB + Mongoose - Database
- JWT - Authentication
- Bcrypt - Password hashing
