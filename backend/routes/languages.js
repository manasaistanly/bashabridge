import express from 'express';
import Language from '../models/Language.js';
import Phrase from '../models/Phrase.js';

const router = express.Router();

// Get all active languages
router.get('/', async (req, res, next) => {
    try {
        const languages = await Language.find({ isActive: true })
            .select('-__v')
            .sort({ name: 1 });

        res.json({
            success: true,
            data: languages,
            count: languages.length
        });
    } catch (error) {
        next(error);
    }
});

// Get language by ID with statistics
router.get('/:languageId', async (req, res, next) => {
    try {
        const { languageId } = req.params;

        const language = await Language.findById(languageId);

        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        // Get situations for this language
        const phrases = await Phrase.find({ languageId }).select('situation');
        const situations = [...new Set(phrases.map(p => p.situation))];

        res.json({
            success: true,
            data: {
                ...language.toObject(),
                situations,
                totalSituations: situations.length
            }
        });
    } catch (error) {
        next(error);
    }
});

// Get all situations for a language
router.get('/:languageId/situations', async (req, res, next) => {
    try {
        const { languageId } = req.params;

        // Get unique situations
        const phrases = await Phrase.find({ languageId }).select('situation difficulty');

        const situationsMap = new Map();

        phrases.forEach(phrase => {
            if (!situationsMap.has(phrase.situation)) {
                situationsMap.set(phrase.situation, {
                    name: phrase.situation,
                    phraseCount: 0,
                    difficulty: phrase.difficulty
                });
            }
            situationsMap.get(phrase.situation).phraseCount++;
        });

        const situations = Array.from(situationsMap.values());

        res.json({
            success: true,
            data: situations,
            count: situations.length
        });
    } catch (error) {
        next(error);
    }
});

export default router;
