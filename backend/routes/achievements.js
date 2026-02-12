import express from 'express';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import User from '../models/User.js';
import { authMiddleware as authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all achievements with user progress
router.get('/', authenticate, async (req, res) => {
    try {
        const achievements = await Achievement.find({ isActive: true });
        const userAchievements = await UserAchievement.find({ user: req.user.id });

        const achievementsWithProgress = achievements.map(achievement => {
            const userAch = userAchievements.find(ua => ua.achievement.toString() === achievement._id.toString());
            return {
                ...achievement.toObject(),
                unlocked: !!userAch,
                unlockedAt: userAch?.unlockedAt,
                progress: userAch?.progress || 0
            };
        });

        res.json({ success: true, data: achievementsWithProgress });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user's unlocked achievements
router.get('/user', authenticate, async (req, res) => {
    try {
        const userAchievements = await UserAchievement.find({ user: req.user.id })
            .populate('achievement')
            .sort({ unlockedAt: -1 });

        res.json({ success: true, data: userAchievements });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check and award achievements
export async function checkAchievements(userId) {
    try {
        const user = await User.findById(userId);
        const achievements = await Achievement.find({ isActive: true });
        const newlyUnlocked = [];

        for (const achievement of achievements) {
            const existing = await UserAchievement.findOne({ user: userId, achievement: achievement._id });
            if (existing) continue;

            let shouldUnlock = false;
            let progress = 0;

            switch (achievement.type) {
                case 'milestone':
                    progress = user.phrasesCompleted || 0;
                    shouldUnlock = progress >= achievement.requirement;
                    break;
                case 'streak':
                    progress = user.streak || 0;
                    shouldUnlock = progress >= achievement.requirement;
                    break;
                case 'accuracy':
                    progress = user.averageAccuracy || 0;
                    shouldUnlock = progress >= achievement.requirement;
                    break;
                case 'level':
                    progress = user.level || 1;
                    shouldUnlock = progress >= achievement.requirement;
                    break;
            }

            if (shouldUnlock) {
                const userAch = await UserAchievement.create({
                    user: userId,
                    achievement: achievement._id,
                    progress: achievement.requirement
                });

                user.xp += achievement.xpReward;
                await user.save();

                newlyUnlocked.push(await userAch.populate('achievement'));
            } else {
                await UserAchievement.findOneAndUpdate(
                    { user: userId, achievement: achievement._id },
                    { progress },
                    { upsert: true }
                );
            }
        }

        return newlyUnlocked;
    } catch (error) {
        console.error('Achievement check error:', error);
        return [];
    }
}

export { router };
