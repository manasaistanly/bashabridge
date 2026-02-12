import mongoose from 'mongoose';

const phraseSchema = new mongoose.Schema({
    languageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    situation: {
        type: String,
        required: true // 'Tea Shop', 'Bus Stand', etc.
    },
    english: {
        type: String,
        required: true
    },
    local: {
        type: String,
        required: true
    },
    transliteration: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    tags: [{
        type: String
    }],
    order: {
        type: Number,
        default: 0 // Order within a situation
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
phraseSchema.index({ languageId: 1, situation: 1 });

const Phrase = mongoose.model('Phrase', phraseSchema);

export default Phrase;
