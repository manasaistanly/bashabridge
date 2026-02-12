import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true // 'ta', 'te', 'hi', 'kn', 'ml', 'mr'
    },
    nativeScript: {
        type: String,
        required: true // 'தமிழ்', 'తెలుగు', etc.
    },
    flag: {
        type: String // Emoji or URL
    },
    region: {
        type: String // 'South India', 'North India', etc.
    },
    nativeSpeakers: {
        type: Number // Number of speakers
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    totalSituations: {
        type: Number,
        default: 0
    },
    totalPhrases: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Language = mongoose.model('Language', languageSchema);

export default Language;
