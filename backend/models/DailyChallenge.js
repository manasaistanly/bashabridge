import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['phrases', 'accuracy', 'streak', 'language'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    target: {
        type: Number,
        required: true
    },
    xpReward: {
        type: Number,
        default: 100
    },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    }
}, { timestamps: true });

const userDailyChallengeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyChallenge',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

userDailyChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);
const UserDailyChallenge = mongoose.model('UserDailyChallenge', userDailyChallengeSchema);

export { DailyChallenge, UserDailyChallenge };
