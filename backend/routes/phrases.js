import express from 'express';
import Phrase from '../models/Phrase.js';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get phrases for a specific language and situation
router.get('/', async (req, res, next) => {
    try {
        const { languageId, situation } = req.query;

        if (!languageId || !situation) {
            return res.status(400).json({
                success: false,
                error: 'languageId and situation are required'
            });
        }

        const phrases = await Phrase.find({ languageId, situation })
            .select('-__v')
            .sort({ order: 1 });

        res.json({
            success: true,
            data: phrases,
            count: phrases.length
        });
    } catch (error) {
        next(error);
    }
});

// Submit phrase attempt with pronunciation accuracy
router.post('/:phraseId/attempt', authMiddleware, async (req, res, next) => {
    try {
        const { phraseId } = req.params;
        const { userTranscript } = req.body;

        if (!userTranscript) {
            return res.status(400).json({
                success: false,
                error: 'userTranscript is required'
            });
        }

        // Get the phrase
        const phrase = await Phrase.findById(phraseId);

        if (!phrase) {
            return res.status(404).json({
                success: false,
                error: 'Phrase not found'
            });
        }

        // Calculate accuracy using simple comparison
        const accuracy = calculateAccuracy(userTranscript, phrase.local);

        // Calculate XP earned
        let xpEarned = 0;
        let feedbackMessage = '';

        if (accuracy >= 90) {
            xpEarned = 50;
            feedbackMessage = '🎉 Perfect! Excellent pronunciation!';
        } else if (accuracy >= 70) {
            xpEarned = 30;
            feedbackMessage = '👍 Good job! Keep practicing!';
        } else if (accuracy >= 50) {
            xpEarned = 10;
            feedbackMessage = '😊 Not bad! Try again for better accuracy.';
        } else {
            xpEarned = 5;
            feedbackMessage = '💪 Keep practicing! You\'ll get better.';
        }

        // Update user progress
        let progress = await UserProgress.findOne({
            userId: req.userId,
            languageId: phrase.languageId,
            situation: phrase.situation
        });

        if (!progress) {
            progress = await UserProgress.create({
                userId: req.userId,
                languageId: phrase.languageId,
                situation: phrase.situation,
                phrasesCompleted: [],
                totalAttempts: 0,
                averageAccuracy: 0,
                xpEarned: 0
            });
        }

        // Update phrase completion
        const existingPhrase = progress.phrasesCompleted.find(
            p => p.phraseId.toString() === phraseId
        );

        if (existingPhrase) {
            existingPhrase.attempts += 1;
            existingPhrase.bestAccuracy = Math.max(existingPhrase.bestAccuracy, accuracy);
        } else {
            progress.phrasesCompleted.push({
                phraseId,
                attempts: 1,
                bestAccuracy: accuracy,
                completedAt: new Date()
            });
        }

        progress.totalAttempts += 1;
        progress.xpEarned += xpEarned;
        progress.lastCompletedAt = new Date();

        // Recalculate average accuracy
        const totalAccuracy = progress.phrasesCompleted.reduce(
            (sum, p) => sum + p.bestAccuracy, 0
        );
        progress.averageAccuracy = totalAccuracy / progress.phrasesCompleted.length;

        await progress.save();

        // Update user XP and level
        const user = await User.findById(req.userId);
        user.totalXP += xpEarned;

        // Simple leveling system
        user.level = Math.floor(user.totalXP / 500) + 1;

        // Update last activity
        user.lastActivityDate = new Date();

        await user.save();

        res.json({
            success: true,
            data: {
                accuracy,
                xpEarned,
                feedbackMessage,
                totalXP: user.totalXP,
                level: user.level,
                progressStats: {
                    phrasesCompleted: progress.phrasesCompleted.length,
                    averageAccuracy: Math.round(progress.averageAccuracy),
                    totalAttempts: progress.totalAttempts
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// Simple accuracy calculation (Levenshtein distance-based)
function calculateAccuracy(input, expected) {
    const normalize = str => str.toLowerCase().replace(/[.,!?]/g, '').trim();

    const normalizedInput = normalize(input);
    const normalizedExpected = normalize(expected);

    const distance = levenshteinDistance(normalizedInput, normalizedExpected);
    const maxLength = Math.max(normalizedInput.length, normalizedExpected.length);

    if (maxLength === 0) return 0;

    const accuracy = ((maxLength - distance) / maxLength) * 100;
    return Math.round(accuracy);
}

// Levenshtein distance algorithm
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[m][n];
}

export default router;
