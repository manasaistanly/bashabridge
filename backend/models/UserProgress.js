import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    languageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    situation: {
        type: String,
        required: true
    },
    phrasesCompleted: [{
        phraseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Phrase'
        },
        attempts: {
            type: Number,
            default: 1
        },
        bestAccuracy: {
            type: Number,
            default: 0
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalAttempts: {
        type: Number,
        default: 0
    },
    averageAccuracy: {
        type: Number,
        default: 0
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    lastCompletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
userProgressSchema.index({ userId: 1, languageId: 1, situation: 1 });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
