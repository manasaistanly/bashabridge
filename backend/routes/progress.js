import express from 'express';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user's overall progress
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const allProgress = await UserProgress.find({ userId: req.userId })
            .populate('languageId', 'name nativeScript');

        // Calculate total stats
        const totalPhrasesCompleted = allProgress.reduce(
            (sum, p) => sum + p.phrasesCompleted.length, 0
        );

        const totalAttempts = allProgress.reduce(
            (sum, p) => sum + p.totalAttempts, 0
        );

        const languagesLearning = [...new Set(allProgress.map(p => p.languageId._id.toString()))].length;

        res.json({
            success: true,
            data: {
                totalXP: user.totalXP,
                level: user.level,
                currentStreak: user.currentStreak,
                totalPhrasesCompleted,
                totalAttempts,
                languagesLearning,
                progressByLanguage: allProgress.map(p => ({
                    language: p.languageId,
                    situation: p.situation,
                    phrasesCompleted: p.phrasesCompleted.length,
                    averageAccuracy: Math.round(p.averageAccuracy),
                    xpEarned: p.xpEarned,
                    lastCompletedAt: p.lastCompletedAt
                }))
            }
        });
    } catch (error) {
        next(error);
    }
});

// Get progress for specific language
router.get('/:languageId', authMiddleware, async (req, res, next) => {
    try {
        const { languageId } = req.params;

        const progress = await UserProgress.find({
            userId: req.userId,
            languageId
        }).populate('languageId', 'name nativeScript');

        const totalPhrasesCompleted = progress.reduce(
            (sum, p) => sum + p.phrasesCompleted.length, 0
        );

        const totalXPEarned = progress.reduce(
            (sum, p) => sum + p.xpEarned, 0
        );

        res.json({
            success: true,
            data: {
                language: progress[0]?.languageId || null,
                totalPhrasesCompleted,
                totalXPEarned,
                situations: progress.map(p => ({
                    situation: p.situation,
                    phrasesCompleted: p.phrasesCompleted.length,
                    averageAccuracy: Math.round(p.averageAccuracy),
                    totalAttempts: p.totalAttempts,
                    lastCompletedAt: p.lastCompletedAt
                }))
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
