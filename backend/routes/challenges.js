import express from 'express';
import { DailyChallenge, UserDailyChallenge } from '../models/DailyChallenge.js';
import User from '../models/User.js';
import { authMiddleware as authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get today's challenge
router.get('/today', authenticate, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let challenge = await DailyChallenge.findOne({ date: today }).populate('language');

        if (!challenge) {
            challenge = await generateDailyChallenge(today);
        }

        const userProgress = await UserDailyChallenge.findOne({
            user: req.user.id,
            challenge: challenge._id
        });

        res.json({
            success: true,
            data: {
                challenge,
                progress: userProgress?.progress || 0,
                completed: userProgress?.completed || false
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update challenge progress
router.post('/progress', authenticate, async (req, res) => {
    try {
        const { challengeId, increment = 1 } = req.body;
        const challenge = await DailyChallenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ success: false, error: 'Challenge not found' });
        }

        let userChallenge = await UserDailyChallenge.findOne({
            user: req.user.id,
            challenge: challengeId
        });

        if (!userChallenge) {
            userChallenge = new UserDailyChallenge({
                user: req.user.id,
                challenge: challengeId,
                progress: 0
            });
        }

        userChallenge.progress += increment;

        if (userChallenge.progress >= challenge.target && !userChallenge.completed) {
            userChallenge.completed = true;
            userChallenge.completedAt = new Date();

            const user = await User.findById(req.user.id);
            user.xp += challenge.xpReward;
            await user.save();
        }

        await userChallenge.save();

        res.json({ success: true, data: userChallenge });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

async function generateDailyChallenge(date) {
    const challenges = [
        { type: 'phrases', description: 'Complete 5 phrases today', target: 5, xpReward: 100 },
        { type: 'accuracy', description: 'Achieve 80%+ accuracy on 3 attempts', target: 3, xpReward: 150 },
        { type: 'streak', description: 'Maintain your learning streak', target: 1, xpReward: 75 }
    ];

    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

    return await DailyChallenge.create({
        date,
        ...randomChallenge
    });
}

export default router;
