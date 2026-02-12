import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLearningStore from '../store/learningStore';
import useAuthStore from '../store/authStore';
import { phraseAPI } from '../services/api';

export default function Learning() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        selectedLanguage,
        selectedSituation,
        situations,
        phrases,
        currentPhraseIndex,
        setSituation,
        fetchPhrases,
        nextPhrase,
        previousPhrase
    } = useLearningStore();

    const [isListening, setIsListening] = useState(false);
    const [userTranscript, setUserTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Redirect if no language selected
    useEffect(() => {
        if (!selectedLanguage) {
            navigate('/');
        }
    }, [selectedLanguage, navigate]);

    const handleSituationSelect = async (situation) => {
        setSituation(situation.name);
        await fetchPhrases(selectedLanguage._id, situation.name);
    };

    const currentPhrase = phrases[currentPhraseIndex];

    // Text-to-Speech functionality
    const handlePlayPhrase = () => {
        if ('speechSynthesis' in window && currentPhrase) {
            setIsPlaying(true);
            const utterance = new SpeechSynthesisUtterance(currentPhrase.local);

            // Try to use Hindi/Indian voice if available
            const voices = window.speechSynthesis.getVoices();
            const indianVoice = voices.find(voice =>
                voice.lang.startsWith('hi') || voice.lang.startsWith('ta')
            );
            if (indianVoice) {
                utterance.voice = indianVoice;
            }

            utterance.rate = 0.8; // Slower for learning
            utterance.onend = () => setIsPlaying(false);

            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-Speech not supported in your browser');
        }
    };

    // Speech Recognition functionality
    const handleStartListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = selectedLanguage.code + '-IN';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
                setUserTranscript('');
                setFeedback(null);
            };

            recognition.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                setUserTranscript(transcript);

                // Submit to backend for comparison
                try {
                    const response = await phraseAPI.submitAttempt(currentPhrase._id, {
                        userTranscript: transcript
                    });

                    setFeedback(response.data.data);
                } catch (error) {
                    console.error('Failed to submit attempt:', error);
                    setFeedback({
                        feedbackMessage: 'Error checking pronunciation. Please try again.',
                        accuracy: 0
                    });
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setFeedback({
                    feedbackMessage: 'Could not recognize speech. Please try again.',
                    accuracy: 0
                });
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } else {
            alert('Speech Recognition not supported in your browser. Please use Chrome or Edge.');
        }
    };

    if (!selectedLanguage) return null;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="btn btn-secondary">
                            ← Back
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-primary-600">
                                {selectedLanguage.flag} {selectedLanguage.name}
                            </h1>
                            {selectedSituation && (
                                <p className="text-sm text-gray-600">Situation: {selectedSituation}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Learning as:</p>
                        <p className="font-medium text-gray-800">{user?.firstName}</p>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Situation Selection */}
                {!selectedSituation && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Situation</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {situations.map((situation, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSituationSelect(situation)}
                                    className="card hover:shadow-lg transition-shadow text-left group"
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600">
                                        {situation.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {situation.phraseCount} phrases • {situation.difficulty}
                                    </p>
                                    <div className="mt-4 text-primary-600 font-medium">
                                        Start Practice →
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Interface */}
                {selectedSituation && currentPhrase && (
                    <div>
                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Phrase {currentPhraseIndex + 1} of {phrases.length}</span>
                                <span>{Math.round(((currentPhraseIndex + 1) / phrases.length) * 100)}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all"
                                    style={{ width: `${((currentPhraseIndex + 1) / phrases.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Phrase Card */}
                        <div className="card bg-gradient-to-br from-white to-primary-50 mb-6">
                            <div className="text-center">
                                <p className="text-gray-600 mb-2">English:</p>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    "{currentPhrase.english}"
                                </h2>

                                <p className="text-gray-600 mb-2">{selectedLanguage.name}:</p>
                                <h3 className="text-4xl font-bold text-primary-600 mb-4">
                                    {currentPhrase.local}
                                </h3>

                                <p className="text-gray-500 text-sm mb-6">
                                    Pronunciation: {currentPhrase.transliteration}
                                </p>

                                {/* Play Audio Button */}
                                <button
                                    onClick={handlePlayPhrase}
                                    disabled={isPlaying}
                                    className="btn btn-primary text-lg px-8 py-3"
                                >
                                    {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
                                </button>
                            </div>
                        </div>

                        {/* Practice Section */}
                        <div className="card mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Turn!</h3>

                            <button
                                onClick={handleStartListening}
                                disabled={isListening}
                                className={`w-full py-6 rounded-lg font-bold text-lg ${isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-primary-600 text-white hover:bg-primary-700'
                                    }`}
                            >
                                {isListening ? '🎤 Listening...' : '🎤 Start Speaking'}
                            </button>

                            {userTranscript && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">You said:</p>
                                    <p className="text-lg font-medium text-gray-800">"{userTranscript}"</p>
                                </div>
                            )}

                            {feedback && (
                                <div className={`mt-4 p-6 rounded-lg ${feedback.accuracy >= 70 ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
                                    }`}>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold mb-2">
                                            {feedback.accuracy}% Accurate
                                        </p>
                                        <p className="text-lg mb-4">{feedback.feedbackMessage}</p>
                                        {feedback.xpEarned > 0 && (
                                            <p className="text-primary-600 font-bold">
                                                +{feedback.xpEarned} XP Earned! 🎉
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <button
                                onClick={previousPhrase}
                                disabled={currentPhraseIndex === 0}
                                className="btn btn-secondary disabled:opacity-50"
                            >
                                ← Previous
                            </button>

                            <button onClick={() => setSituation(null)} className="btn btn-secondary">
                                Change Situation
                            </button>

                            <button
                                onClick={nextPhrase}
                                disabled={currentPhraseIndex === phrases.length - 1}
                                className="btn btn-primary disabled:opacity-50"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
