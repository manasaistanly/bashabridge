import { GoogleGenerativeAI } from '@google/generative-ai';
import Language from '../models/Language.js';
import Phrase from '../models/Phrase.js';

export const handleChat = async (req, res) => {
    try {
        const { message, languageId } = req.body;

        // 1. Validate Input
        if (!message || !languageId) {
            return res.status(400).json({ success: false, error: 'Message and languageId are required' });
        }

        // 2. Fetch Language
        const language = await Language.findById(languageId);
        if (!language) {
            return res.status(404).json({ success: false, error: 'Language not found' });
        }

        // 3. Fallback if no API Key
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is not set. Falling back to keyword matching.');
            return handleFallbackChat(req, res, language);
        }

        // 4. Try Gemini API with multiple model fallbacks
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            // Try different model names in order of preference
            const modelNames = [
                'gemini-2.5-flash',
                'gemini-1.5-flash',
                'gemini-1.5-pro',
                'gemini-pro',
                'gemini-2.0-flash-exp'
            ];

            let model = null;
            let successfulModel = null;

            for (const modelName of modelNames) {
                try {
                    model = genAI.getGenerativeModel({ model: modelName });
                    successfulModel = modelName;
                    console.log(`Using model: ${modelName}`);
                    break;
                } catch (err) {
                    console.log(`Model ${modelName} not available, trying next...`);
                    continue;
                }
            }

            if (!model) {
                throw new Error('No available Gemini models found');
            }

            const prompt = `You are an expert language tutor teaching ${language.name}. 
            The user is a beginner/intermediate student.
            
            User's message: "${message}"

            Respond in valid JSON format ONLY, with the following structure:
            {
                "message": "Your response in ${language.name} (native script)",
                "translation": "English translation of your response",
                "audio": "The text to be spoken (usually the same as message)"
            }

            Keep the response helpful, encouraging, and appropriate for a language learner.
            If the user asks for a specific phrase, provide it.
            If the user just wants to chat, converse naturally in ${language.name}.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonStr);

            res.json({
                success: true,
                data: data
            });

        } catch (apiError) {
            console.error('Gemini API Error:', apiError.message || apiError);
            return handleFallbackChat(req, res, language);
        }

    } catch (error) {
        console.error('Chat Server Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fallback logic (original keyword matching)
const handleFallbackChat = async (req, res, language) => {
    try {
        const { message } = req.body;
        const keywords = message.toLowerCase().split(' ');

        const phrases = await Phrase.find({
            languageId: language._id,
            $or: [
                { english: { $regex: keywords.join('|'), $options: 'i' } },
                { local: { $regex: keywords.join('|'), $options: 'i' } },
                { tags: { $in: keywords } }
            ]
        }).limit(3);

        let responseText = '';
        let translationText = '';
        let audioText = '';

        if (phrases.length > 0) {
            const phrase = phrases[Math.floor(Math.random() * phrases.length)];
            responseText = phrase.local;
            translationText = phrase.english;
            audioText = phrase.local;
        } else {
            const fallbacks = [
                { local: "I'm having trouble connecting to my brain, but I'm still learning!", en: "I'm having trouble connecting to my brain, but I'm still learning!" },
                { local: `Let's practice "${language.name}".`, en: `Let's practice ${language.name}.` }
            ];
            const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            responseText = fallback.local;
            translationText = fallback.en;
            audioText = fallback.local;
        }

        res.json({
            success: true,
            data: {
                message: responseText,
                translation: translationText,
                audio: audioText
            }
        });
    } catch (err) {
        console.error('Fallback Error:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
