import Phrase from '../models/Phrase.js';
import Language from '../models/Language.js';

export const handleChat = async (req, res) => {
    try {
        const { message, languageId } = req.body;

        if (!message || !languageId) {
            return res.status(400).json({ success: false, error: 'Message and languageId are required' });
        }

        const language = await Language.findById(languageId);
        if (!language) {
            return res.status(404).json({ success: false, error: 'Language not found' });
        }

        // Simple keyword matching logic
        // In a real app, this would call an LLM (OpenAI/Gemini)

        const keywords = message.toLowerCase().split(' ');

        // Find a relevant phrase from our database
        // We look for phrases where the English or Local text contains one of the keywords
        const phrases = await Phrase.find({
            languageId: languageId,
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
            // Pick a random relevant phrase
            const phrase = phrases[Math.floor(Math.random() * phrases.length)];
            responseText = phrase.local;
            translationText = phrase.english;
            audioText = phrase.local;
        } else {
            // Fallback responses if no match found
            const fallbacks = [
                { local: "I'm still learning too!", en: "I am still learning too!" },
                { local: "Can you say that again?", en: "Can you say that again?" },
                { local: "Tell me more.", en: "Tell me more." },
                { local: `Let's practice "${language.name}".`, en: `Let's practice ${language.name}.` }
            ];
            const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

            // Try to find a "General Conversation" greeting if it's the start
            if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                const greeting = await Phrase.findOne({
                    languageId,
                    situation: 'General Conversation',
                    english: { $regex: 'hello', $options: 'i' }
                });
                if (greeting) {
                    responseText = greeting.local;
                    translationText = greeting.english;
                    audioText = greeting.local;
                } else {
                    responseText = fallback.local;
                    translationText = fallback.en;
                    audioText = fallback.local;
                }
            } else {
                responseText = fallback.local;
                translationText = fallback.en;
                audioText = fallback.local;
            }
        }

        res.json({
            success: true,
            data: {
                message: responseText,
                translation: translationText,
                audio: audioText
            }
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
