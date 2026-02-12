import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '🏆'
    },
    type: {
        type: String,
        enum: ['milestone', 'streak', 'accuracy', 'language', 'special', 'level'],
        required: true
    },
    requirement: {
        type: Number,
        required: true
    },
    xpReward: {
        type: Number,
        default: 50
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
